import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Home, AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10 animate-pulse">
        <AlertCircle size={40} />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
          404 — Telemetry Route Not Found
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Page Does Not Exist
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The franchise agent module or report route you requested is unavailable or has been relocated.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all"
        >
          <Home size={16} /> Return to Executive Dashboard
        </Link>
      </div>
    </div>
  );
}
