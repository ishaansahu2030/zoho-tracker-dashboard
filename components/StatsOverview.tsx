'use client';

import React from 'react';
import { CalendarClock, FolderKanban, Users, Clock, Flame } from '@/components/Icons';
import { ZohoTask } from '@/lib/types';
import { isTodayDate } from '@/lib/date-utils';

interface StatsOverviewProps {
  tasks: ZohoTask[];
  onSelectToday: () => void;
  onSelectAll: () => void;
  activeFilter: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  tasks,
  onSelectToday,
  onSelectAll,
  activeFilter,
}) => {
  const todayTasks = tasks.filter((t) => isTodayDate(t.taskStartDate));
  const todayHours = todayTasks.reduce((acc, t) => acc + (t.individualHours || 0), 0);
  const totalHours = tasks.reduce((acc, t) => acc + (t.individualHours || 0), 0);

  const uniqueProjects = new Set(tasks.map((t) => t.projectName).filter(Boolean)).size;
  const uniqueUsers = new Set(tasks.map((t) => t.userOwner).filter((u) => u && u !== 'Unassigned')).size;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Today's Tasks Highlight Card */}
      <div
        onClick={onSelectToday}
        className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden group shadow-xs ${
          activeFilter === 'today'
            ? 'bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-950/30 border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-500/20 shadow-md'
            : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-[#222222] hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="p-2 sm:p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 sm:px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <Flame className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {todayTasks.length}
          </p>
          <div className="flex items-center justify-between mt-1 gap-1">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-[#888] leading-tight">Trackers Today</p>
            <span className="text-[10px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md shrink-0">
              {todayHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>

      {/* Total Trackers Till Date Card */}
      <div
        onClick={onSelectAll}
        className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden group shadow-xs ${
          activeFilter === 'all'
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20 shadow-md'
            : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-[#222222] hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="p-2 sm:p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <span
              className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full transition-colors ${
                activeFilter === 'all'
                  ? 'text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-950/70'
                  : 'text-slate-500 dark:text-[#888] bg-slate-100 dark:bg-[#1a1a1a]'
              }`}
            >
              All Time
            </span>
          </div>
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {tasks.length}
          </p>
          <div className="flex items-center justify-between mt-1 gap-1">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-[#888] leading-tight">Total Till Date</p>
            <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-md shrink-0">
              {totalHours.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>

      {/* Unique Projects Card */}
      <div className="rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222222] bg-white dark:bg-[#111111] shadow-xs group hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="p-2 sm:p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 sm:px-2 py-0.5 rounded-full">
            Projects
          </span>
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {uniqueProjects}
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-[#888] mt-1">Unique Zoho Projects</p>
        </div>
      </div>

      {/* Team Members Card */}
      <div className="rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-[#222222] bg-white dark:bg-[#111111] shadow-xs group hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <span className="p-2 sm:p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-1.5 sm:px-2 py-0.5 rounded-full">
            Assignees
          </span>
        </div>
        <div className="mt-3 sm:mt-4">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {uniqueUsers}
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-[#888] mt-1">Team Members</p>
        </div>
      </div>
    </div>
  );
};
