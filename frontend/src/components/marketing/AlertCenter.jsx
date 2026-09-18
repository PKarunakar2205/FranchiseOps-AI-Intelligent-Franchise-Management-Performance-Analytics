import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { ALERTS_DATA } from '../../mock/marketingData';

export const AlertCenter = () => {
  const [alerts, setAlerts] = useState(ALERTS_DATA);

  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getAlertBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return { icon: ShieldAlert, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'High':
        return { icon: AlertTriangle, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'Medium':
        return { icon: AlertCircle, color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' };
      default:
        return { icon: Info, color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Real-time Marketing Alert & Anomaly Center
          </h2>
          <p className="text-xs text-slate-400">Automated budget caps, bounce rate thresholds, and performance deviation warnings.</p>
        </div>
        <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          {alerts.length} Active Alerts
        </span>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alt) => {
            const badge = getAlertBadge(alt.severity);
            const IconComp = badge.icon;

            return (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass-card rounded-xl p-4 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${badge.color} shrink-0`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                        {alt.severity}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{alt.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">• {alt.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alt.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleResolveAlert(alt.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 shrink-0 self-start sm:self-center flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {alt.action}
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="glass-card p-8 rounded-xl text-center text-slate-400 text-xs border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            All marketing operational alerts resolved cleanly!
          </div>
        )}
      </div>
    </div>
  );
};
