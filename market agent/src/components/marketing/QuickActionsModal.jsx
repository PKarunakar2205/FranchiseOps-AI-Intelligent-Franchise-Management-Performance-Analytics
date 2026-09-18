import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Calendar, Sparkles, Download, Upload, BarChart2, Mail, Tag,
  X, Check, Send, Play
} from 'lucide-react';
import { CAMPAIGN_TYPES, REGIONS, OUTLETS } from '../../mock/marketingData';

export const QuickActionsModal = ({ isOpen, onClose, initialTab = 'create' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Social Media Ad',
    budget: '500000',
    region: 'South India (Chennai, BLR, HYD)',
    outlet: 'Chennai - T. Nagar Flagship',
    prompt: 'Create a high-ROI Independence Day BOGO campaign targeted at IT professionals in Bangalore and Chennai.'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiResult({
        name: "AI Freedom Fest Combo Blowout",
        budget: "₹6,50,000",
        targetAudience: "Age 22–38 Tech Hub Workers & Families",
        channels: ["Instagram Reels", "Facebook Video", "WhatsApp Drip"],
        projectedRevenue: "₹38,40,000",
        expectedRoi: "5.91x",
        recommendedHeadline: "Celebrate Independence with Flat 50% OFF Festive Meal Boxes!"
      });
    }, 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('Operation completed successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> FranchiseOps Marketing Action Suite
            </h3>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Create Campaign
            </button>
            <button
              onClick={() => setActiveTab('ai_generator')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeTab === 'ai_generator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" /> AI Generator
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeTab === 'schedule' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Schedule Ad
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeTab === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Send Email
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${
                activeTab === 'promo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" /> Flash Promo
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {successMsg && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> {successMsg}
              </div>
            )}

            {/* TAB: Create Campaign */}
            {activeTab === 'create' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Campaign Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Festival BOGO Offer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Campaign Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-indigo-500"
                    >
                      {CAMPAIGN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Budget (₹)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Target Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:border-indigo-500"
                    >
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg">
                    Launch Campaign
                  </button>
                </div>
              </form>
            )}

            {/* TAB: AI Generator */}
            {activeTab === 'ai_generator' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Enter AI Campaign Prompt</label>
                  <textarea
                    rows={3}
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> {isGenerating ? 'Synthesizing High-ROI Campaign...' : 'Generate Autonomous AI Campaign'}
                </button>

                {aiResult && (
                  <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-purple-300 text-sm">{aiResult.name}</div>
                    <p className="text-slate-300 italic">"{aiResult.recommendedHeadline}"</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div><span className="text-slate-500">Projected Rev:</span> <span className="font-bold text-emerald-400">{aiResult.projectedRevenue}</span></div>
                      <div><span className="text-slate-500">Expected ROI:</span> <span className="font-bold text-indigo-400">{aiResult.expectedRoi}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Email Campaign */}
            {activeTab === 'email' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Subject Line</label>
                  <input type="text" defaultValue="Weekend Gourmet Chef Special - 25% OFF" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Recipient Segment</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100">
                    <option>Regular Loyalists (12,450 users)</option>
                    <option>Premium VIP (4,820 users)</option>
                    <option>Dormant Users (2,100 users)</option>
                  </select>
                </div>
                <button onClick={handleSubmit} className="w-full py-2.5 bg-indigo-600 text-xs font-bold rounded-lg text-white flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Dispatch Automated Drip Series
                </button>
              </div>
            )}

            {/* TAB: Flash Promo */}
            {activeTab === 'promo' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Coupon Title & Code</label>
                  <input type="text" defaultValue="FLASH100" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100" />
                </div>
                <button onClick={handleSubmit} className="w-full py-2.5 bg-emerald-600 text-xs font-bold rounded-lg text-white flex items-center justify-center gap-2">
                  <Play className="w-3.5 h-3.5" /> Deploy Flash Promo Offer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
