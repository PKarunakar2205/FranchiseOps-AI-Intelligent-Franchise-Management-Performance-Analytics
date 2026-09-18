import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert, TrendingUp, Zap, Target } from 'lucide-react';
import { AI_RECOMMENDATIONS } from '../../mock/marketingData';

export const AIInsightsPanel = ({ onTriggerAction }) => {
  const [executedIds, setExecutedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAction = (rec) => {
    setExecutedIds(prev => [...prev, rec.id]);
    setToastMessage(`Action Executed: "${rec.title}"! Campaign parameters updated.`);
    if (onTriggerAction) onTriggerAction(rec);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> AI Marketing Recommendation Engine
          </h2>
          <p className="text-xs text-slate-400">Autonomous optimization suggestions powered by multi-touch attribution models.</p>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1.5 self-start">
          <Zap className="w-3.5 h-3.5" /> 98.5% Accuracy Model Active
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_RECOMMENDATIONS.map((rec, idx) => {
          const isExecuted = executedIds.includes(rec.id);

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass-card rounded-xl p-5 border border-slate-700/60 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 relative group overflow-hidden"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority} Priority
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-mono font-bold bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    <Target className="w-3 h-3 text-indigo-400" /> {rec.confidence} Conf.
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-1.5 group-hover:text-indigo-300 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {rec.description}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Impact / Est Rev</span>
                    <span className="font-bold text-emerald-400">{rec.estRevenue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Expected ROI</span>
                    <span className="font-bold text-indigo-400">{rec.expectedRoi}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleAction(rec)}
                disabled={isExecuted}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isExecuted
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                {isExecuted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recommendation Applied
                  </>
                ) : (
                  <>
                    {rec.actionText} <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
