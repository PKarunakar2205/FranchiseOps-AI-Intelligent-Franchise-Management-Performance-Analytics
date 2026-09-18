import React, { useState } from 'react';
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

export const MarketingAgentPage = ({ activeSection, onOpenQuickActions, isQuickActionsOpen, setIsQuickActionsOpen }) => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* SECTION 1: KPI Cards */}
      {(activeSection === 'overview' || activeSection === 'all') && (
        <section id="kpis">
          <MarketingKPIs />
        </section>
      )}

      {/* SECTION 4: AI Insights Panel */}
      {(activeSection === 'overview' || activeSection === 'ai_insights' || activeSection === 'all') && (
        <section id="ai_insights">
          <AIInsightsPanel onTriggerAction={() => setIsQuickActionsOpen(true)} />
        </section>
      )}

      {/* SECTION 2: Campaign Performance Table */}
      {(activeSection === 'overview' || activeSection === 'campaigns' || activeSection === 'all') && (
        <section id="campaigns">
          <CampaignPerformanceTable onOpenCreateModal={() => setIsQuickActionsOpen(true)} />
        </section>
      )}

      {/* SECTION 3: Analytics Charts Grid */}
      {(activeSection === 'overview' || activeSection === 'charts' || activeSection === 'all') && (
        <section id="charts">
          <AnalyticsChartsGrid />
        </section>
      )}

      {/* SECTION 5 & 8: Customer Analytics & AI Segmentation */}
      {(activeSection === 'overview' || activeSection === 'customers' || activeSection === 'all') && (
        <section id="customers">
          <CustomerAnalytics />
        </section>
      )}

      {/* SECTION 6 & 7: Social Media & Email Analytics */}
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

      {/* SECTION 9 & 10: Marketing Budget & Promotion Center */}
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

      {/* SECTION 11 & 12: Competitor Insights & Alert Center */}
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

      {/* SECTION 14: Reports & Export */}
      {(activeSection === 'overview' || activeSection === 'reports' || activeSection === 'all') && (
        <section id="reports">
          <ReportsExport />
        </section>
      )}

      {/* SECTION 13: Quick Actions Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
      />
    </div>
  );
};
