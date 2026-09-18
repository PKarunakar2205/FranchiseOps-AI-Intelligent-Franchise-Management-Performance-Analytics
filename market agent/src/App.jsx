import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MarketingAgentPage } from './pages/MarketingAgentPage';
import { OutletPerformancePage } from './pages/OutletPerformancePage';
import { InventoryAgentPage } from './pages/InventoryAgentPage';

export default function App() {
  const [activeModule, setActiveModule] = useState('marketing');
  const [activeSection, setActiveSection] = useState('overview');
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Fixed Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header Navbar */}
        <Navbar onOpenQuickActions={() => setIsQuickActionsOpen(true)} />

        {/* Page Router Body */}
        <main className="flex-1 ml-64 overflow-y-auto pb-12">
          {activeModule === 'marketing' && (
            <MarketingAgentPage
              activeSection={activeSection}
              onOpenQuickActions={() => setIsQuickActionsOpen(true)}
              isQuickActionsOpen={isQuickActionsOpen}
              setIsQuickActionsOpen={setIsQuickActionsOpen}
            />
          )}

          {activeModule === 'outlet' && <OutletPerformancePage />}
          {activeModule === 'inventory' && <InventoryAgentPage />}
        </main>
      </div>
    </div>
  );
}
