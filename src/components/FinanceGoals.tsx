/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceGoal, Transaction } from '../types';
import { Plus, Coins, Target, Calendar, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';

interface FinanceGoalsProps {
  goals: FinanceGoal[];
  transactions: Transaction[];
  onAddGoal: (goal: Omit<FinanceGoal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

export default function FinanceGoals({
  goals,
  transactions,
  onAddGoal,
  onDeleteGoal,
  onAddTransaction,
}: FinanceGoalsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddTx, setShowAddTx] = useState(false);

  // Form states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCategory, setGoalCategory] = useState('Savings');
  const [goalDate, setGoalDate] = useState('');

  const [txGoalId, setTxGoalId] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'contribution' | 'withdrawal'>('contribution');

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;
    onAddGoal({
      title: goalTitle,
      targetAmount: parseFloat(goalTarget),
      currentAmount: 0,
      category: goalCategory,
      targetDate: goalDate || new Date().toISOString().split('T')[0],
    });
    setGoalTitle('');
    setGoalTarget('');
    setGoalDate('');
    setShowAddGoal(false);
  };

  const handleSubmitTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txGoalId || !txAmount || !txDescription) return;
    onAddTransaction({
      goalId: txGoalId,
      description: txDescription,
      amount: parseFloat(txAmount),
      type: txType,
    });
    setTxDescription('');
    setTxAmount('');
    setShowAddTx(false);
  };

  return (
    <div className="space-y-6" id="finance-goals-section">
      {/* Header Cards */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-850 flex items-center gap-2">
            <Coins className="h-5 w-5 text-indigo-600" />
            Personal Finance Goals
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Establish, contribute to, and track KMP-synchronized asset checkpoints.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowAddGoal(!showAddGoal); setShowAddTx(false); }}
            className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Goal
          </button>
          <button
            onClick={() => { setShowAddTx(!showAddTx); setShowAddGoal(false); }}
            className="flex items-center gap-1 text-xs border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Transaction
          </button>
        </div>
      </div>

      {/* Forms Area */}
      {showAddGoal && (
        <form onSubmit={handleSubmitGoal} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm animate-fade-in">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">New Financial Goal</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Goal Title</label>
              <input
                type="text"
                placeholder="e.g., MacBook Upgrade Fund"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Target Amount ($)</label>
              <input
                type="number"
                placeholder="2500"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Category</label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-850 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
              >
                <option value="Savings">Savings</option>
                <option value="Investments">Investments</option>
                <option value="Business Development">Business Development</option>
                <option value="Equipment">Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Target Date</label>
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-850 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium shadow-xs"
            >
              Add Goal
            </button>
          </div>
        </form>
      )}

      {showAddTx && (
        <form onSubmit={handleSubmitTx} className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm animate-fade-in">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Record Transaction Target contribution</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Associate Goal</label>
              <select
                value={txGoalId}
                onChange={(e) => setTxGoalId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              >
                <option value="">-- Choose Goal --</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Transaction Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('contribution')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    txType === 'contribution'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  Contribution
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('withdrawal')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                    txType === 'withdrawal'
                      ? 'bg-red-5 border-red-200 text-red-700 font-bold'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  Withdrawal
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g., Monthly paycheck direct transfer"
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Amount ($)</label>
              <input
                type="number"
                placeholder="500"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 focus:ring-1 focus:ring-indigo-600"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddTx(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium shadow-xs"
            >
              Book Transaction
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {goals.map((goal) => {
          const ratio = Math.min(100, Math.max(0, (goal.currentAmount / goal.targetAmount) * 100));
          const goalTx = transactions.filter((t) => t.goalId === goal.id);

          return (
            <div
              key={goal.id}
              className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-xl transition-all shadow-xs group relative"
            >
              {/* Delete Button */}
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Delete Goal"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-mono px-2 py-0.5 rounded">
                      {goal.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {goal.targetDate}
                    </span>
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm mt-1.5">{goal.title}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">
                    ${goal.currentAmount.toLocaleString()} <span className="text-slate-400 text-xs font-normal">of ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-indigo-600 font-mono font-bold">{ratio.toFixed(1)}% Completed</div>
                </div>
              </div>

              {/* Goal Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3 relative">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${ratio}%` }}
                />
              </div>

              {/* Transactions Subsection */}
              {goalTx.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-2 font-mono font-bold">Synced SQLDelight Ledger entries</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {goalTx.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center text-[11px] bg-slate-50 px-2.5 py-1.5 rounded border border-slate-150 font-mono">
                        <div className="flex items-center gap-1.5 text-slate-705">
                          {tx.type === 'contribution' ? (
                            <ArrowUpRight className="h-3 w-3 text-indigo-600 shrink-0" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-500 shrink-0" />
                          )}
                          <span>{tx.description}</span>
                        </div>
                        <div className={`font-bold ${tx.type === 'contribution' ? 'text-indigo-600' : 'text-red-600'}`}>
                          {tx.type === 'contribution' ? '+' : '-'}${tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-10 px-4 border border-dashed border-slate-200 rounded-xl text-slate-500">
            <Target className="h-8 w-8 text-slate-350 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-bold">No personal finance goals initialized.</p>
            <p className="text-xs text-slate-400 mt-1 font-mono">Add standard targets using the action deck above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
