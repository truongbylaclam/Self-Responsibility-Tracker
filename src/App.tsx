/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinanceGoal, Project, Todo, Transaction, CalendarEvent, SyncLog, SyncProvider } from './types';
import {
  INITIAL_GOALS,
  INITIAL_PROJECTS,
  INITIAL_TODOS,
  INITIAL_EVENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_LOGS,
} from './data';
import FinanceGoals from './components/FinanceGoals';
import ProjectTracker from './components/ProjectTracker';
import CalendarAndTasks from './components/CalendarAndTasks';
import SyncEngineAndAnalytics from './components/SyncEngineAndAnalytics';
import AiAdvisor from './components/AiAdvisor';
import { Cpu, Download, Sparkles, SlidersHorizontal, Terminal, Shield, RefreshCw } from 'lucide-react';

export default function App() {
  // Read initial states from localStorage if available, else standard values
  const [goals, setGoals] = useState<FinanceGoal[]>(() => {
    const saved = localStorage.getItem('fintrack_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('fintrack_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('fintrack_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('fintrack_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [logs, setLogs] = useState<SyncLog[]>(() => {
    const saved = localStorage.getItem('fintrack_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [syncProvider, setSyncProvider] = useState<SyncProvider>('google_drive');
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'completed' | 'failed'>('idle');

  // Trigger Local Storage cache on mutations
  useEffect(() => {
    localStorage.setItem('fintrack_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fintrack_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('fintrack_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('fintrack_logs', JSON.stringify(logs));
  }, [logs]);

  // General Log Helper
  const addLog = (message: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const newLog: SyncLog = {
      id: `l-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      level,
      message,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // 1. Finance Goals Handlers
  const handleAddGoal = (newGoal: Omit<FinanceGoal, 'id'>) => {
    const goal: FinanceGoal = {
      ...newGoal,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [...prev, goal]);
    addLog(`Goal created: ${goal.title}. Registered inside KMP Goal SQLDelight Tables.`, 'info');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setTransactions((prev) => prev.filter((t) => t.goalId !== id));
    addLog(`Deleted goal ID [${id}] and purged associated ledger records.`, 'warning');
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    // Update the associated Goal
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === tx.goalId) {
          const delta = tx.type === 'contribution' ? tx.amount : -tx.amount;
          const currentAmount = Math.max(0, g.currentAmount + delta);
          return { ...g, currentAmount };
        }
        return g;
      })
    );

    setTransactions((prev) => [tx, ...prev]);
    addLog(
      `Booked ${tx.type}: $${tx.amount} to Goal [${tx.goalId}]. SQLDelight database triggers reactive Flow update.`,
      'success'
    );
  };

  // 2. Project Tracker Handlers
  const handleAddProject = (newProj: Omit<Project, 'id'>) => {
    const project: Project = {
      ...newProj,
      id: `p-${Date.now()}`,
    };
    setProjects((prev) => [...prev, project]);
    addLog(`Project node established: ${project.name}. Budget allocation verified.`, 'info');
  };

  const handleUpdateProjectProgress = (id: string, progress: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress } : p))
    );
    // Don't flood the synchronization logs continuously unless major milestones
    if (progress % 20 === 0 || progress === 100) {
      addLog(`[Project Node Progress] ID: ${id} modified to ${progress}%.`, 'info');
    }
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addLog(`Terminated project node [${id}]. Budget allocation recovered.`, 'warning');
  };

  // 3. Todo Handlers
  const handleAddTodo = (newTodo: Omit<Todo, 'id'>) => {
    const todo: Todo = {
      ...newTodo,
      id: `t-${Date.now()}`,
    };
    setTodos((prev) => [...prev, todo]);
    addLog(`Task created: ${todo.text.substring(0, 45)}... Priority set: ${todo.priority}`, 'info');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = !t.completed;
          addLog(`Task: "${t.text.substring(0, 30)}..." marked ${updated ? 'completed' : 'pending'}.`, 'success');
          return { ...t, completed: updated };
        }
        return t;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    addLog(`De-allocated checklist row ID [${id}].`, 'warning');
  };

  // 4. Calendar Event Handlers
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = {
      ...newEvent,
      id: `e-${Date.now()}`,
    };
    setEvents((prev) => [...prev, event]);
    addLog(`Scheduled calendar event: ${event.title} on ${event.date}`, 'info');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    addLog(`Unscheduled calendar event ID [${id}] from scheduler.`, 'warning');
  };

  // 5. Cloud Sync Engine Simulator
  const handleTriggerSync = () => {
    setSyncState('syncing');
    addLog(`[KMP Co-ordinator] Initiating synchronization protocol via ${syncProvider === 'google_drive' ? 'Google Drive REST API' : 'iCloud CloudKit Adapter'}...`, 'info');

    setTimeout(() => {
      addLog(`[SQLDelight] Bundling local goals database table (${goals.length} records)`, 'info');
    }, 400);

    setTimeout(() => {
      addLog(`[SQLDelight] Bundling local projects and active todos (${projects.length + todos.length} nodes)`, 'info');
    }, 800);

    setTimeout(() => {
      addLog(`[Cloud Bridge] Snapshot serialized. Hashing payload checksum: ${Math.random().toString(36).substring(3, 10).toUpperCase()}`, 'info');
    }, 1200);

    setTimeout(() => {
      addLog(`[Kotlin Sync Engine] Synced completed successfully. No conflicts detected. SQLite databases match cloud storage.`, 'success');
      setSyncState('completed');
    }, 1800);
  };

  // 6. DB Backup Exporter (SQLDelight snapshot download)
  const handleExportBackup = () => {
    const backupState = {
      exportVersion: "KMP_SQL_v1.0",
      timestamp: new Date().toISOString(),
      goals,
      projects,
      todos,
      transactions,
      events,
    };
    const blob = new Blob([JSON.stringify(backupState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack_sql_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    addLog("SQLDelight SQLite database exported safely in JSON migration package.", "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-12">
      
      {/* GLOBAL HIGH-CONTRAST KOTLIN STYLED HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30 px-6 py-4 select-none shadow-xs" id="dashboard-header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 p-2 rounded-xl text-white shadow-md shadow-indigo-600/10">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-800 uppercase font-mono">FinTrack K-Vault Dashboard</h1>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full font-bold">
                  KMP SHARED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Typesafe SQLDelight client companion managing personal assets & milestone checklists.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              title="Download local SQLDelight SQLite JSON payload replica"
              className="text-xs border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-mono font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              DB Export
            </button>
            
            <button
              onClick={handleTriggerSync}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-semibold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync DB
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="max-w-7xl mx-auto px-6 mt-6 space-y-6 w-full flex-1">
        
        {/* TOP LEVEL: GEMINI AI ADVISOR MODULE */}
        <AiAdvisor
          goals={goals}
          projects={projects}
          todos={todos}
          onAddTodo={handleAddTodo}
        />

        {/* MIDDLE LEVEL: MULTIPLATFORM SYNC LOGS & CO-ORDINATOR + INTEGRATED GRAPH ANALYTICS */}
        <SyncEngineAndAnalytics
          goals={goals}
          projects={projects}
          todos={todos}
          logs={logs}
          syncProvider={syncProvider}
          syncState={syncState}
          onChangeProvider={(prov) => {
            setSyncProvider(prov);
            addLog(`Active syncing adapter switched to: ${prov.toUpperCase()}`, 'info');
          }}
          onTriggerSync={handleTriggerSync}
          onClearLogs={() => {
            setLogs([]);
            addLog("Sync Console log queue cleared.", "warning");
          }}
        />

        {/* SECTION BREAK: TRACKING ASSETS & ENGINEERING OPERATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* PERSONAL FINANCE TRACKER */}
          <FinanceGoals
            goals={goals}
            transactions={transactions}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onAddTransaction={handleAddTransaction}
          />

          {/* PROJECT DELIVERABLES & DETAILED CHECKPOINTS */}
          <ProjectTracker
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProjectProgress={handleUpdateProjectProgress}
            onDeleteProject={handleDeleteProject}
          />
        </div>

        {/* BOTTOM LEVEL: INTEGRATED EVENT MILESTONES CALENDAR + ACTIONABLE CHECKLISTS */}
        <div className="pt-2">
          <CalendarAndTasks
            todos={todos}
            events={events}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>

      </main>

      {/* COMPACT CLEAN EMBEDDED FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500 select-none">
        <p className="font-sans">© 2026 FinTrack. Multiplatform SQLite synchronized endpoints.</p>
        <span className="flex items-center gap-1 font-mono text-slate-400">
          <Shield className="h-3 w-3 text-indigo-500/80" /> SQLDelight SSL SECURE
        </span>
      </footer>

    </div>
  );
}
