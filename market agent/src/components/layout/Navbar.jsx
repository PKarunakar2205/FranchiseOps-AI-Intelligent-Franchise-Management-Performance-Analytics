import React from 'react';
import { Search, Bell, MapPin, Sparkles, Plus, ShieldCheck } from 'lucide-react';

export const Navbar = ({ onOpenQuickActions }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between ml-64">
      {/* Search & Location Bar */}
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns, ROI metrics, audience cohorts, AI recommendations..."
            className="w-full bg-slate-950/80 border border-slate-700/80 text-xs text-slate-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">All 28 Indian Outlets</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenQuickActions}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Quick AI Actions
        </button>

        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              4
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Live Attribution
        </div>
      </div>
    </header>
  );
};
