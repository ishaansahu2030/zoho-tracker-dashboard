'use client';

import React from 'react';
import { Calendar, Clock, Sparkles } from '@/components/Icons';
import { ZohoTask } from '@/lib/types';
import { formatFriendlyDate, isTodayDate } from '@/lib/date-utils';

interface TaskCardGridProps {
  tasks: ZohoTask[];
  onSelectTask: (task: ZohoTask) => void;
}

export const TaskCardGrid: React.FC<TaskCardGridProps> = ({ tasks, onSelectTask }) => {
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
      'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
      'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
      'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
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
        <h3 className="text-base font-semibold text-slate-800 dark:text-[#eee]">No trackers found</h3>
        <p className="text-xs text-slate-500 dark:text-[#888] mt-1">Try adjusting your filters or date range.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {tasks.map((task, idx) => {
        const isToday = isTodayDate(task.taskStartDate);
        const avatarColor = getAvatarColor(task.userOwner);
        const initials = getInitials(task.userOwner);

        return (
          <div
            key={`${task.taskId}-${task.userOwner}-${idx}`}
            onClick={() => onSelectTask(task)}
            className="bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-[#222222] p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Row: Project Tag & Hours Pill */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-slate-100 dark:bg-[#1a1a1a] text-slate-700 dark:text-[#bbb] border border-slate-200 dark:border-[#2a2a2a] truncate max-w-[160px] sm:max-w-[180px]">
                  {task.projectName}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {isToday && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                      <Sparkles className="w-2.5 h-2.5" />
                      Today
                    </span>
                  )}
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {task.individualHours}h
                  </span>
                </div>
              </div>

              {/* Task Name */}
              <h3 className="font-bold text-slate-900 dark:text-[#eee] text-xs sm:text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                {task.taskName}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 dark:text-[#555] mt-1 truncate">ID: {task.taskId}</p>
            </div>

            {/* Bottom Section: Assignee and Date */}
            <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 dark:border-[#1e1e1e] flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[9px] sm:text-[10px] shrink-0 ${avatarColor}`}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-[#ddd] truncate text-[10px] sm:text-xs">{task.userOwner}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-[#666] truncate">By {task.createdBy}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-[#888] font-medium">
                  <Calendar className="w-3 h-3 text-slate-400 dark:text-[#555]" />
                  <span>{formatFriendlyDate(task.taskStartDate)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
