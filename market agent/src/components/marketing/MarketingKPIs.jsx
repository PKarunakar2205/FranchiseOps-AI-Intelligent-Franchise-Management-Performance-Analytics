import React from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone, Activity, CheckCircle, TrendingUp, DollarSign,
  Briefcase, UserPlus, Repeat, Award, Share2, Globe, Mail,
  Sparkles, Info, ArrowUpRight, ArrowDownRight, Target
} from 'lucide-react';
import { MARKETING_KPIS } from '../../mock/marketingData';
import { Sparkline } from '../common/Sparkline';
import { Tooltip } from '../common/Tooltip';

const ICON_MAP = {
  total_campaigns: Megaphone,
  active_campaigns: Activity,
  completed_campaigns: CheckCircle,
  campaign_roi: TrendingUp,
  marketing_spend: DollarSign,
  revenue_generated: Briefcase,
  cpa: Target,
  clv: TrendingUp,
  conversion_rate: ArrowUpRight,
  customer_acquisition: UserPlus,
  repeat_customers: Repeat,
  health_score: Award,
  social_reach: Share2,
  website_visitors: Globe,
  email_open_rate: Mail,
  ai_confidence: Sparkles,
};

export const MarketingKPIs = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Executive Marketing Performance KPIs
          </h2>
          <p className="text-xs text-slate-400">Real-time enterprise metrics, ROI benchmarks, and predictive AI scores across 28 outlets.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
            Updated: 2 mins ago
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MARKETING_KPIS.map((kpi, idx) => {
          const IconComponent = ICON_MAP[kpi.id] || Megaphone;
          const isUp = kpi.isPositive;
          const sparkColor = isUp ? '#10b981' : '#f43f5e';

          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="glass-card rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/40 relative overflow-hidden group"
            >
              {/* Top Row: Icon, Title & Tooltip */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 line-clamp-1">{kpi.title}</span>
                  </div>
                  <Tooltip text={kpi.description}>
                    <button className="text-slate-500 hover:text-slate-300">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip>
                </div>

                {/* Main Metric Value & Trend Badge */}
                <div className="flex items-baseline justify-between my-1">
                  <div className="text-xl lg:text-2xl font-extrabold text-slate-50 tracking-tight">
                    {kpi.value}
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-md ${
                    isUp
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Sparkline & Target */}
              <div className="pt-3 mt-2 border-t border-slate-700/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{kpi.target}</span>
                <Sparkline data={kpi.sparkline} color={sparkColor} width={80} height={24} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
