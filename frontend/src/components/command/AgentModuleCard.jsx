import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export default function AgentModuleCard({ agent }) {
  const navigate = useNavigate();
  if (!agent) return null;

  const IconComp = agent.icon;

  const statusColors = {
    Optimal: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    Active: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    Watch: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    Critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
  };

  const badgeClass = statusColors[agent.status] || statusColors.Active;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-105 transition-transform">
              {IconComp && <IconComp className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {agent.name}
              </h3>
              <p className="text-2xs text-slate-400 font-medium">Module #{agent.id}</p>
            </div>
          </div>
          <span className={`text-2xs font-extrabold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
            {agent.status}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed min-h-[36px]">
          {agent.purpose}
        </p>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider block">KEY METRIC</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{agent.keyMetric}</span>
          </div>
          <div className="text-right">
            <span className="text-2xs font-semibold text-slate-400 uppercase tracking-wider block">STATE</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{agent.stateLabel}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-2xs text-slate-400 font-medium flex items-center gap-1">
          <Activity className="w-3 h-3 text-blue-400" />
          Autonomous Telemetry
        </span>
        <button
          onClick={() => navigate(agent.path)}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
        >
          Open Agent <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
