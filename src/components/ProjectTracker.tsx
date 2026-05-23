/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../types';
import { Briefcase, Plus, TrendingUp, Calendar, Trash2, Sliders } from 'lucide-react';

interface ProjectTrackerProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProjectProgress: (id: string, progress: number) => void;
  onDeleteProject: (id: string) => void;
}

export default function ProjectTracker({
  projects,
  onAddProject,
  onUpdateProjectProgress,
  onDeleteProject,
}: ProjectTrackerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectSpent, setProjectSpent] = useState('');
  const [projectDueDate, setProjectDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !projectBudget) return;
    onAddProject({
      name: projectName,
      description: projectDesc,
      progress: 0,
      dueDate: projectDueDate || new Date().toISOString().split('T')[0],
      budgetAllocated: parseFloat(projectBudget),
      budgetSpent: parseFloat(projectSpent) || 0,
    });
    setProjectName('');
    setProjectDesc('');
    setProjectBudget('');
    setProjectSpent('');
    setProjectDueDate('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6" id="project-tracker-section">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-850 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Project Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage engineering and operational project budgets with multi-platform synchronization nodes.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm animate-fade-in">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Initialize Project Node</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Project Name</label>
              <input
                type="text"
                placeholder="e.g., KMP SQLite Driver Setup"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description</label>
              <textarea
                placeholder="Brief project deliverables and scope details"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Budget ($)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Initial spent ($)</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={projectSpent}
                  onChange={(e) => setProjectSpent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={projectDueDate}
                  onChange={(e) => setProjectDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-805 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium shadow-xs"
            >
              Add Project
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid Card List */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => {
          const budgetRatio = project.budgetAllocated ? (project.budgetSpent / project.budgetAllocated) * 100 : 0;
          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 p-5 rounded-xl relative group hover:border-slate-350 transition-all shadow-xs"
            >
              {/* Delete */}
              <button
                onClick={() => onDeleteProject(project.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-650 p-1.5 rounded-lg hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer animate-fade-in"
                title="Delete Project Node"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded-full">
                      Active Node
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Due: {project.dueDate}
                    </span>
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm pt-0.5">{project.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{project.description}</p>
                </div>

                {/* Financial overview on the side */}
                <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-150 self-stretch md:self-auto flex flex-col justify-center min-w-[150px] shadow-3xs">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-mono font-bold">Project Ledger Balance</span>
                  <div className="text-xs text-slate-550 font-mono mt-1 font-medium">
                    Allocated: <span className="text-slate-800 font-bold">${project.budgetAllocated.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-550 font-mono mt-0.5 font-medium">
                    Expensed: <span className={project.budgetSpent > project.budgetAllocated ? "text-red-600 font-bold" : "text-slate-800 font-bold"}>${project.budgetSpent.toLocaleString()}</span>
                  </div>
                  {/* Miniature budget indicator line */}
                  <div className="w-full bg-slate-150 h-1 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${budgetRatio > 100 ? 'bg-red-500' : 'bg-slate-400'}`}
                      style={{ width: `${Math.min(100, budgetRatio)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Progress Bar & Slider Controls */}
              <div className="mt-5 pt-4 border-t border-slate-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 font-bold">
                    <Sliders className="h-3 w-3 text-indigo-500" />
                    KMP Shared Progress Node
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-650">{project.progress}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={project.progress}
                    onChange={(e) => onUpdateProjectProgress(project.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${project.progress}%, #f1f5f9 ${project.progress}%, #f1f5f9 100%)`
                    }}
                  />
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => onUpdateProjectProgress(project.id, Math.max(0, project.progress - 5))}
                      className="text-[10px] font-mono border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-slate-300 px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                    >
                      -5%
                    </button>
                    <button
                      onClick={() => onUpdateProjectProgress(project.id, Math.min(100, project.progress + 5))}
                      className="text-[10px] font-mono border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-slate-300 px-1.5 py-0.5 rounded cursor-pointer transition-colors shadow-2xs"
                    >
                      +5%
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl text-slate-500">
            <Briefcase className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <p className="text-sm text-slate-605 font-bold">No active project trackers found.</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Create KMP operational nodes to synchronize tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}
