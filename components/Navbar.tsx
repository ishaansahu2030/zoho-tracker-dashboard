'use client';

import React from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, Database, Sun, Moon } from '@/components/Icons';

interface NavbarProps {
  lastUpdated: string | null;
  isLoading: boolean;
  totalTasks: number;
  onRefresh: () => void;
  autoRefreshInterval: number; // in seconds (0 = off)
  setAutoRefreshInterval: (seconds: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lastUpdated,
  isLoading,
  totalTasks,
  onRefresh,
  autoRefreshInterval,
  setAutoRefreshInterval,
  isDarkMode,
  toggleDarkMode,
}) => {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Never';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#222222] bg-white/95 dark:bg-[#111111]/95 backdrop-blur shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Branding & Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none shrink-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">
                Zoho Task Tracker
              </h1>
              <span className="hidden xs:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Read-Only Safe</span>
                <span className="sm:hidden">Safe</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-[#888] hidden md:block truncate">
              Live Google Sheets Synchronization • Zero Sheet Modifications
            </p>
          </div>
        </div>

        {/* Action Controls & Sync Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Last sync — md+ only */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs text-slate-500 dark:text-[#888]">Last Synced</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-[#ccc] flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {formattedTime}
            </span>
          </div>

          {/* Auto-Sync Dropdown — sm+ */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-[#888] bg-slate-50 dark:bg-[#1a1a1a] px-2 py-1.5 rounded-lg border border-slate-200 dark:border-[#2a2a2a]">
            <span className="hidden md:inline">Auto-Sync:</span>
            <select
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
              className="bg-transparent font-semibold text-slate-700 dark:text-[#ddd] focus:outline-none cursor-pointer text-xs"
            >
              <option value={0} className="dark:bg-[#1a1a1a]">Off</option>
              <option value={30} className="dark:bg-[#1a1a1a]">30s</option>
              <option value={60} className="dark:bg-[#1a1a1a]">1 min</option>
              <option value={300} className="dark:bg-[#1a1a1a]">5 min</option>
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-sm font-medium border transition-all ${
              isLoading
                ? 'bg-slate-100 dark:bg-[#1a1a1a] text-slate-400 border-slate-200 dark:border-[#2a2a2a] cursor-not-allowed'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-[#ddd] hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-[#222] border-slate-200 dark:border-[#2a2a2a] shadow-xs active:scale-95'
            }`}
            title="Refresh data from Google Sheets"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isLoading ? 'animate-spin text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-[#aaa]'}`} />
            <span className="hidden sm:inline text-xs sm:text-sm">{isLoading ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-slate-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-[#aaa] hover:bg-slate-100 dark:hover:bg-[#222] transition-colors shadow-xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
