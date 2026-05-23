/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceGoal, Project, Todo, SyncLog, SyncProvider } from '../types';
import { RefreshCw, Database, Terminal, Shield, Copy, Check, Info, TrendingUp, DollarSign, PieChart, Layers } from 'lucide-react';
import { KOTLIN_CODE_SQLDELIGHT, KOTLIN_CODE_SERVER } from '../data';

interface SyncEngineAndAnalyticsProps {
  goals: FinanceGoal[];
  projects: Project[];
  todos: Todo[];
  logs: SyncLog[];
  syncProvider: SyncProvider;
  syncState: 'idle' | 'syncing' | 'completed' | 'failed';
  onChangeProvider: (provider: SyncProvider) => void;
  onTriggerSync: () => void;
  onClearLogs: () => void;
}

export default function SyncEngineAndAnalytics({
  goals,
  projects,
  todos,
  logs,
  syncProvider,
  syncState,
  onChangeProvider,
  onTriggerSync,
  onClearLogs,
}: SyncEngineAndAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'sql_engine' | 'sync_portal' | 'kmp_code'>('sync_portal');
  const [activeTable, setActiveTable] = useState<'goals' | 'projects' | 'todos'>('goals');
  const [copiedCode, setCopiedCode] = useState<'sqldelight' | 'kt_server' | null>(null);

  // Financial calculations
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalProjectBudget = projects.reduce((sum, p) => sum + p.budgetAllocated, 0);
  const totalProjectSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);

  const netWorthEstimate = totalGoalCurrent + (totalProjectBudget - totalProjectSpent);
  const totalTasksCompleted = todos.filter((t) => t.completed).length;
  const totalTasks = todos.length;

  const handleCopy = (code: string, type: 'sqldelight' | 'kt_server') => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="sync-analytics-section">
      
      {/* LEFT COLUMN: REAL-TIME ANALYTICS (5 cols) */}
      <div className="xl:col-span-5 bg-white border border-slate-200 p-5 rounded-xl space-y-5 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Real-Time KMP Financial Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic asset indicators updated on SQLDelight transaction mutations.
          </p>
        </div>

        {/* Analytic Cards Grid */}
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 shadow-2xs">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[9px] uppercase tracking-wider font-bold">Liquid Net Worth</span>
              <DollarSign className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1.5">${netWorthEstimate.toLocaleString()}</div>
            <div className="text-[9px] text-emerald-600 mt-0.5 font-semibold">+15.3% vs Q1</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 shadow-2xs">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[9px] uppercase tracking-wider font-bold">Goals Covered</span>
              <PieChart className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1.5">
              ${totalGoalCurrent.toLocaleString()}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              Target: ${totalGoalTarget.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 shadow-2xs">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[9px] uppercase tracking-wider font-bold">Project Buffer</span>
              <Layers className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1.5">
              ${(totalProjectBudget - totalProjectSpent).toLocaleString()}
            </div>
            <div className="text-[9px] text-emerald-600 mt-0.5 font-semibold">
              Spent: ${totalProjectSpent.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 shadow-2xs">
            <div className="flex justify-between items-start text-slate-400">
              <span className="text-[9px] uppercase tracking-wider font-bold">Task Efficiency</span>
              <span className="text-indigo-600 text-xs font-bold">KMP</span>
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1.5">
              {totalTasks > 0 ? `${Math.round((totalTasksCompleted / totalTasks) * 100)}%` : '100%'}
            </div>
            <div className="text-[9px] text-slate-500 mt-0.5">
              {totalTasksCompleted}/{totalTasks} tasks ready
            </div>
          </div>
        </div>

        {/* Beautiful Custom SVG Gauge/Chart */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-150 select-none">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block mb-3 text-center font-bold">
            Cumulative Funding Target Ratios
          </span>
          
          <div className="flex flex-col items-center justify-center py-4">
            <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
              {/* Background Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Foreground Progress Arc */}
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#indigoGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (totalGoalTarget ? Math.min(100, (totalGoalCurrent / totalGoalTarget) * 100) : 0)) / 100}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <text x="50" y="45" textAnchor="middle" className="fill-slate-800 font-mono text-[10px] font-bold">
                {totalGoalTarget ? Math.round((totalGoalCurrent / totalGoalTarget) * 100) : 0}%
              </text>
            </svg>
            <p className="text-[10px] text-slate-500 font-mono text-center mt-2 font-medium">
              Finance Goal funding completion of total ${totalGoalTarget.toLocaleString()} target scale.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: REPOSITORY PORTAL & SQLDELIGHT ENGINE (7 cols) */}
      <div className="xl:col-span-7 bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 gap-2 mb-4">
          <button
            onClick={() => setActiveTab('sync_portal')}
            className={`text-xs py-2 px-4 border-b-2 font-medium tracking-tight cursor-pointer transition-colors ${
              activeTab === 'sync_portal'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Cloud Sync Portal
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('sql_engine')}
            className={`text-xs py-2 px-4 border-b-2 font-medium tracking-tight cursor-pointer transition-colors ${
              activeTab === 'sql_engine'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              SQLDelight Database Engine
            </span>
          </button>

          <button
            onClick={() => setActiveTab('kmp_code')}
            className={`text-xs py-2 px-4 border-b-2 font-medium tracking-tight cursor-pointer transition-colors ${
              activeTab === 'kmp_code'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5" />
              Kotlin Code snippets
            </span>
          </button>
        </div>

        {/* TABS VIEWPORTS */}
        <div className="flex-1">
          {/* TAB 1: SYNC PORTAL */}
          {activeTab === 'sync_portal' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Select Sync transport Adapter</span>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onChangeProvider('google_drive')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg border font-mono transition-all cursor-pointer ${
                        syncProvider === 'google_drive'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Google Drive
                    </button>
                    <button
                      onClick={() => onChangeProvider('apple_icloud')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg border font-mono transition-all cursor-pointer ${
                        syncProvider === 'apple_icloud'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Apple iCloud
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end justify-center">
                  <span className="text-[10px] font-mono text-slate-400 block">KMP Engine Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`h-2 w-2 rounded-full ${syncState === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-mono font-bold text-slate-800 uppercase">{syncState}</span>
                  </div>
                  <button
                    onClick={onTriggerSync}
                    disabled={syncState === 'syncing'}
                    className="mt-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />
                    Trigger Bidirectional Sync
                  </button>
                </div>
              </div>

              {/* KMP Compiler / Logger Output */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <Terminal className="h-3 w-3 text-indigo-600" />
                    KMP Shared Sync Adapter logs
                  </span>
                  <button
                    onClick={onClearLogs}
                    className="text-[9px] font-mono text-slate-400 hover:text-indigo-600 cursor-pointer font-bold"
                  >
                    Clear Console
                  </button>
                </div>

                <div className="bg-[#0f172a] border border-slate-950 rounded-xl p-3.5 font-mono text-[11px] h-[190px] overflow-y-auto space-y-1.5 text-slate-100 shadow-inner">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 select-text leading-relaxed">
                      <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                      <span className={`shrink-0 font-bold uppercase text-[9px] px-1 rounded ${
                        log.level === 'success'
                          ? 'bg-emerald-950/50 text-emerald-400'
                          : log.level === 'warning'
                          ? 'bg-amber-950/40 text-amber-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQLDELIGHT TABLE INSPECTOR */}
          {activeTab === 'sql_engine' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-1.5 bg-slate-150 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveTable('goals')}
                  className={`flex-1 text-xs py-1 px-3 rounded-lg font-mono transition-all cursor-pointer ${
                    activeTable === 'goals' ? 'bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  FinanceGoal.db
                </button>
                <button
                  onClick={() => setActiveTable('projects')}
                  className={`flex-1 text-xs py-1 px-3 rounded-lg font-mono transition-all cursor-pointer ${
                    activeTable === 'projects' ? 'bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Project.db
                </button>
                <button
                  onClick={() => setActiveTable('todos')}
                  className={`flex-1 text-xs py-1 px-3 rounded-lg font-mono transition-all cursor-pointer ${
                    activeTable === 'todos' ? 'bg-white text-indigo-700 font-semibold border border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todo.db
                </button>
              </div>

              {/* SQLite table schema simulation */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto overflow-y-auto h-[220px]">
                {activeTable === 'goals' && (
                  <table className="w-full text-left font-mono text-[10px] select-text">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">id (TEXT PK)</th>
                        <th className="p-2.5">title (TEXT)</th>
                        <th className="p-2.5">targetAmount (REAL)</th>
                        <th className="p-2.5">currentAmount (REAL)</th>
                        <th className="p-2.5">category (TEXT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {goals.map((g) => (
                        <tr key={g.id} className="hover:bg-slate-50/55">
                          <td className="p-2.5 text-slate-400">{g.id}</td>
                          <td className="p-2.5 text-slate-900 font-medium">{g.title}</td>
                          <td className="p-2.5 text-indigo-600">${g.targetAmount}</td>
                          <td className="p-2.5 text-emerald-600">${g.currentAmount}</td>
                          <td className="p-2.5 text-slate-600">{g.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTable === 'projects' && (
                  <table className="w-full text-left font-mono text-[10px] select-text">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">id (TEXT PK)</th>
                        <th className="p-2.5">name (TEXT)</th>
                        <th className="p-2.5">progress (INTEGER)</th>
                        <th className="p-2.5">budgetAllocated (REAL)</th>
                        <th className="p-2.5">budgetSpent (REAL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/55">
                          <td className="p-2.5 text-slate-400">{p.id}</td>
                          <td className="p-2.5 text-slate-900 font-medium">{p.name}</td>
                          <td className="p-2.5 text-slate-600">{p.progress}%</td>
                          <td className="p-2.5 text-indigo-600">${p.budgetAllocated}</td>
                          <td className="p-2.5 text-red-600">${p.budgetSpent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTable === 'todos' && (
                  <table className="w-full text-left font-mono text-[10px] select-text">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2.5">id (TEXT PK)</th>
                        <th className="p-2.5">text (TEXT)</th>
                        <th className="p-2.5">completed (INT BOOLEAN)</th>
                        <th className="p-2.5">priority (TEXT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {todos.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/55">
                          <td className="p-2.5 text-slate-400">{t.id}</td>
                          <td className="p-2.5 text-slate-900 font-medium">{t.text}</td>
                          <td className="p-2.5 text-slate-600">{t.completed ? '1 (TRUE)' : '0 (FALSE)'}</td>
                          <td className={`p-2.5 font-bold ${t.priority === 'high' ? 'text-red-500' : 'text-amber-500'}`}>{t.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KOTLIN CODE SNIPPETS */}
          {activeTab === 'kmp_code' && (
            <div className="space-y-4 animate-fade-in select-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider block font-bold uppercase">AppDatabase.sq (SQLite schema)</span>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-normal">SQLDelight auto-generates typesafe SQLite binding tables for shared iOS, Android, and Web builds.</p>
                  </div>
                  <div className="flex justify-end gap-1 font-mono pt-1">
                    <button
                      onClick={() => handleCopy(KOTLIN_CODE_SQLDELIGHT, 'sqldelight')}
                      className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 py-1.5 px-3 rounded-lg hover:border-slate-300 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      {copiedCode === 'sqldelight' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      {copiedCode === 'sqldelight' ? 'Copied' : 'Copy SQLite'}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 flex flex-col justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider block font-bold uppercase">CloudSyncEngine.kt (KMP Shared)</span>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5 leading-normal">Pure Kotlin crossplatform routine managing snapshots and resolving database conflict margins.</p>
                  </div>
                  <div className="flex justify-end font-mono pt-1">
                    <button
                      onClick={() => handleCopy(KOTLIN_CODE_SERVER, 'kt_server')}
                      className="text-[10px] bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 py-1.5 px-3 rounded-lg hover:border-slate-300 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      {copiedCode === 'kt_server' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      {copiedCode === 'kt_server' ? 'Copied' : 'Copy worker'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-150/40 font-mono text-[10px] flex items-start gap-1.5 shrink-0 select-text leading-relaxed text-indigo-950/80 shadow-2xs">
                <Info className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <p>
                  Deploy SQLDelight queries directly inside native workers: Android utilizes `AndroidSqliteDriver(context)` while iOS mounts `NativeSqliteDriver(schema)`.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sync security banner footnotes */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mt-4 text-[11px] text-slate-500 flex items-center justify-between font-mono shrink-0 select-none shadow-3xs">
          <span className="flex items-center gap-1 text-slate-550 font-bold">
            <Shield className="h-3.5 w-3.5 text-indigo-600" />
            Typesafe Client SSL Cryptography
          </span>
          <span className="text-[10px] text-slate-400">v1.17.2-stable</span>
        </div>

      </div>

    </div>
  );
}
