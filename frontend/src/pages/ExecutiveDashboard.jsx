import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Bell,
  TrendingUp,
  Brain,
  ShieldCheck,
  Boxes,
  Users,
  Megaphone,
  BrainCircuit,
  Activity,
  AlertTriangle,
  RefreshCw,
  Filter,
  ArrowRight,
  Building2,
  Layers,
  Award,
  FileCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import { getDashboardSummary, getExecutiveDecisionCenterApi } from "../api/apiClient";
import ExecutiveKpiCard from "../components/command/ExecutiveKpiCard";
import AiDecisionCard from "../components/command/AiDecisionCard";
import AgentModuleCard from "../components/command/AgentModuleCard";
import OutletDrillDownModal from "../components/command/OutletDrillDownModal";

export default function ExecutiveDashboard({ dark, setDark }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [decisionData, setDecisionData] = useState(null);
  const [selectedOutletDrillDown, setSelectedOutletDrillDown] = useState(null);

  // Filters
  const [regionFilter, setRegionFilter] = useState("All");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, decRes] = await Promise.all([
        getDashboardSummary("30D", regionFilter),
        getExecutiveDecisionCenterApi({ region: regionFilter })
      ]);

      if (dashRes && dashRes.data) {
        setDashboardData(dashRes.data);
      }
      if (decRes && decRes.data) {
        setDecisionData(decRes.data);
      }
    } catch (err) {
      console.error("Failed to load Command Center telemetry:", err);
      setError(err.message || "Failed to load command telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [regionFilter]);

  const overview = dashboardData?.overview || {};
  const edcKpis = decisionData?.kpiSummary || {};
  const revenueTrend = decisionData?.revenueTrend || [];
  const scatterData = decisionData?.scatterAnalysis || [];
  const aiRecommendations = decisionData?.aiRecommendations || [];
  const leaderboard = dashboardData?.outletPerformance?.leaderboard || [];
  const salesByCity = dashboardData?.salesAnalytics?.salesByCity || [];
  const outletsList = decisionData?.outlets || [];

  // Sparkline Collections for KPI Cards
  const sparkRevenue = [{ val: 180 }, { val: 220 }, { val: 210 }, { val: 280 }, { val: 310 }, { val: 290 }, { val: 340 }];
  const sparkOrders = [{ val: 450 }, { val: 490 }, { val: 510 }, { val: 580 }, { val: 620 }, { val: 610 }, { val: 690 }];
  const sparkHealth = [{ val: 82 }, { val: 84 }, { val: 83 }, { val: 86 }, { val: 88 }, { val: 87 }, { val: 89 }];
  const sparkAlerts = [{ val: 12 }, { val: 9 }, { val: 8 }, { val: 6 }, { val: 7 }, { val: 5 }, { val: 4 }];

  // 7 Intelligence Agents Data Model
  const agentModules = [
    {
      id: "1",
      name: "Outlet Performance Agent",
      icon: Store,
      path: "/outlet-performance",
      status: "Optimal",
      purpose: "Monitors outlet revenue velocity, health index, store rankings, and regional performance.",
      keyMetric: `₹${(Number(overview.totalRevenue || 0) / 100000).toFixed(2)}L Revenue`,
      stateLabel: `${overview.totalOutlets || 9} Monitored Stores`
    },
    {
      id: "2",
      name: "Inventory Agent",
      icon: Boxes,
      path: "/inventory",
      status: overview.lowStockCount > 0 ? "Watch" : "Optimal",
      purpose: "Tracks stock cover, reorder thresholds, batch expirations, and triggers purchase orders.",
      keyMetric: `${overview.inventoryHealthPct || 92}% Stock Health`,
      stateLabel: `${overview.lowStockCount || 3} Low Stock SKUs`
    },
    {
      id: "3",
      name: "Staff Agent",
      icon: Users,
      path: "/staff",
      status: "Active",
      purpose: "Manages shift rosters, sales-per-hour telemetry, attendance, and SwiftLeave replacement AI.",
      keyMetric: `${overview.staffCoveragePct || 95}% Attendance`,
      stateLabel: "Roster Optimal"
    },
    {
      id: "4",
      name: "Marketing Intelligence Agent",
      icon: Megaphone,
      path: "/marketing",
      status: "Optimal",
      purpose: "Evaluates ad channel performance, Return on Ad Spend (ROAS), and promotional campaign ROI.",
      keyMetric: `${overview.marketingRoi || 372}% ROAS ROI`,
      stateLabel: "High Campaign ROI"
    },
    {
      id: "5",
      name: "Audit & Compliance Intelligence",
      icon: ShieldCheck,
      path: "/audit",
      status: edcKpis.auditCompliancePct < 70 ? "Watch" : "Optimal",
      purpose: "Evaluates hygiene compliance scores, risk flags, and verifies uploaded compliance evidence.",
      keyMetric: `${overview.auditCompliancePct || 85}% Compliance`,
      stateLabel: "Hygiene Audited"
    },
    {
      id: "6",
      name: "Franchise Intelligence Engine",
      icon: Brain,
      path: "/business-intelligence",
      status: "Optimal",
      purpose: "Synthesizes cross-module telemetry and powers the dynamic AI Decision Assistant.",
      keyMetric: "Cross-Module AI",
      stateLabel: "Telemetry Active"
    },
    {
      id: "7",
      name: "Notification & Workflow Management",
      icon: Bell,
      path: "/notifications",
      status: edcKpis.activeAlertsCount > 5 ? "Watch" : "Active",
      purpose: "Automates SLA escalation rules, operational alerts, and corrective Action Plan checklists.",
      keyMetric: `${edcKpis.activeAlertsCount || 4} Active Alerts`,
      stateLabel: `${edcKpis.openActionPlansCount || 2} Open Action Plans`
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 font-extrabold text-3xs uppercase tracking-wider">
              COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400 font-medium">• Enterprise Operations Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Franchise Operations Command Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time intelligence across outlets, inventory, workforce, marketing and compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Region Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Regions</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="West">West Region</option>
              <option value="East">East Region</option>
            </select>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
          <button onClick={fetchData} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">
            Retry
          </button>
        </div>
      )}

      {/* EXECUTIVE KPI AREA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExecutiveKpiCard
          title="Total Revenue"
          value={`₹${(Number(edcKpis.totalRevenue || overview.totalRevenue || 0) / 100000).toFixed(2)}L`}
          trend="+14.8%"
          trendDirection="up"
          comparison="vs last month"
          icon={DollarSign}
          chartData={sparkRevenue}
          color="blue"
          badgeText="PostgreSQL Sales"
        />

        <ExecutiveKpiCard
          title="Total Orders"
          value={Number(edcKpis.totalTransactions || overview.totalOrders || 0).toLocaleString()}
          trend="+11.2%"
          trendDirection="up"
          comparison="verified bills"
          icon={ShoppingBag}
          chartData={sparkOrders}
          color="indigo"
          badgeText="Retail Telemetry"
        />

        <ExecutiveKpiCard
          title="Average Outlet Health"
          value={`${overview.averageHealth || 88}/100`}
          trend="+2.4pts"
          trendDirection="up"
          comparison="network average"
          icon={Store}
          chartData={sparkHealth}
          color="emerald"
          badgeText="Health Score"
        />

        <ExecutiveKpiCard
          title="Active Alerts"
          value={edcKpis.activeAlertsCount || overview.activeAlerts || 4}
          trend="-3 items"
          trendDirection="up"
          comparison="system flags"
          icon={Bell}
          chartData={sparkAlerts}
          color="amber"
          badgeText="Operational Flags"
        />
      </div>

      {/* ROW 2: REVENUE INTELLIGENCE (65%) & AI DECISION BRIEF (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 65%: Revenue Intelligence */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Revenue Intelligence & Sales Velocity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Time-series sales transaction telemetry from PostgreSQL retail sales
              </p>
            </div>
            <button
              onClick={() => navigate("/executive-decision-center")}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"
            >
              Full Decision Center <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={8} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff"
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT 35%: AI Decision Brief */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-500" />
                AI Decision Brief
              </h2>
              <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                Live Insights
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Autonomous telemetry findings derived from PostgreSQL database logs.
            </p>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {aiRecommendations.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No active decision briefs.</p>
              ) : (
                aiRecommendations.slice(0, 3).map((rec, idx) => (
                  <AiDecisionCard key={rec.id || idx} recommendation={rec} />
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/executive-decision-center")}
            className="w-full py-2.5 mt-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            View All Decision Center Telemetry →
          </button>
        </div>
      </div>

      {/* LOCATION INTELLIGENCE SECTION */}
      <OutletLocationMap
        outlets={outletsList}
        salesByCity={salesByCity}
        onSelectOutlet={(outlet) => setSelectedOutletDrillDown(outlet)}
        onRefresh={fetchData}
      />

      {/* ROW 3: OUTLET PERFORMANCE INTELLIGENCE */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Outlet Performance Intelligence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Revenue vs Health scatter matrix, risk distribution, and store rankings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scatter Chart */}
          <div className="lg:col-span-7 h-72 w-full bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis type="number" dataKey="revenue" name="Revenue" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <YAxis type="number" dataKey="health" name="Health Score" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <ZAxis type="number" range={[100, 300]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg">
                          <p className="font-bold text-blue-400">{d.outlet_name}</p>
                          <p>City: {d.city}</p>
                          <p>Revenue: ₹{Number(d.revenue).toLocaleString()}</p>
                          <p>Health: {d.health}/100</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Outlets" data={scatterData} onClick={(entry) => setSelectedOutletDrillDown(entry)}>
                  {scatterData.map((entry, index) => {
                    const fill = entry.health < 50 ? "#ef4444" : entry.health < 70 ? "#f97316" : entry.health < 80 ? "#f59e0b" : "#10b981";
                    return <Cell key={`cell-${index}`} fill={fill} className="cursor-pointer" />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Store Ranking Leaderboard Table */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Performing Stores</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {leaderboard.slice(0, 5).map((store, idx) => (
                <div
                  key={store.id || idx}
                  onClick={() => setSelectedOutletDrillDown(store)}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-blue-500 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center text-3xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{store.name}</p>
                      <p className="text-3xs text-slate-400">{store.city} • {store.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">₹{Number(store.revenue || 0).toLocaleString()}</p>
                    <span className="text-3xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      Health: {store.health}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ROW 4: 7 AI INTELLIGENCE MODULES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Autonomous AI Intelligence Agents
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seven specialized telemetry agents monitoring franchise operations continuously
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agentModules.map((agent) => (
            <AgentModuleCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* OUTLET DRILL-DOWN MODAL */}
      {selectedOutletDrillDown && (
        <OutletDrillDownModal
          outlet={selectedOutletDrillDown}
          onClose={() => setSelectedOutletDrillDown(null)}
        />
      )}
    </div>
  );
}
