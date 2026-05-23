/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FinanceGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // 0 to 100
  dueDate: string;
  budgetAllocated: number;
  budgetSpent: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  associatedId?: string; // Goal ID or Project ID
}

export interface Transaction {
  id: string;
  goalId: string;
  description: string;
  amount: number;
  type: 'contribution' | 'withdrawal';
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  type: 'milestone' | 'bill' | 'savings_checkpoint';
  amount?: number;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export type SyncProvider = 'google_drive' | 'apple_icloud';
