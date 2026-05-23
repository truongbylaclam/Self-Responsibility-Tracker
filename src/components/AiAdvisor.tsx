/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinanceGoal, Project, Todo } from '../types';
import { Sparkles, RefreshCcw, BrainCircuit, Landmark, ShieldAlert, Cpu } from 'lucide-react';

interface AiAdvisorProps {
  goals: FinanceGoal[];
  projects: Project[];
  todos: Todo[];
  onAddTodo: (todo: Omit<Todo, 'id'>) => void;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: string;
}

export default function AiAdvisor({ goals, projects, todos, onAddTodo }: AiAdvisorProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiKeyConfigured, setIsAiKeyConfigured] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fintrack/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals, projects, todos }),
      });
      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
      if (data.aiConfigured === false) {
        setIsAiKeyConfigured(false);
      } else {
        setIsAiKeyConfigured(true);
      }
    } catch (error) {
      console.error('Failed to retrieve AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [goals.length, projects.length]);

  const handleApplySuggestionAsTask = (sug: Suggestion) => {
    onAddTodo({
      text: `[AI Suggestion] ${sug.title}: ${sug.description}`,
      completed: false,
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-4 shadow-sm text-slate-800" id="ai-advisor-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5">
              KMP FinTrack Coordinator Advisor
              <span className="text-[10px] font-mono font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                Gemini Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              Automated financial budget buffers and SQLDelight architecture advice.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-lg font-mono font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
        >
          <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Refresh AI suggestions
        </button>
      </div>

      {/* API Key Not Available Notification */}
      {!isAiKeyConfigured && (
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-900">Advisory Fallback Active:</span> Your Gemini API Key is running in mockup-safe offline mode. To activate high-fidelity custom suggestions, attach your actual key in the <span className="font-semibold text-slate-900">Settings &gt; Secrets</span> workspace dashboard.
          </div>
        </div>
      )}

      {/* Suggestions Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 animate-pulse min-h-[140px]" />
          ))
        ) : (
          suggestions.map((sug) => (
            <div
              key={sug.id}
              className="bg-slate-50 border border-slate-150 hover:border-slate-300 p-4 rounded-xl flex flex-col justify-between transition-all group shrink-0 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                    {sug.category}
                  </span>
                  <Sparkles className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h4 className="text-slate-800 font-bold text-xs mt-2.5">{sug.title}</h4>
                <p className="text-[11px] text-slate-600 leading-normal mt-1 font-sans">{sug.description}</p>
              </div>

              <div className="pt-3.5 mt-2.5 border-t border-slate-200/60 flex justify-end">
                <button
                  onClick={() => handleApplySuggestionAsTask(sug)}
                  className="text-[10px] font-mono text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Cpu className="h-3 w-3 text-indigo-500" />
                  Apply as Task check
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
