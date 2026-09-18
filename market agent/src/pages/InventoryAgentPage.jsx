import React from 'react';
import { Package, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { INVENTORY_SUMMARY } from '../mock/inventoryData';

export const InventoryAgentPage = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-400" /> Inventory Agent & Supply Chain Hub
        </h2>
        <p className="text-xs text-slate-400">Predictive stock reordering, ingredient turnover rates, and low stock threshold alerts.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">SKUs Monitored</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{INVENTORY_SUMMARY.totalItems} Items</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Stock Turnover Rate</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{INVENTORY_SUMMARY.stockTurnoverRate}</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Low Stock Alerts</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{INVENTORY_SUMMARY.lowStockItems} Items</div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium">Stock Valuation</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{INVENTORY_SUMMARY.totalStockValue}</div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Live Inventory Audit Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <th className="py-3 px-4">SKU Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Stock Level</th>
                <th className="py-3 px-3">Reorder Point</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {INVENTORY_SUMMARY.items.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-200">{inv.name}</td>
                  <td className="py-3 px-3 text-slate-300">{inv.category}</td>
                  <td className="py-3 px-3 font-semibold text-slate-100">{inv.stockLevel}</td>
                  <td className="py-3 px-3 text-slate-400">{inv.reorderPoint} units</td>
                  <td className="py-3 px-3 text-indigo-300">{inv.supplier}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {inv.status}
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
