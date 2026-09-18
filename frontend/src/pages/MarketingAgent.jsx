import React, { useState } from 'react';
import { Megaphone, Sparkles, Filter, Plus, Layers, BarChart3, Users, Share2, Wallet, Tag, AlertTriangle, FileText } from 'lucide-react';
import { MarketingKPIs } from '../components/marketing/MarketingKPIs';
import { CampaignPerformanceTable } from '../components/marketing/CampaignPerformanceTable';
import { AnalyticsChartsGrid } from '../components/marketing/AnalyticsChartsGrid';
import { AIInsightsPanel } from '../components/marketing/AIInsightsPanel';
import { CustomerAnalytics } from '../components/marketing/CustomerAnalytics';
import { SocialMediaAnalytics } from '../components/marketing/SocialMediaAnalytics';
import { EmailAnalytics } from '../components/marketing/EmailAnalytics';
import { MarketingBudget } from '../components/marketing/MarketingBudget';
import { PromotionCenter } from '../components/marketing/PromotionCenter';
import { CompetitorInsights } from '../components/marketing/CompetitorInsights';
import { AlertCenter } from '../components/marketing/AlertCenter';
import { ReportsExport } from '../components/marketing/ReportsExport';
import { QuickActionsModal } from '../components/marketing/QuickActionsModal';

export default function MarketingAgent() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: Megaphone },
    { id: 'ai_insights', label: 'AI Insights', icon: Sparkles },
    { id: 'campaigns', label: 'Campaigns', icon: Layers },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'social_email', label: 'Social & Email', icon: Share2 },
    { id: 'budget_promo', label: 'Budget & Promos', icon: Wallet },
    { id: 'competitors_alerts', label: 'Alerts & Intel', icon: AlertTriangle },
    { id: 'reports', label: 'Export Reports', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Marketing Agent
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Autonomous ad spend optimization, multi-channel customer acquisition, and ROI analytics engine.
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 hover:opacity-95 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" /> Marketing Action Suite
        </button>
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: KPI Cards */}
      {(activeSection === 'overview' || activeSection === 'all') && (
        <section id="kpis">
          <MarketingKPIs />
        </section>
      )}

      {/* SECTION 2: AI Insights Panel */}
      {(activeSection === 'overview' || activeSection === 'ai_insights' || activeSection === 'all') && (
        <section id="ai_insights">
          <AIInsightsPanel onTriggerAction={() => setIsQuickActionsOpen(true)} />
        </section>
      )}

      {/* SECTION 3: Campaign Performance Table */}
      {(activeSection === 'overview' || activeSection === 'campaigns' || activeSection === 'all') && (
        <section id="campaigns">
          <CampaignPerformanceTable onOpenCreateModal={() => setIsQuickActionsOpen(true)} />
        </section>
      )}

      {/* SECTION 4: Analytics Charts Grid */}
      {(activeSection === 'overview' || activeSection === 'charts' || activeSection === 'all') && (
        <section id="charts">
          <AnalyticsChartsGrid />
        </section>
      )}

      {/* SECTION 5: Customer Analytics */}
      {(activeSection === 'overview' || activeSection === 'customers' || activeSection === 'all') && (
        <section id="customers">
          <CustomerAnalytics />
        </section>
      )}

      {/* SECTION 6: Social Media & Email Analytics */}
      {(activeSection === 'overview' || activeSection === 'social_email' || activeSection === 'all') && (
        <div className="space-y-8">
          <section id="social">
            <SocialMediaAnalytics />
          </section>
          <section id="email">
            <EmailAnalytics />
          </section>
        </div>
      )}

      {/* SECTION 7: Marketing Budget & Promotion Center */}
      {(activeSection === 'overview' || activeSection === 'budget_promo' || activeSection === 'all') && (
        <div className="space-y-8">
          <section id="budget">
            <MarketingBudget />
          </section>
          <section id="promo">
            <PromotionCenter />
          </section>
        </div>
      )}

      {/* SECTION 8: Competitor Insights & Alert Center */}
      {(activeSection === 'overview' || activeSection === 'competitors_alerts' || activeSection === 'all') && (
        <div className="space-y-8">
          <section id="alerts">
            <AlertCenter />
          </section>
          <section id="competitors">
            <CompetitorInsights />
          </section>
        </div>
      )}

      {/* SECTION 9: Reports & Export */}
      {(activeSection === 'overview' || activeSection === 'reports' || activeSection === 'all') && (
        <section id="reports">
          <ReportsExport />
        </section>
      )}

      {/* Quick Actions Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
      />
    </div>
  );
}
