'use client';

import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Eye, Sparkles } from '@/components/Icons';
import { ZohoTask } from '@/lib/types';
import { formatFriendlyDate, isTodayDate } from '@/lib/date-utils';

interface TaskTableProps {
  tasks: ZohoTask[];
  onSelectTask: (task: ZohoTask) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onSelectTask }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const totalPages = Math.ceil(tasks.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const visibleTasks = tasks.slice(startIndex, startIndex + pageSize);

  // Helper for avatar colors based on username
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
      'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Unassigned') return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-12 text-center shadow-xs transition-colors">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1a1a1a] flex items-center justify-center text-slate-400 mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-[#eee]">No trackers found</h3>
        <p className="text-xs text-slate-500 dark:text-[#888] mt-1 max-w-sm mx-auto">
          Try changing your filter settings, selecting another date, or clearing your search term.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] shadow-xs overflow-hidden transition-colors">
      {/* Table responsive container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-[#2a2a2a] text-slate-500 dark:text-[#888] uppercase tracking-wider font-semibold">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-3 min-w-[180px]">Task Details</th>
              <th className="py-3 px-3 min-w-[130px]">Project</th>
              <th className="py-3 px-3 min-w-[140px]">Assignee</th>
              <th className="py-3 px-3 min-w-[120px] hidden md:table-cell">Created By</th>
              <th className="py-3 px-3 min-w-[120px]">Start Date</th>
              <th className="py-3 px-3 text-center min-w-[80px]">Hours</th>
              <th className="py-3 px-3 text-right min-w-[60px]">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1e1e1e] text-slate-700 dark:text-[#ccc]">
            {visibleTasks.map((task, index) => {
              const isToday = isTodayDate(task.taskStartDate);
              const avatarClass = getAvatarColor(task.userOwner);
              const initials = getInitials(task.userOwner);

              return (
                <tr
                  key={`${task.taskId}-${task.userOwner}-${startIndex + index}`}
                  className="hover:bg-indigo-50/30 dark:hover:bg-[#1a1a1a] transition-colors group cursor-pointer"
                  onClick={() => onSelectTask(task)}
                >
                  {/* Row Index */}
                  <td className="py-3 px-3 text-center text-slate-400 dark:text-[#555] font-mono text-[10px]">
                    {startIndex + index + 1}
                  </td>

                  {/* Task Name & ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-start gap-1.5">
                      {isToday && (
                        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                          <Sparkles className="w-2.5 h-2.5" />
                          New
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 dark:text-[#eee] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-xs sm:text-sm line-clamp-1">
                          {task.taskName}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-[#555] mt-0.5 truncate">
                          {task.taskId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-[#bbb] border border-slate-200 dark:border-[#2a2a2a] line-clamp-1 max-w-[130px]">
                      {task.projectName}
                    </span>
                  </td>

                  {/* Assignee / Owner */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${avatarClass}`}>
                        {initials}
                      </div>
                      <div className="truncate max-w-[100px]">
                        <p className="font-medium text-slate-900 dark:text-[#eee] truncate text-[11px]">{task.userOwner}</p>
                      </div>
                    </div>
                  </td>

                  {/* Created By — hidden on mobile */}
                  <td className="py-3 px-3 hidden md:table-cell">
                    <p className="font-medium text-slate-800 dark:text-[#ccc] truncate text-[11px] max-w-[120px]">{task.createdBy}</p>
                  </td>

                  {/* Task Start Date */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-700 dark:text-[#aaa]">
                      <Calendar className={`w-3 h-3 shrink-0 ${isToday ? 'text-amber-500' : 'text-slate-400 dark:text-[#555]'}`} />
                      <span className={`text-[10px] sm:text-[11px] ${isToday ? 'font-bold text-amber-900 dark:text-amber-300' : ''}`}>
                        {formatFriendlyDate(task.taskStartDate)}
                      </span>
                    </div>
                  </td>

                  {/* Individual Hours */}
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                      <Clock className="w-2.5 h-2.5" />
                      {task.individualHours}h
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#1a1a1a] transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#888]">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#ddd]"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="hidden sm:inline">
            <strong className="text-slate-700 dark:text-[#ccc]">{startIndex + 1}</strong>–<strong className="text-slate-700 dark:text-[#ccc]">{Math.min(startIndex + pageSize, tasks.length)}</strong> of <strong className="text-slate-700 dark:text-[#ccc]">{tasks.length}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-[#aaa] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 font-medium text-slate-700 dark:text-[#ccc]">
            {currentPage}/{totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a] text-slate-600 dark:text-[#aaa] hover:bg-slate-50 dark:hover:bg-[#1a1a1a] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
