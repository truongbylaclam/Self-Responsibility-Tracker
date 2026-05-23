/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FinanceGoal, Project, Todo, Transaction, CalendarEvent, SyncLog } from './types';

export const INITIAL_GOALS: FinanceGoal[] = [
  {
    id: 'g-1',
    title: 'Emergency Reserve Fund',
    targetAmount: 15000,
    currentAmount: 11250,
    category: 'Savings',
    targetDate: '2026-10-15',
  },
  {
    id: 'g-2',
    title: 'Kotlin Multiplatform Licensing & Dev Hardware',
    targetAmount: 5000,
    currentAmount: 3400,
    category: 'Business Development',
    targetDate: '2026-08-01',
  },
  {
    id: 'g-3',
    title: 'Index Fund Investment Goal',
    targetAmount: 50000,
    currentAmount: 22000,
    category: 'Investments',
    targetDate: '2027-12-31',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p-1',
    name: 'KMP Mobile Re-architecture',
    description: 'Port legacy iOS/Android screens to Compose Multiplatform shared UI and SqlDelight logic.',
    progress: 75,
    dueDate: '2026-06-30',
    budgetAllocated: 12000,
    budgetSpent: 9600,
  },
  {
    id: 'p-2',
    name: 'Unified Synchronization Service',
    description: 'Build Google Drive & iCloud common syncing adapters in Kotlin Shared modules.',
    progress: 40,
    dueDate: '2026-08-15',
    budgetAllocated: 8000,
    budgetSpent: 3200,
  },
  {
    id: 'p-3',
    name: 'Automated Tax Compliance',
    description: 'Integrate quarterly expense analytics directly with tax consulting API interfaces.',
    progress: 10,
    dueDate: '2026-09-15',
    budgetAllocated: 4000,
    budgetSpent: 400,
  },
];

export const INITIAL_TODOS: Todo[] = [
  { id: 't-1', text: 'Define SQLite tables in SQLDelight script files (.sq)', completed: true, priority: 'high', associatedId: 'p-2' },
  { id: 't-2', text: 'Implement Android Context Sqlite Driver creator', completed: true, priority: 'medium', associatedId: 'p-2' },
  { id: 't-3', text: 'Configure iOS Native Sqlite driver with native memory pointers', completed: false, priority: 'high', associatedId: 'p-2' },
  { id: 't-4', text: 'Add 15% of paycheck to Emergency Reserve Fund', completed: false, priority: 'high', associatedId: 'g-1' },
  { id: 't-5', text: 'Review annual financial growth margins with team', completed: false, priority: 'medium', associatedId: 'p-1' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tr-1', goalId: 'g-1', description: 'Monthly Automatic Savings Allocator', amount: 1250, type: 'contribution', date: '2026-05-01' },
  { id: 'tr-2', goalId: 'g-1', description: 'Bonus Dividend Allocation', amount: 500, type: 'contribution', date: '2026-05-15' },
  { id: 'tr-3', goalId: 'g-2', description: 'Purchase of testing devices for cross-platform debugging', amount: 800, type: 'withdrawal', date: '2026-05-10' },
  { id: 'tr-4', goalId: 'g-3', description: 'Broad Market ETF Buy Orders', amount: 3500, type: 'contribution', date: '2026-05-18' },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e-1', title: 'Tax Milestone: Q2 Filing Deadline', date: '2026-06-15', type: 'milestone', amount: 2500 },
  { id: 'e-2', title: 'Target Checkpoint: Emergency Fund at 80%', date: '2026-05-28', type: 'savings_checkpoint', amount: 12000 },
  { id: 'e-3', title: 'Web Hosting & Dev Server Billing Cycle', date: '2026-06-01', type: 'bill', amount: 180 },
];

export const INITIAL_LOGS: SyncLog[] = [
  { id: 'l-1', timestamp: '20:25:12', level: 'info', message: 'SQLDelight driver initialized: CoreDatabase created on SQLite' },
  { id: 'l-2', timestamp: '20:25:13', level: 'success', message: 'KMP Sync Worker verified active local synchronization state' },
  { id: 'l-3', timestamp: '20:26:00', level: 'info', message: 'Google Drive Auth parameters cached. Standby mode.' },
];

export const KOTLIN_CODE_SQLDELIGHT = `// src/commonMain/sqldelight/com/fintrack/db/AppDatabase.sq
CREATE TABLE FinanceGoal (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    targetAmount REAL NOT NULL,
    currentAmount REAL NOT NULL,
    category TEXT NOT NULL,
    targetDate TEXT NOT NULL
);

CREATE TABLE Project (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    progress INTEGER NOT NULL,
    dueDate TEXT NOT NULL,
    budgetAllocated REAL NOT NULL,
    budgetSpent REAL NOT NULL
);

selectGoals:
SELECT * FROM FinanceGoal;

insertGoal:
INSERT OR REPLACE INTO FinanceGoal(id, title, targetAmount, currentAmount, category, targetDate)
VALUES (?, ?, ?, ?, ?, ?);
`;

export const KOTLIN_CODE_SERVER = `// src/commonMain/kotlin/com/fintrack/sync/CloudSyncEngine.kt
package com.fintrack.sync

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.serialization.json.Json

interface CloudSyncProvider {
    suspend fun uploadSnapshot(json: String): Boolean
    suspend fun downloadSnapshot(): String?
}

class KmpSyncCoordinator(
    private val provider: CloudSyncProvider,
    private val localDb: AppDatabaseQueries
) {
    val syncState = MutableStateFlow<SyncStatus>(SyncStatus.Idle)

    suspend fun performBidirectionalSync() {
        syncState.value = SyncStatus.Synchronizing
        try {
            // Read local SQLite tables via SQLDelight
            val localGoals = localDb.selectGoals().executeAsList()
            val localProjects = localDb.selectProjects().executeAsList()
            
            val localSnapshotJson = packageToJson(localGoals, localProjects)
            
            // Try downloading cloud state
            val cloudData = provider.downloadSnapshot()
            if (cloudData != null) {
                val mergedData = mergeSnapshots(localSnapshotJson, cloudData)
                
                // Write back local SQLite database
                writeToLocalDb(mergedData)
                
                // Push unified updates back to remote
                provider.uploadSnapshot(Json.encodeToString(mergedData))
            } else {
                // Cloud is empty, initialize cloud with local state
                provider.uploadSnapshot(localSnapshotJson)
            }
            syncState.value = SyncStatus.Synced
        } catch (e: Exception) {
            syncState.value = SyncStatus.Failed(e.message ?: "Unknown KMP Driver Sync Error")
        }
    }
}
`;
