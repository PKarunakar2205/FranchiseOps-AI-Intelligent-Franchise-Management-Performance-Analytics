import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Clock, ThumbsUp, MessageSquare, Repeat, Eye, Play, Award } from 'lucide-react';
import { SOCIAL_MEDIA_METRICS } from '../../mock/marketingData';

export const SocialMediaAnalytics = () => {
  const [platform, setPlatform] = useState('instagram');
  const data = SOCIAL_MEDIA_METRICS[platform];

  return (
    <div className="space-y-6">
      {/* Header & Platform Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" /> Multi-Platform Social Media Performance
          </h2>
          <p className="text-xs text-slate-400">Track organic reach, post engagement rates, viral content performance, and posting hour heatmaps.</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/70 text-xs">
          {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'].map((plt) => (
            <button
              key={plt}
              onClick={() => setPlatform(plt)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                platform === plt
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {plt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Platform Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Audience / Followers</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{data.followers || data.subscribers}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+14.2% YoY growth</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Total Reach / Impressions</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{data.reach || data.views}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Past 30 Days</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block">Engagement Rate</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{data.engagement || data.ctr}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Top 5% Industry</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-700/60">
          <span className="text-xs text-slate-400 font-medium uppercase block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Best Posting Time
          </span>
          <div className="text-sm font-bold text-amber-300 mt-2">{data.bestPostingTime}</div>
          <span className="text-[10px] text-slate-500 font-semibold">Peak Footfall Window</span>
        </div>
      </div>

      {/* Top Performing Posts Showcase */}
      <div className="glass-card rounded-xl p-5 border border-slate-700/60 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Top Performing {platform.toUpperCase()} Content
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.topPosts || data.topVideos || []).map((post, idx) => (
            <div key={idx} className="bg-slate-900/90 rounded-lg p-4 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-mono font-semibold">
                Rank #{idx + 1}
              </span>
              <h4 className="text-xs font-bold text-slate-200 line-clamp-2">{post.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-cyan-400" /> {post.impressions || post.views}</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-pink-400" /> {post.likes}</span>
                <span className="font-bold text-emerald-400">{post.engagements || post.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
