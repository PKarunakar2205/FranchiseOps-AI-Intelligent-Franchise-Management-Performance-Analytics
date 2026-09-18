import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ShieldCheck, ArrowRight, Building2, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function AiDecisionCard({ recommendation }) {
  const navigate = useNavigate();
  if (!recommendation) return null;

  const priorityStyles = {
    CRITICAL: {
      border: "border-red-500/30 bg-red-500/5 dark:bg-red-500/10",
      badge: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
      icon: "text-red-500"
    },
    HIGH: {
      border: "border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/10",
      badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
      icon: "text-orange-500"
    },
    MEDIUM: {
      border: "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: "text-amber-500"
    },
    LOW: {
      border: "border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      icon: "text-blue-500"
    }
  };

  const priority = (recommendation.priority || "MEDIUM").toUpperCase();
  const style = priorityStyles[priority] || priorityStyles.MEDIUM;

  const handleOpenModule = () => {
    if (recommendation.route) {
      navigate(recommendation.route);
    } else if (recommendation.category?.toLowerCase().includes("audit") || recommendation.id?.includes("audit")) {
      navigate("/audit");
    } else if (recommendation.category?.toLowerCase().includes("inventory") || recommendation.id?.includes("inv")) {
      navigate("/inventory");
    } else if (recommendation.category?.toLowerCase().includes("staff") || recommendation.id?.includes("stf")) {
      navigate("/staff");
    } else if (recommendation.category?.toLowerCase().includes("marketing") || recommendation.id?.includes("mkt")) {
      navigate("/marketing");
    } else {
      navigate("/executive-decision-center");
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${style.border} space-y-3 shadow-2xs hover:shadow-xs transition-all`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {recommendation.outlet || "Network Store"}
          </span>
        </div>
        <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full border ${style.badge}`}>
          {priority} PRIORITY
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div>
          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-2xs block">DETECTED ISSUE</span>
          <p className="text-slate-800 dark:text-slate-200 font-semibold">{recommendation.observation || recommendation.problem}</p>
        </div>

        <div>
          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-2xs block">BUSINESS IMPACT</span>
          <p className="text-slate-600 dark:text-slate-400">{recommendation.reason || recommendation.impact}</p>
        </div>

        <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <span className="font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-2xs block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" /> RECOMMENDED ACTION
          </span>
          <p className="text-slate-900 dark:text-slate-100 font-medium">{recommendation.recommendedAction || recommendation.action}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
        <span className="text-2xs text-slate-400 font-medium flex items-center gap-1">
          <BrainCircuit className="w-3 h-3 text-purple-400" />
          Source: {recommendation.category || "AI Telemetry"}
        </span>
        <button
          onClick={handleOpenModule}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
        >
          Open Module <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
