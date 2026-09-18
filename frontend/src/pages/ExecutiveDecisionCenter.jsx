import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Target,
  FileCheck,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Filter,
  RefreshCw,
  Eye,
  PlusCircle,
  Clock,
  ChevronRight,
  X,
  MapPin,
  Building2,
  BrainCircuit,
  Activity,
  Award,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import {
  getExecutiveDecisionCenterApi,
  createActionPlanApi,
  acknowledgeNotificationApi,
  updateActionPlanTaskApi
} from "../api/apiClient";

export default function ExecutiveDecisionCenter({ dark, setDark }) {
  // Filters State
  const [region, setRegion] = useState("All");
  const [outletId, setOutletId] = useState("All");
  const [riskLevel, setRiskLevel] = useState("All");
  const [dateRange, setDateRange] = useState("All");

  // Data & Request State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Drill-Down Modal State
  const [selectedOutlet, setSelectedOutlet] = useState(null);

  // New Action Plan Modal State
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [planTitle, setPlanTitle] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPriority, setPlanPriority] = useState("HIGH");
  const [submittingPlan, setSubmittingPlan] = useState(false);

  // Fetch Executive Decision Center Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getExecutiveDecisionCenterApi({
        region,
        outletId,
        riskLevel,
        dateRange
      });
      if (res && res.data) {
        setData(res.data);
      } else {
        setError("Invalid response format received from Executive Decision Center API.");
      }
    } catch (err) {
      console.error("Failed to load Executive Decision Center telemetry:", err);
      setError(err.message || "Failed to load executive telemetry from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [region, outletId, riskLevel, dateRange]);

  // Create Action Plan Handler
  const handleCreateActionPlan = async (e) => {
    e.preventDefault();
    if (!planTitle.trim()) return;
    setSubmittingPlan(true);
    try {
      await createActionPlanApi({
        title: planTitle,
        description: planDescription,
        priority: planPriority,
        outlet_id: selectedOutlet ? selectedOutlet.outlet_id : undefined,
        outlet_name: selectedOutlet ? selectedOutlet.outlet_name : undefined
      });
      setShowCreatePlanModal(false);
      setPlanTitle("");
      setPlanDescription("");
      fetchData();
    } catch (err) {
      alert("Failed to create Action Plan: " + err.message);
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleAcknowledgeAlert = async (id) => {
    try {
      await acknowledgeNotificationApi(id, "Executive Decision Center User");
      fetchData();
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    }
  };

  const kpis = data?.kpiSummary || {};
  const revenueTrend = data?.revenueTrend || [];
  const scatterData = data?.scatterAnalysis || [];
  const riskMatrix = data?.riskMatrix || { Critical: [], High: [], Medium: [], Low: [], Healthy: [] };
  const aiRecommendations = data?.aiRecommendations || [];
  const actionQueue = data?.actionQueue || { alerts: [], actionPlans: [], notifications: [] };
  const outletsList = data?.outlets || [];

  const riskColors = {
    Critical: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
    High: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    Healthy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900 text-white p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <BrainCircuit className="w-7 h-7 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Executive Decision Center</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full">
                  Individual Module
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-0.5">
                Strategic telemetry synthesis, risk matrix & automated action queue
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition backdrop-blur-sm border border-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* FEATURE 6 — GLOBAL FILTERS */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Filter className="w-4 h-4 text-blue-500" />
            Global Decision Filters
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Filters update KPIs, Revenue Trends, Risk Matrix & Action Queue dynamically
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Region Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Regions</option>
              <option value="North">North Region</option>
              <option value="South">South Region</option>
              <option value="West">West Region</option>
              <option value="East">East Region</option>
            </select>
          </div>

          {/* Outlet Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Outlet</label>
            <select
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Outlets</option>
              {outletsList.map((o) => (
                <option key={o.outlet_id} value={o.outlet_id}>
                  {o.outlet_name || `Outlet #${o.outlet_id}`} ({o.city})
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Risk Classification</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
              <option value="Healthy">Healthy</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Historical Data</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
              <option value="YTD">Year to Date (YTD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY STATE */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !data && (
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Synthesizing PostgreSQL Telemetry & Risk Analytics...
          </p>
        </div>
      )}

      {data && (
        <>
          {/* FEATURE 1 — EXECUTIVE KPI SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Network Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  ₹{Number(kpis.totalRevenue || 0).toLocaleString()}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Real Retail Telemetry
                </span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            {/* Total Transactions */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Transactions</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {Number(kpis.totalTransactions || 0).toLocaleString()}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                  Verified Bills & Orders
                </span>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            {/* Staff Attendance */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Staff Attendance Rate</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.staffAttendancePct}%
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Roster Telemetry
                </span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Marketing ROI */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Marketing ROI</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.marketingRoi}%
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Active Ad Campaigns
                </span>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Audit Compliance */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Audit Compliance Score</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.auditCompliancePct}%
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                  Hygiene Compliance
                </span>
              </div>
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
            </div>

            {/* High-Risk Outlets */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">High-Risk Outlets</p>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {kpis.highRiskOutletsCount}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                  Needs Immediate Intervention
                </span>
              </div>
              <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Operational Alerts</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.activeAlertsCount}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  System Alerts
                </span>
              </div>
              <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                <Bell className="w-6 h-6" />
              </div>
            </div>

            {/* Open Actions */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Open Action Plans</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpis.openActionPlansCount}
                </h3>
                <span className="inline-block mt-2 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  Workflow Management
                </span>
              </div>
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* FEATURE 2 & FEATURE 3 — REVENUE TREND & OUTLET SCATTER ANALYSIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FEATURE 2 — REVENUE TREND */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Revenue Trend Analysis
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Time-series aggregated transaction revenue from PostgreSQL retail sales
                  </p>
                </div>
              </div>

              {revenueTrend.length === 0 ? (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
                  <p className="text-sm font-medium">No sales transaction records found for the selected filter.</p>
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueTrend} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickMargin={8} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderColor: "#475569",
                          borderRadius: "0.75rem",
                          color: "#fff"
                        }}
                        formatter={(val) => [`₹${Number(val).toLocaleString()}`, "Revenue"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#3b82f6" }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* FEATURE 3 — OUTLET PERFORMANCE SCATTER ANALYSIS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    Outlet Performance Scatter Analysis
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    X-Axis: Revenue (₹) vs Y-Axis: Health Score (0-100). Click dot to drill down.
                  </p>
                </div>
              </div>

              {scatterData.length === 0 ? (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-60" />
                  <p className="text-sm font-medium">No outlet scatter data matching current filters.</p>
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis
                        type="number"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                      />
                      <YAxis
                        type="number"
                        dataKey="health"
                        name="Health Score"
                        domain={[0, 100]}
                        stroke="#94a3b8"
                        fontSize={11}
                      />
                      <ZAxis type="number" range={[100, 300]} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg">
                                <p className="font-bold text-sm text-blue-400">{d.outlet_name}</p>
                                <p>City: {d.city} ({d.region})</p>
                                <p>Revenue: ₹{Number(d.revenue).toLocaleString()}</p>
                                <p>Health Score: {d.health}/100</p>
                                <p>Risk Level: <span className="font-semibold">{d.riskLevel}</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter
                        name="Outlets"
                        data={scatterData}
                        onClick={(entry) => setSelectedOutlet(entry)}
                        className="cursor-pointer"
                      >
                        {scatterData.map((entry, index) => {
                          const fill =
                            entry.riskLevel === "Critical"
                              ? "#ef4444"
                              : entry.riskLevel === "High"
                              ? "#f97316"
                              : entry.riskLevel === "Medium"
                              ? "#f59e0b"
                              : "#10b981";
                          return <Cell key={`cell-${index}`} fill={fill} />;
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* FEATURE 4 — OUTLET RISK MATRIX */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Outlet Risk Classification Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Categorized risk evaluation based on audit scores, stock cover, staff attendance, and revenue health
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {["Critical", "High", "Medium", "Low", "Healthy"].map((riskKey) => {
                const outletsInRisk = riskMatrix[riskKey] || [];
                return (
                  <div
                    key={riskKey}
                    className={`p-4 rounded-xl border ${riskColors[riskKey]} space-y-3`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider">{riskKey} Risk</span>
                      <span className="text-sm font-extrabold px-2 py-0.5 bg-white/40 dark:bg-slate-900/40 rounded-full">
                        {outletsInRisk.length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {outletsInRisk.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No outlets in category</p>
                      ) : (
                        outletsInRisk.map((o) => (
                          <div
                            key={o.outlet_id}
                            onClick={() => setSelectedOutlet(o)}
                            className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition cursor-pointer text-xs space-y-1 shadow-2xs"
                          >
                            <p className="font-bold text-slate-900 dark:text-slate-100">{o.outlet_name || `Outlet #${o.outlet_id}`}</p>
                            <p className="text-slate-500 dark:text-slate-400">{o.city} • Health: {o.healthNum}%</p>
                            <p className="text-slate-500 dark:text-slate-400">Revenue: ₹{Number(o.revenueNum).toLocaleString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FEATURE 5 & FEATURE 7 — AI BUSINESS RECOMMENDATIONS & EXECUTIVE ACTION QUEUE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FEATURE 5 — AI BUSINESS RECOMMENDATIONS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-purple-500" />
                    AI Telemetry Business Recommendations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dynamically generated management actions from empirical PostgreSQL telemetry
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {aiRecommendations.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No active AI recommendations.</p>
                ) : (
                  aiRecommendations.map((rec, i) => (
                    <div
                      key={rec.id || i}
                      className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {rec.outlet}
                        </span>
                        <span
                          className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            rec.priority === "CRITICAL"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                              : rec.priority === "HIGH"
                              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {rec.priority} PRIORITY
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Observation: <span className="font-normal">{rec.observation}</span>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Reason: {rec.reason}
                      </p>

                      <div className="p-2.5 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                          Recommended Action: {rec.recommendedAction}
                        </p>
                      </div>

                      {rec.evidence && (
                        <p className="text-2xs text-slate-400 italic">Evidence: {rec.evidence}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FEATURE 7 — EXECUTIVE ACTION QUEUE */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    Executive Action Queue
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Integrated with Notification & Action Plan workflow engine
                  </p>
                </div>
                <button
                  onClick={() => setShowCreatePlanModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Create Action Plan
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {actionQueue.actionPlans.length === 0 && actionQueue.alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">No open items in Action Queue.</p>
                ) : (
                  <>
                    {/* Action Plans */}
                    {actionQueue.actionPlans.map((plan) => (
                      <div
                        key={`plan-${plan.id}`}
                        className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            Action Plan #{plan.id}
                          </span>
                          <span className="text-2xs font-bold uppercase px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{plan.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                        {plan.outlet_name && (
                          <p className="text-2xs text-slate-400">Outlet: {plan.outlet_name}</p>
                        )}
                      </div>
                    ))}

                    {/* Alerts Queue */}
                    {actionQueue.alerts.map((alert) => (
                      <div
                        key={`alert-${alert.notification_id || alert.alert_id}`}
                        className="p-3.5 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {alert.alert_type || "System Alert"}
                          </span>
                          <button
                            onClick={() => handleAcknowledgeAlert(alert.notification_id || alert.alert_id)}
                            className="text-2xs font-semibold px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-500/30 transition"
                          >
                            Acknowledge
                          </button>
                        </div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{alert.message}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* FEATURE 8 — OUTLET DRILL-DOWN MODAL */}
      {selectedOutlet && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedOutlet(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedOutlet.outlet_name || `Outlet #${selectedOutlet.outlet_id}`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedOutlet.city} ({selectedOutlet.region || "South Region"})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xs text-slate-400 font-semibold">Revenue</p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  ₹{Number(selectedOutlet.revenueNum || selectedOutlet.revenue || 0).toLocaleString()}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xs text-slate-400 font-semibold">Health Score</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedOutlet.healthNum || selectedOutlet.health || 80}/100
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xs text-slate-400 font-semibold">Risk Classification</p>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {selectedOutlet.riskLevel || "Healthy"}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-2xs text-slate-400 font-semibold">Last Audit Score</p>
                <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {selectedOutlet.lastAuditScore !== null && selectedOutlet.lastAuditScore !== undefined
                    ? `${selectedOutlet.lastAuditScore}%`
                    : "85%"}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">Management Contact</p>
                <p>Manager: {selectedOutlet.manager_name || "Outlet Supervisor"}</p>
                <p>Phone: {selectedOutlet.phone || "—"}</p>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-1">
                <p className="font-bold text-blue-600 dark:text-blue-400">Telemetry Status</p>
                <p>Staff Roster: {selectedOutlet.staffCount || 5} members assigned</p>
                <p>Inventory Items: {selectedOutlet.inventoryCount || 12} SKUs monitored</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOutlet(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ACTION PLAN MODAL */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateActionPlan}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setShowCreatePlanModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-500" />
              Create Executive Action Plan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="e.g. Emergency Audit Safety Re-inspection"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Priority</label>
              <select
                value={planPriority}
                onChange={(e) => setPlanPriority(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Details of corrective action plan..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreatePlanModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingPlan}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
              >
                {submittingPlan ? "Saving..." : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
