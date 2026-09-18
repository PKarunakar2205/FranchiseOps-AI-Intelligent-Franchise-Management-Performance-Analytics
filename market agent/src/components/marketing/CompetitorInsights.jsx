import React from 'react';
import { Target, Shield, AlertTriangle, TrendingUp, Award, Zap } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { COMPETITOR_INSIGHTS } from '../../mock/marketingData';

export const CompetitorInsights = () => {
  const { marketShare, swot } = COMPETITOR_INSIGHTS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" /> Competitive Market Intelligence & SWOT Matrix
        </h2>
        <p className="text-xs text-slate-400">Benchmarking franchise market share, ad spend parity, pricing indices, and strategic SWOT positioning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Share Pie Chart (1/3 width) */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Regional Market Share %</span>
            <span className="text-xs font-semibold text-indigo-400">Leader: 34.5%</span>
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="share"
                >
                  {marketShare.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Market Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {marketShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[170px]">{item.name}</span>
                </div>
                <span className="text-slate-400 font-bold">{item.share}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* SWOT Summary Matrix (2/3 width) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> AI Strategic SWOT Analysis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {swot.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-rose-950/30 border border-rose-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Weaknesses
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {swot.weaknesses.map((wkn, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{wkn}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Opportunities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {swot.opportunities.map((opp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-amber-950/30 border border-amber-500/20 p-4 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Threats
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {swot.threats.map((th, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{th}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
