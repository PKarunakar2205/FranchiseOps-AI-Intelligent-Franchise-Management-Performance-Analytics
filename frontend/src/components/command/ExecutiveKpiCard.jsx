import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export default function ExecutiveKpiCard({
  title,
  value,
  trend,
  trendDirection = "up",
  comparison = "vs last period",
  icon: Icon,
  chartData = [],
  color = "blue",
  badgeText = "Live Telemetry"
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
      chart: "#3b82f6",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
    },
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-500",
      border: "border-indigo-500/20",
      chart: "#6366f1",
      badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20",
      chart: "#10b981",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      border: "border-amber-500/20",
      chart: "#f59e0b",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    },
    rose: {
      bg: "bg-rose-500/10",
      text: "text-rose-500",
      border: "border-rose-500/20",
      chart: "#f43f5e",
      badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      border: "border-purple-500/20",
      chart: "#a855f7",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
    }
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {trendDirection === "up" ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {trend}
            </span>
          ) : (
            <span className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              {trend}
            </span>
          )}
          <span className="text-slate-400 text-2xs font-normal">{comparison}</span>
        </div>

        {badgeText && (
          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
            {badgeText}
          </span>
        )}
      </div>

      {/* Mini Sparkline Visualization */}
      {chartData && chartData.length > 0 && (
        <div className="h-10 w-full pt-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.chart} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={theme.chart} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="val" stroke={theme.chart} strokeWidth={2} fill={`url(#gradient-${color})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
