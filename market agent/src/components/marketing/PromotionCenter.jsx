import React, { useState } from 'react';
import { Tag, Sparkles, Clock, Copy, Check, Gift, Zap } from 'lucide-react';
import { PROMOTIONS_DATA } from '../../mock/marketingData';

export const PromotionCenter = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Tag className="w-5 h-5 text-indigo-400" /> Promotion & Discount Voucher Management Center
        </h2>
        <p className="text-xs text-slate-400">Manage coupon redemptions, flash sales, festival offers, and promotional discount caps.</p>
      </div>

      {/* Active Promotions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Active Promotions & Flash Sales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROMOTIONS_DATA.active.map((prm) => (
            <div key={prm.id} className="glass-card rounded-xl p-4 border border-slate-700/60 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {prm.type}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Valid till {prm.validTill}</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-100">{prm.title}</h4>
                <p className="text-xs text-indigo-300 font-medium">{prm.discount}</p>
              </div>

              {/* Coupon Code Pill */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-xs">
                <span className="font-mono font-bold text-slate-200 tracking-wider">{prm.code}</span>
                <button
                  onClick={() => handleCopyCode(prm.code)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copiedCode === prm.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode === prm.code ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Claims Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Redeemed</span>
                  <span className="font-semibold text-slate-200">{prm.claims.toLocaleString()} / {prm.limit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${(prm.claims / prm.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming & Expired Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Upcoming Promotions */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Gift className="w-4 h-4 text-purple-400" /> Upcoming Festival & Holiday Campaigns
          </h3>

          <div className="space-y-3">
            {PROMOTIONS_DATA.upcoming.map((prm) => (
              <div key={prm.id} className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-200">{prm.title} ({prm.code})</div>
                  <div className="text-indigo-300 text-[11px]">{prm.discount}</div>
                  <div className="text-[10px] text-slate-500">Starts {prm.startDate} • Est Reach: {prm.estReach}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                  Upcoming
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expired Promotions */}
        <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" /> Concluded Promotion History
          </h3>

          <div className="space-y-3">
            {PROMOTIONS_DATA.expired.map((prm) => (
              <div key={prm.id} className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-300">{prm.title} ({prm.code})</div>
                  <div className="text-slate-400 text-[11px]">{prm.discount}</div>
                  <div className="text-[10px] text-slate-500">Expired {prm.expiredDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{prm.totalRevenue}</div>
                  <div className="text-[10px] text-slate-400">{prm.claims.toLocaleString()} Claims</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
