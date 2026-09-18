import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingUp, Heart, ShoppingBag, MapPin, Sparkles, Lightbulb } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CUSTOMER_SEGMENTS } from '../../mock/marketingData';

const AGE_DISTRIBUTION = [
  { group: '18-24', percentage: 28 },
  { group: '25-34', percentage: 42 },
  { group: '35-44', percentage: 18 },
  { group: '45-54', percentage: 8 },
  { group: '55+', percentage: 4 }
];

const LOCATION_DISTRIBUTION = [
  { city: 'Chennai', customers: 6420 },
  { city: 'Bengaluru', customers: 5890 },
  { city: 'Mumbai', customers: 5120 },
  { city: 'Hyderabad', customers: 4300 },
  { city: 'Delhi NCR', customers: 3800 },
  { city: 'Pune', customers: 2450 }
];

export const CustomerAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> Customer Analytics & AI Behavioral Segmentation
        </h2>
        <p className="text-xs text-slate-400">Comprehensive customer cohorts, demographic breakdowns, retention scores, and targeted AI recommendations.</p>
      </div>

      {/* Top 6 Cohort Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">New Customers</span>
          </div>
          <div className="text-lg font-bold text-slate-100">12,530</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+21.3% this mo</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Returning Customers</span>
          </div>
          <div className="text-lg font-bold text-slate-100">18,240</div>
          <span className="text-[10px] text-emerald-400 font-semibold">41.6% repeat rate</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-rose-400 mb-1">
            <UserX className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Lost / Churned</span>
          </div>
          <div className="text-lg font-bold text-slate-100">1,320</div>
          <span className="text-[10px] text-rose-400 font-semibold">-2.1% churn rate</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Customer Growth</span>
          </div>
          <div className="text-lg font-bold text-slate-100">+14.8%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">YoY Trajectory</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-pink-400 mb-1">
            <Heart className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">CSAT Score</span>
          </div>
          <div className="text-lg font-bold text-slate-100">4.82 / 5.0</div>
          <span className="text-[10px] text-emerald-400 font-semibold">96% Satisfaction</span>
        </div>

        <div className="glass-card p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-slate-300">Avg Order Value</span>
          </div>
          <div className="text-lg font-bold text-slate-100">₹425</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+₹38 vs Q1</span>
        </div>
      </div>

      {/* AI Customer Segmentation Detailed Cards (Section 8) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> AI Customer Segments & Automated Nudge Playbooks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CUSTOMER_SEGMENTS.map((seg) => (
            <motion.div
              key={seg.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-4 border border-slate-700/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="font-bold text-sm text-slate-100">{seg.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">{seg.count.toLocaleString()} users</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-lg text-[11px] my-3 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Revenue</span>
                    <span className="font-bold text-slate-200">{seg.revenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Avg Spend</span>
                    <span className="font-bold text-slate-200">{seg.avgSpend}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Retention</span>
                    <span className="font-bold text-emerald-400">{seg.retentionScore}%</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-purple-950/40 border border-purple-500/20 p-2.5 rounded-lg text-xs text-purple-200">
                  <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{seg.aiSuggestion}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demographic & Location Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Age & Gender Distribution */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">Customer Age Distribution (%)</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="group" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                />
                <Bar dataKey="percentage" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Distribution */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" /> Active Customers by City
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LOCATION_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="city" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => [`${val.toLocaleString()} Users`, 'Customers']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                />
                <Bar dataKey="customers" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
