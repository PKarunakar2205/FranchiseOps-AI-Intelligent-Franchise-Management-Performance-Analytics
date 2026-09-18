import React from 'react';
import { Megaphone, Store, Package, Sparkles, BarChart2, Shield, Settings, Bell, HelpCircle } from 'lucide-react';

export const Sidebar = ({ activeModule, setActiveModule, activeSection, setActiveSection }) => {
  const modules = [
    { id: 'marketing', name: 'Marketing Agent', icon: Megaphone, badge: 'AI Active' },
    { id: 'outlet', name: 'Outlet Performance', icon: Store, badge: '28 Stores' },
    { id: 'inventory', name: 'Inventory Agent', icon: Package, badge: 'Low Stock: 14' },
  ];

  const marketingSections = [
    { id: 'overview', label: 'Executive Overview' },
    { id: 'campaigns', label: 'Campaign Performance' },
    { id: 'charts', label: 'Analytics & Funnels' },
    { id: 'ai_insights', label: 'AI Recommendations' },
    { id: 'customers', label: 'Customer & Cohorts' },
    { id: 'social_email', label: 'Social & Email CRM' },
    { id: 'budget_promo', label: 'Budget & Promo Center' },
    { id: 'competitors_alerts', label: 'Competitors & Alerts' },
    { id: 'reports', label: 'Reports & Export' }
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between h-screen fixed left-0 top-0 z-40 backdrop-blur-xl">
      {/* Top Branding Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-100 tracking-tight">FranchiseOps AI</h1>
            <p className="text-[10px] font-medium text-slate-400">Enterprise AI Suite v4.2</p>
          </div>
        </div>

        {/* Modules Section */}
        <div className="p-3 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
            Core AI Agents
          </span>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{mod.name}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {mod.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-section Links for Marketing Agent */}
        {activeModule === 'marketing' && (
          <div className="px-3 py-2 border-t border-slate-800/80 space-y-0.5 max-h-[42vh] overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
              Marketing Navigation
            </span>
            {marketingSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === sec.id
                    ? 'text-indigo-400 bg-indigo-950/50 border-l-2 border-indigo-500 pl-2.5 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              CM
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Aarav Sharma</div>
              <div className="text-[9px] text-slate-500">Chief Marketing Officer</div>
            </div>
          </div>
          <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};
