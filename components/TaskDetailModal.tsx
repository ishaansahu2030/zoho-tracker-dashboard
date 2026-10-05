'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Calendar, Clock, User, Briefcase, Mail, Hash, ShieldCheck } from '@/components/Icons';
import { ZohoTask } from '@/lib/types';
import { formatFriendlyDate, isTodayDate } from '@/lib/date-utils';

interface TaskDetailModalProps {
  task: ZohoTask | null;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!task) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isToday = isTodayDate(task.taskStartDate);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111111] rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-[#222222] overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-[#222222] flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-[#161616]">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 truncate max-w-[200px]">
                {task.projectName}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                  Assigned Today
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-snug break-words">
              {task.taskName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-[#222222] transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Read Only Notice */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Safe Inspection:</strong> Read-only synced from Google Sheet. All sheet data remains unmodified.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Owner / Assignee */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#888] mb-1">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Assigned Owner</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{task.userOwner}</p>
              {task.assigneeEmail && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#888] mt-1">
                  <Mail className="w-3 h-3 text-slate-400 dark:text-[#666] shrink-0" />
                  <span className="truncate">{task.assigneeEmail}</span>
                </div>
              )}
            </div>

            {/* Created By / Assigner */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#888] mb-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                <span>Created / Assigned By</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{task.createdBy}</p>
              {task.assignerEmail && (
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#888] mt-1">
                  <Mail className="w-3 h-3 text-slate-400 dark:text-[#666] shrink-0" />
                  <span className="truncate">{task.assignerEmail}</span>
                </div>
              )}
            </div>

            {/* Start Date */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#888] mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Task Start Date</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatFriendlyDate(task.taskStartDate)}
              </p>
              <p className="text-xs text-slate-400 dark:text-[#666] mt-0.5 truncate">Raw: {task.taskStartDate || 'None'}</p>
            </div>

            {/* Hours */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#181818] border border-slate-100 dark:border-[#262626]">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#888] mb-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>Individual Hours</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {task.individualHours} {task.individualHours === 1 ? 'Hour' : 'Hours'}
              </p>
              <p className="text-xs text-slate-400 dark:text-[#666] mt-0.5 truncate">Created on: {task.createdOn || 'N/A'}</p>
            </div>
          </div>

          {/* Zoho Identifiers */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#222222]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#666]">Zoho Metadata</h4>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#181818] text-xs border border-transparent dark:border-[#262626]">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500 dark:text-[#888] shrink-0">Task ID:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-[#eee] truncate">{task.taskId}</span>
              </div>
              <button
                onClick={() => copyToClipboard(task.taskId, 'taskId')}
                className="p-1 hover:bg-slate-200 dark:hover:bg-[#2a2a2a] rounded text-slate-500 dark:text-[#aaa] transition-colors shrink-0"
                title="Copy Task ID"
              >
                {copiedKey === 'taskId' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {task.projectId && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#181818] text-xs border border-transparent dark:border-[#262626]">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500 dark:text-[#888] shrink-0">Project ID:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-[#eee] truncate">{task.projectId}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(task.projectId, 'projectId')}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-[#2a2a2a] rounded text-slate-500 dark:text-[#aaa] transition-colors shrink-0"
                  title="Copy Project ID"
                >
                  {copiedKey === 'projectId' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-[#161616] border-t border-slate-100 dark:border-[#222222] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
