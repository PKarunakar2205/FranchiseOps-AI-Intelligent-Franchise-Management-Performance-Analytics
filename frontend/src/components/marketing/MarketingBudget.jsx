import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, PieChart as PieIcon, Wallet, Percent, TrendingUp, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { MARKETING_BUDGET } from '../../mock/marketingData';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

export const MarketingBudget = () => {
  const { totalBudget, spentBudget, remainingBudget, utilizationPct, departments } = MARKETING_BUDGET;

  const pieData = departments.map((dept, idx) => ({
    name: dept.name,
    value: dept.spent,
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-400" /> Enterprise Marketing Budget & Expenditure Audit
        </h2>
        <p className="text-xs text-slate-400">Departmental allocation, real-time budget utilization %, and channel ROI yields.</p>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Total Fiscal Budget</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">₹{(totalBudget / 100000).toFixed(2)} Lakhs</div>
          <span className="text-[10px] text-slate-500 font-semibold">Q3 Authorized Cap</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Spent to Date</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">₹{(spentBudget / 100000).toFixed(2)} Lakhs</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Allocated to 32 Campaigns</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Remaining Balance</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">₹{(remainingBudget / 100000).toFixed(2)} Lakhs</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Available Capital</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Budget Utilization</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{utilizationPct}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${utilizationPct}%` }} />
          </div>
        </div>
      </div>

      {/* Breakdown Grid: Department Progress Bars & Expense Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Bars Column (2/3 width) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Departmental Budget Allocation & Channel ROI</span>
            <span className="text-xs text-slate-400 font-normal">Spent vs Allocated</span>
          </h3>

          <div className="space-y-4 pt-1">
            {departments.map((dept, idx) => {
              const spentPct = ((dept.spent / dept.allocated) * 100).toFixed(1);
              return (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dept.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        ₹{(dept.spent / 100000).toFixed(2)}L / ₹{(dept.allocated / 100000).toFixed(2)}L
                      </span>
                      <span className="font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                        {dept.roi}x ROI
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${spentPct}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Breakdown Pie Chart Column (1/3 width) */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-3 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-400" /> Share of Expenditure
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`₹${(val / 100000).toFixed(2)} Lakhs`, 'Spent']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[160px]">{item.name}</span>
                </div>
                <span className="text-slate-400 font-semibold">₹{(item.value / 100000).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
