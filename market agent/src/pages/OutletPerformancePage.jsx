import React from 'react';
import { Store, TrendingUp, Star, MapPin, Award } from 'lucide-react';
import { OUTLET_PERFORMANCE_SUMMARY } from '../mock/outletData';

export const OutletPerformancePage = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Store className="w-5 h-5 text-indigo-400" /> Outlet Performance Agent
        </h2>
        <p className="text-xs text-slate-400">Monitor store sales, customer ratings, manager KPIs, and regional franchise growth.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Total Franchise Stores</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{OUTLET_PERFORMANCE_SUMMARY.totalOutlets} Outlets</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Gross Quarterly Sales</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{OUTLET_PERFORMANCE_SUMMARY.totalSales}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Avg Order Value (AOV)</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{OUTLET_PERFORMANCE_SUMMARY.avgOrderValue}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Customer Rating</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{OUTLET_PERFORMANCE_SUMMARY.customerSatisfaction}</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Regional Store Performance Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <th className="py-3 px-4">Outlet Name</th>
                <th className="py-3 px-3">Store Manager</th>
                <th className="py-3 px-3">Monthly Revenue</th>
                <th className="py-3 px-3">YoY Growth</th>
                <th className="py-3 px-3">CSAT Rating</th>
                <th className="py-3 px-3">Status Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {OUTLET_PERFORMANCE_SUMMARY.outlets.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-200">{o.name}</td>
                  <td className="py-3 px-3 text-slate-300">{o.manager}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{o.revenue}</td>
                  <td className="py-3 px-3 text-indigo-400 font-semibold">{o.growth}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{o.rating} ⭐</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
