/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Todo, CalendarEvent } from '../types';
import { Calendar as CalendarIcon, ListTodo, Check, Trash2, Plus, Pin, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarAndTasksProps {
  todos: Todo[];
  events: CalendarEvent[];
  onAddTodo: (todo: Omit<Todo, 'id'>) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarAndTasks({
  todos,
  events,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onAddEvent,
  onDeleteEvent,
}: CalendarAndTasksProps) {
  // Calendar states (starting from May 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-05-23');

  // New todo states
  const [todoText, setTodoText] = useState('');
  const [todoPriority, setTodoPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [todoDueDate, setTodoDueDate] = useState('2026-05-23');

  // New event states
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-05-23');
  const [eventType, setEventType] = useState<'milestone' | 'bill' | 'savings_checkpoint'>('savings_checkpoint');
  const [eventAmount, setEventAmount] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar calculations
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);

  // Generate date entries
  const calendarCells = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarCells.push({ day, month: m, year: y, current: false });
  }
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, month: currentMonth, year: currentYear, current: true });
  }
  // Next month leading days
  const totalCells = 42; // standard 6 rows
  const remaining = totalCells - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarCells.push({ day: i, month: m, year: y, current: false });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    }
  };

  const handleSelectCell = (cell: { day: number; month: number; year: number }) => {
    const formattedDate = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    setSelectedDateStr(formattedDate);
    setTodoDueDate(formattedDate);
    setEventDate(formattedDate);
  };

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim()) return;
    onAddTodo({
      text: todoText,
      completed: false,
      priority: todoPriority,
      dueDate: todoDueDate,
    });
    setTodoText('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    onAddEvent({
      title: eventTitle,
      date: eventDate,
      type: eventType,
      amount: eventAmount ? parseFloat(eventAmount) : undefined,
    });
    setEventTitle('');
    setEventAmount('');
    setShowAddEvent(false);
  };

  // Selected date's events & todos
  const selectedEvents = events.filter((e) => e.date === selectedDateStr);
  const selectedTodos = todos.filter((t) => t.dueDate === selectedDateStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="calendar-tasks-section">
      
      {/* LEFT COLUMN: INTERACTIVE MONTH CALENDAR (7 cols) */}
      <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">KMP Shared Milestone Calendar</h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:text-indigo-600 transition-colors text-slate-450 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-800 min-w-[100px] text-center">
              {months[currentMonth]} {currentYear}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:text-indigo-600 transition-colors text-slate-450 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-slate-400 uppercase font-bold mb-1">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {calendarCells.map((cell, idx) => {
            const formatted = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
            const isSelected = formatted === selectedDateStr;
            const hasEvent = events.some((e) => e.date === formatted);
            const hasTodo = todos.some((t) => t.dueDate === formatted && !t.completed);

            let borderStyle = 'border-slate-200bg-white';
            if (isSelected) borderStyle = 'border-indigo-600 bg-indigo-50/40 text-indigo-700 font-bold';

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectCell(cell)}
                className={`relative flex flex-col items-center justify-between aspect-square py-1 sm:py-2 border rounded-xl hover:border-indigo-300 transition-all font-mono text-xs cursor-pointer ${
                  cell.current ? 'text-slate-800 bg-white' : 'text-slate-300 bg-slate-50/40'
                } ${borderStyle}`}
              >
                <span>{cell.day}</span>
                <div className="flex gap-0.5 justify-center w-full mt-0.5 min-h-[4px]">
                  {hasEvent && (
                    <span className="h-1 w-1 bg-amber-500 rounded-full" title="Finance checkpoint event" />
                  )}
                  {hasTodo && (
                    <span className="h-1 w-1 bg-indigo-600 rounded-full" title="Action todo remaining" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected date actions & list panel */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-150 mt-4 shadow-3xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{selectedDateStr} Chronology</span>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="text-[10px] font-mono text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer font-bold"
            >
              <Plus className="h-3 w-3" /> Event Checkpoint
            </button>
          </div>

          {showAddEvent && (
            <form onSubmit={handleCreateEvent} className="bg-white p-3 rounded-lg border border-slate-200 mb-3 space-y-2 animate-fade-in shadow-2xs">
              <input
                type="text"
                placeholder="checkpoint/bill description"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                required
              />
              <div className="flex gap-2">
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                >
                  <option value="savings_checkpoint">Savings Target</option>
                  <option value="bill">Recurring Bill</option>
                  <option value="milestone">Operational Deadline</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={eventAmount}
                  onChange={(e) => setEventAmount(e.target.value)}
                  className="w-24 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-1.5 text-[10px] pt-1">
                <button type="button" onClick={() => setShowAddEvent(false)} className="text-slate-500 px-2 py-1 hover:text-slate-800">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white rounded px-3 py-1 font-bold hover:bg-indigo-700 shadow-3xs cursor-pointer">Save</button>
              </div>
            </form>
          )}

          {/* Render selected date items */}
          <div className="space-y-1.5 font-mono">
            {selectedEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-150 shadow-3xs">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${ev.type === 'bill' ? 'bg-red-500' : ev.type === 'milestone' ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                  <span className="text-slate-700 font-medium">{ev.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {ev.amount && <span className="text-indigo-650 font-bold pr-1">${ev.amount}</span>}
                  <button onClick={() => onDeleteEvent(ev.id)} className="text-slate-400 hover:text-red-650 hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}

            {selectedTodos.map((td) => (
              <div key={td.id} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded border border-slate-150 shadow-3xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleTodo(td.id)}
                    className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                      td.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-300 bg-white hover:border-indigo-500'
                    }`}
                  >
                    {td.completed && <Check className="h-2.5 w-2.5" />}
                  </button>
                  <span className={td.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>{td.text}</span>
                </div>
                <button onClick={() => onDeleteTodo(td.id)} className="text-slate-400 hover:text-red-650 hover:bg-slate-50 p-1 rounded transition-colors cursor-pointer">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}

            {selectedEvents.length === 0 && selectedTodos.length === 0 && (
              <p className="text-center text-[10px] text-slate-400 py-3">No tasks or financial events booked on this calendar node.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIONABLE TODO MATRIX CHECKLIST (5 cols) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-800 tracking-tight">KMP Sync Todo Ledger</h2>
            </div>
          </div>

          <form onSubmit={handleCreateTodo} className="space-y-2.5 mb-4">
            <input
              type="text"
              placeholder="Add shared task item..."
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-650"
              required
            />
            <div className="flex gap-2">
              <select
                value={todoPriority}
                onChange={(e) => setTodoPriority(e.target.value as any)}
                className="flex-1 bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-505"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <input
                type="date"
                value={todoDueDate}
                onChange={(e) => setTodoDueDate(e.target.value)}
                className="w-36 bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs text-slate-755"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-1.5 text-xs font-semibold shrink-0 cursor-pointer text-center shadow-xs"
              >
                Add
              </button>
            </div>
          </form>

          {/* List scroll panel */}
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 justify-between ${
                  todo.completed
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-white border-slate-150 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className={`mt-0.5 h-4.5 w-4.5 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      todo.completed
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow shadow-indigo-600/10'
                        : 'border-slate-250 hover:border-indigo-500 bg-white'
                    }`}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                  </button>

                  <div className="space-y-1">
                    <p className={`text-xs ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        todo.priority === 'high'
                          ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                          : todo.priority === 'medium'
                          ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {todo.priority}
                      </span>
                      {todo.dueDate && (
                        <span className="text-[9px] font-mono text-slate-400">
                          Due: {todo.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-slate-400 hover:text-red-655 p-1 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            
            {todos.length === 0 && (
              <div className="text-center py-12 text-slate-400 font-mono">
                <AlertCircle className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Task queue is empty.</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Perfect database integrity.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-150/40 mt-4 text-[11px] text-indigo-950 flex items-start gap-2 shadow-3xs">
          <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-normal font-sans">
            Every creation triggers a live Kotlin Multiplatform Flow state emission update to SqlDelight query observers.
          </p>
        </div>
      </div>

    </div>
  );
}
