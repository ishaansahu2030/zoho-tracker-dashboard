'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsOverview } from '@/components/StatsOverview';
import { FilterControls } from '@/components/FilterControls';
import { TaskTable } from '@/components/TaskTable';
import { TaskCardGrid } from '@/components/TaskCardGrid';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { ZohoTask, TaskFilterOptions } from '@/lib/types';
import {
  parseZohoDate,
  isTodayDate,
  isYesterdayDate,
  isThisWeekDate,
  toISODateString,
} from '@/lib/date-utils';
import { AlertCircle, RefreshCw, Database } from '@/components/Icons';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ZohoTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [groupByTask, setGroupByTask] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<ZohoTask | null>(null);

  const [filters, setFilters] = useState<TaskFilterOptions>({
    searchQuery: '',
    timeframe: 'all',
    selectedUser: '',
    selectedProject: '',
    selectedAssigner: '',
    sortBy: 'startDate',
    sortOrder: 'desc',
  });

  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(60); // Default to sync every 60s
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('zoho_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('zoho_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('zoho_theme', 'light');
      }
      return next;
    });
  };

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch tasks from Google Sheets');
      }
      setTasks(json.data || []);
      setLastUpdated(json.lastFetchedAt || new Date().toISOString());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching tasks';
      setError(msg);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Periodic Auto-Sync Timer
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const timer = setInterval(() => {
      fetchData(true); // Silent background fetch without flash
    }, autoRefreshInterval * 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval, fetchData]);

  // Grouped tasks (deduplicating by TaskID and combining assignees/hours)
  const processedTasks = useMemo(() => {
    if (!groupByTask) return tasks;

    const taskMap = new Map<string, ZohoTask>();

    for (const t of tasks) {
      const key = t.taskId;
      if (!taskMap.has(key)) {
        taskMap.set(key, { ...t });
      } else {
        const existing = taskMap.get(key)!;
        // Combine assignees if different
        if (t.userOwner && !existing.userOwner.includes(t.userOwner)) {
          existing.userOwner = `${existing.userOwner}, ${t.userOwner}`;
        }
        if (t.assigneeEmail && !existing.assigneeEmail.includes(t.assigneeEmail)) {
          existing.assigneeEmail = `${existing.assigneeEmail}, ${t.assigneeEmail}`;
        }
        // Accumulate hours
        existing.individualHours = (existing.individualHours || 0) + (t.individualHours || 0);
      }
    }

    return Array.from(taskMap.values());
  }, [tasks, groupByTask]);

  // Client-side filtering and sorting
  const filteredTasks = useMemo(() => {
    return processedTasks
      .filter((t) => {
        // Search filter
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const match =
            t.taskName.toLowerCase().includes(q) ||
            t.taskId.toLowerCase().includes(q) ||
            t.projectName.toLowerCase().includes(q) ||
            t.userOwner.toLowerCase().includes(q) ||
            t.createdBy.toLowerCase().includes(q) ||
            t.assigneeEmail.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Timeframe filter
        if (filters.timeframe === 'today') {
          if (!isTodayDate(t.taskStartDate)) return false;
        } else if (filters.timeframe === 'yesterday') {
          if (!isYesterdayDate(t.taskStartDate)) return false;
        } else if (filters.timeframe === 'this_week') {
          if (!isThisWeekDate(t.taskStartDate)) return false;
        } else if (filters.timeframe === 'custom') {
          const d = parseZohoDate(t.taskStartDate);
          const iso = toISODateString(d);
          if (!iso) return false;
          if (filters.customStartDate && iso < filters.customStartDate) return false;
          if (filters.customEndDate && iso > filters.customEndDate) return false;
        }

        // Project filter
        if (filters.selectedProject && t.projectName !== filters.selectedProject) {
          return false;
        }

        // User filter
        if (filters.selectedUser && !t.userOwner.includes(filters.selectedUser)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;

        if (filters.sortBy === 'startDate') {
          valA = parseZohoDate(a.taskStartDate)?.getTime() || 0;
          valB = parseZohoDate(b.taskStartDate)?.getTime() || 0;
        } else if (filters.sortBy === 'createdOn') {
          valA = parseZohoDate(a.createdOn)?.getTime() || 0;
          valB = parseZohoDate(b.createdOn)?.getTime() || 0;
        } else if (filters.sortBy === 'hours') {
          valA = a.individualHours || 0;
          valB = b.individualHours || 0;
        } else if (filters.sortBy === 'taskName') {
          return filters.sortOrder === 'asc'
            ? a.taskName.localeCompare(b.taskName)
            : b.taskName.localeCompare(a.taskName);
        } else if (filters.sortBy === 'projectName') {
          return filters.sortOrder === 'asc'
            ? a.projectName.localeCompare(b.projectName)
            : b.projectName.localeCompare(a.projectName);
        }

        return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [processedTasks, filters]);

  // Export filtered tasks to CSV
  const handleExportCsv = () => {
    if (filteredTasks.length === 0) return;

    const headers = [
      'S.No',
      'Zoho Task ID',
      'Project Name',
      'Task Name',
      'User/Owner',
      'Assignee Email',
      'Created By',
      'Assigner Email',
      'Task Start Date',
      'Created On',
      'Hours',
    ];

    const rows = filteredTasks.map((t, idx) => [
      idx + 1,
      `"${t.taskId.replace(/"/g, '""')}"`,
      `"${t.projectName.replace(/"/g, '""')}"`,
      `"${t.taskName.replace(/"/g, '""')}"`,
      `"${t.userOwner.replace(/"/g, '""')}"`,
      `"${t.assigneeEmail.replace(/"/g, '""')}"`,
      `"${t.createdBy.replace(/"/g, '""')}"`,
      `"${t.assignerEmail.replace(/"/g, '""')}"`,
      `"${t.taskStartDate.replace(/"/g, '""')}"`,
      `"${t.createdOn.replace(/"/g, '""')}"`,
      t.individualHours,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `zoho_tasks_${filters.timeframe}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0a] text-slate-900 dark:text-[#eee] flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        totalTasks={tasks.length}
        onRefresh={() => fetchData(false)}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start justify-between shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold">Failed to load data from Google Sheets</h3>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchData(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* High-Level Stats Overview */}
        <StatsOverview
          tasks={tasks}
          onSelectToday={() => setFilters((p) => ({ ...p, timeframe: 'today' }))}
          onSelectAll={() => setFilters((p) => ({ ...p, timeframe: 'all' }))}
          activeFilter={filters.timeframe}
        />

        {/* Filters & Timeframe Controls */}
        <FilterControls
          tasks={tasks}
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          groupByTask={groupByTask}
          setGroupByTask={setGroupByTask}
          onExportCsv={handleExportCsv}
        />

        {/* Main Content Area: Loading Skeleton, Table, or Cards */}
        {isLoading && tasks.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-8 sm:p-12 text-center shadow-xs space-y-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto animate-bounce">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-[#eee]">Reading Google Sheet...</h3>
              <p className="text-xs text-slate-500 dark:text-[#888] mt-1">
                Securely fetching task trackers via read-only Google Sheets API
              </p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <TaskTable tasks={filteredTasks} onSelectTask={(task) => setSelectedTask(task)} />
        ) : (
          <TaskCardGrid tasks={filteredTasks} onSelectTask={(task) => setSelectedTask(task)} />
        )}
      </main>

      {/* Task Inspection Modal Drawer */}
      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-[#222222] bg-white dark:bg-[#111111] py-5 mt-10 text-center text-xs text-slate-500 dark:text-[#888] transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Zoho Projects Live Tracker • Read-Only Client Dashboard</p>
          <p className="text-slate-400 dark:text-[#666]">Google Sheet Tab: {process.env.NEXT_PUBLIC_SHEET_TAB || 'AllTracker'}</p>
        </div>
      </footer>
    </div>
  );
}
