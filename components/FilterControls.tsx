'use client';

import React from 'react';
import {
  Search,
  Calendar,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  X,
  Layers,
  Download,
} from '@/components/Icons';
import { FilterTimeframe, TaskFilterOptions, ZohoTask } from '@/lib/types';
import { isTodayDate } from '@/lib/date-utils';

interface FilterControlsProps {
  tasks: ZohoTask[];
  filters: TaskFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterOptions>>;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;
  groupByTask: boolean;
  setGroupByTask: (group: boolean) => void;
  onExportCsv: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  tasks,
  filters,
  setFilters,
  viewMode,
  setViewMode,
  groupByTask,
  setGroupByTask,
  onExportCsv,
}) => {
  // Extract unique projects and users
  const uniqueProjects = Array.from(new Set(tasks.map((t) => t.projectName).filter(Boolean))).sort();
  const uniqueUsers = Array.from(new Set(tasks.map((t) => t.userOwner).filter((u) => u && u !== 'Unassigned'))).sort();
  const todayCount = tasks.filter((t) => isTodayDate(t.taskStartDate)).length;

  const handleTimeframeChange = (timeframe: FilterTimeframe) => {
    setFilters((prev) => ({ ...prev, timeframe }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      timeframe: 'all',
      selectedUser: '',
      selectedProject: '',
      selectedAssigner: '',
      sortBy: 'startDate',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.timeframe !== 'all' ||
    filters.selectedUser !== '' ||
    filters.selectedProject !== '' ||
    filters.selectedAssigner !== '';

  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs p-3 sm:p-5 mb-6 space-y-4 transition-colors">
      {/* Top Bar: Timeframe Quick Tabs & View Switcher */}
      <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-[#222222] pb-4">
        {/* Timeframe Tabs — scrollable row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <button
            onClick={() => handleTimeframeChange('today')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              filters.timeframe === 'today'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a]'
            }`}
          >
            <span>Today</span>
            {todayCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filters.timeframe === 'today'
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {todayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTimeframeChange('yesterday')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              filters.timeframe === 'yesterday'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a]'
            }`}
          >
            Yesterday
          </button>

          <button
            onClick={() => handleTimeframeChange('this_week')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              filters.timeframe === 'this_week'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a]'
            }`}
          >
            This Week
          </button>

          <button
            onClick={() => handleTimeframeChange('all')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              filters.timeframe === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a]'
            }`}
          >
            All Till Date
          </button>

          <button
            onClick={() => handleTimeframeChange('custom')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1 shrink-0 ${
              filters.timeframe === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none'
                : 'bg-slate-50 dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] border border-transparent dark:border-[#2a2a2a]'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Custom</span>
          </button>
        </div>

        {/* View Mode & Deduplication Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Deduplication Toggle */}
          <button
            onClick={() => setGroupByTask(!groupByTask)}
            title="When tasks have multiple assignees, this groups them by unique Task ID"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              groupByTask
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-[#aaa] hover:bg-slate-50 dark:hover:bg-[#222]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Group IDs</span>
          </button>

          {/* Table / Grid Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-[#1a1a1a] p-1 rounded-lg border border-slate-200 dark:border-[#2a2a2a]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#333] text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-[#888] hover:text-slate-800 dark:hover:text-[#ddd]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-[#333] text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 dark:text-[#888] hover:text-slate-800 dark:hover:text-[#ddd]'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export to CSV */}
          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#2a2a2a] text-slate-700 dark:text-[#aaa] hover:bg-slate-50 dark:hover:bg-[#222] hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-colors"
            title="Download visible tasks as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {filters.timeframe === 'custom' && (
        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Date Range:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 dark:text-[#888]">From:</label>
              <input
                type="date"
                value={filters.customStartDate || ''}
                onChange={(e) => setFilters((p) => ({ ...p, customStartDate: e.target.value }))}
                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-[#ddd] focus:outline-indigo-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 dark:text-[#888]">To:</label>
              <input
                type="date"
                value={filters.customEndDate || ''}
                onChange={(e) => setFilters((p) => ({ ...p, customEndDate: e.target.value }))}
                className="px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-[#333] bg-white dark:bg-[#1a1a1a] text-slate-800 dark:text-[#ddd] focus:outline-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Middle Row: Search and Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Search Input — full width on mobile */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search task name, project, owner or task ID…"
            value={filters.searchQuery}
            onChange={(e) => setFilters((p) => ({ ...p, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-slate-50/50 dark:bg-[#1a1a1a] text-slate-800 dark:text-[#eee] placeholder-slate-400 dark:placeholder-[#555] focus:bg-white dark:focus:bg-[#222] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Project Filter */}
        <div>
          <select
            value={filters.selectedProject}
            onChange={(e) => setFilters((p) => ({ ...p, selectedProject: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#ddd] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="" className="dark:bg-[#1a1a1a]">All Projects ({uniqueProjects.length})</option>
            {uniqueProjects.map((p) => (
              <option key={p} value={p} className="dark:bg-[#1a1a1a]">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* User / Owner Filter */}
        <div>
          <select
            value={filters.selectedUser}
            onChange={(e) => setFilters((p) => ({ ...p, selectedUser: e.target.value }))}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#ddd] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="" className="dark:bg-[#1a1a1a]">All Assignees ({uniqueUsers.length})</option>
            {uniqueUsers.map((u) => (
              <option key={u} value={u} className="dark:bg-[#1a1a1a]">
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls — full row */}
        <div className="sm:col-span-2 flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value as any }))}
            className="flex-1 px-2.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#ddd] focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="startDate" className="dark:bg-[#1a1a1a]">Sort: Start Date</option>
            <option value="createdOn" className="dark:bg-[#1a1a1a]">Sort: Created On</option>
            <option value="hours" className="dark:bg-[#1a1a1a]">Sort: Hours</option>
            <option value="taskName" className="dark:bg-[#1a1a1a]">Sort: Task Name</option>
            <option value="projectName" className="dark:bg-[#1a1a1a]">Sort: Project</option>
          </select>

          <button
            onClick={() =>
              setFilters((p) => ({
                ...p,
                sortOrder: p.sortOrder === 'asc' ? 'desc' : 'asc',
              }))
            }
            title={filters.sortOrder === 'asc' ? 'Ascending Order' : 'Descending Order'}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-50 dark:hover:bg-[#222] transition-colors shrink-0"
          >
            <ArrowUpDown className={`w-4 h-4 transition-transform ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#222] text-xs">
          <span className="text-slate-400 dark:text-[#666] font-medium">Filters:</span>

          {filters.timeframe !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              Time: {filters.timeframe}
              <X
                className="w-3 h-3 cursor-pointer hover:text-indigo-900 dark:hover:text-indigo-100"
                onClick={() => setFilters((p) => ({ ...p, timeframe: 'all' }))}
              />
            </span>
          )}

          {filters.selectedProject && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 max-w-[200px]">
              <span className="truncate">Project: {filters.selectedProject}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-emerald-900 dark:hover:text-emerald-100 shrink-0"
                onClick={() => setFilters((p) => ({ ...p, selectedProject: '' }))}
              />
            </span>
          )}

          {filters.selectedUser && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 max-w-[200px]">
              <span className="truncate">User: {filters.selectedUser}</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-purple-900 dark:hover:text-purple-100 shrink-0"
                onClick={() => setFilters((p) => ({ ...p, selectedUser: '' }))}
              />
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 max-w-[200px]">
              <span className="truncate">&quot;{filters.searchQuery}&quot;</span>
              <X
                className="w-3 h-3 cursor-pointer hover:text-amber-900 dark:hover:text-amber-100 shrink-0"
                onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}
              />
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 ml-auto transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
