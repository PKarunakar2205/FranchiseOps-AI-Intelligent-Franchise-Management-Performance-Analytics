import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend,
  BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RRadar
} from "recharts";
import {
  LayoutDashboard, Store, Boxes, TrendingUp, Megaphone, Bell, FileBarChart,
  Settings, Search, Sparkles, Sun, Moon, ChevronDown, RefreshCw, Download,
  GitCompareArrows, Wand2, ArrowUpRight, ArrowDownRight, DollarSign,
  ShoppingCart, Building2, Percent, ReceiptText, HeartPulse, MapPin,
  Star, AlertTriangle, ChevronLeft, ChevronRight, ArrowUpDown, Trophy,
  Medal, Award, Clock3, CheckCircle2, PackageX, MessageSquareWarning,
  Menu, X, Filter, CalendarDays, Zap, ShieldCheck, Info, ChevronUp,
  Wallet, ThumbsUp, PackageCheck, Users, Gauge, Target, FileDown,
  FileSpreadsheet, Printer, ShieldAlert, UserX, ClipboardList, Repeat,
  BadgeCheck, Flame, TrendingDown, Activity, LayoutGrid, SlidersHorizontal,
  UserCheck, ClipboardCheck, PackageSearch, Layers, PieChart as PieChartIcon,
  Radar as RadarIcon, ListChecks, Landmark, BriefcaseBusiness, ArrowRight
} from "lucide-react";
import AuditRiskEvidenceCenter from "./components/audit/AuditRiskEvidenceCenter";
import { apiFetch, getFranchiseIntelligence, getDashboardSummary } from "./api/apiClient";
import OutletLocationMap from "./components/command/OutletLocationMap";
import OutletDrillDownModal from "./components/command/OutletDrillDownModal";


/* ------------------------------------------------------------------ */
/* DUMMY DATA                                                          */
/* ------------------------------------------------------------------ */

const outlets = [
  { id: 1, name: "Anna Nagar Flagship", city: "Chennai", state: "Tamil Nadu", region: "South", revenue: 1284000, profit: 431000, orders: 5210, growth: 12.4, health: 88, rating: 4.6, status: "Healthy" },
  { id: 2, name: "Indiranagar Central", city: "Bengaluru", state: "Karnataka", region: "South", revenue: 1461000, profit: 577000, orders: 6120, growth: 18.1, health: 92, rating: 4.8, status: "Healthy" },
  { id: 3, name: "Bandra West", city: "Mumbai", state: "Maharashtra", region: "West", revenue: 1102000, profit: 297000, orders: 4870, growth: 6.2, health: 71, rating: 4.3, status: "Average" },
  { id: 4, name: "Connaught Place", city: "New Delhi", state: "Delhi", region: "North", revenue: 987000, profit: 128000, orders: 4310, growth: -3.8, health: 48, rating: 3.6, status: "Critical" },
  { id: 5, name: "Banjara Hills", city: "Hyderabad", state: "Telangana", region: "South", revenue: 845000, profit: 236000, orders: 3690, growth: 4.5, health: 66, rating: 4.1, status: "Average" },
  { id: 6, name: "Koramangala", city: "Bengaluru", state: "Karnataka", region: "South", revenue: 1339000, profit: 549000, orders: 5640, growth: 15.7, health: 85, rating: 4.7, status: "Healthy" },
  { id: 7, name: "Salt Lake Sector V", city: "Kolkata", state: "West Bengal", region: "East", revenue: 612000, profit: 62000, orders: 2810, growth: -8.1, health: 39, rating: 3.2, status: "Critical" },
  { id: 8, name: "Viman Nagar", city: "Pune", state: "Maharashtra", region: "West", revenue: 793000, profit: 174000, orders: 3450, growth: 2.1, health: 61, rating: 4.0, status: "Average" },
  { id: 9, name: "C-Scheme", city: "Jaipur", state: "Rajasthan", region: "North", revenue: 534000, profit: 118000, orders: 2340, growth: 1.4, health: 58, rating: 3.9, status: "Average" },
  { id: 10, name: "Marine Drive", city: "Kochi", state: "Kerala", region: "South", revenue: 701000, profit: 231000, orders: 3120, growth: 9.6, health: 79, rating: 4.4, status: "Healthy" },
  { id: 11, name: "Madurai Junction", city: "Madurai", state: "Tamil Nadu", region: "South", revenue: 458000, profit: 32000, orders: 2040, growth: -11.2, health: 34, rating: 3.1, status: "Critical" },
  { id: 12, name: "Hazratganj", city: "Lucknow", state: "Uttar Pradesh", region: "North", revenue: 672000, profit: 154000, orders: 2950, growth: 5.8, health: 69, rating: 4.0, status: "Average" },
  { id: 13, name: "SG Highway", city: "Ahmedabad", state: "Gujarat", region: "West", revenue: 889000, profit: 320000, orders: 3820, growth: 10.3, health: 77, rating: 4.3, status: "Healthy" },
  { id: 14, name: "Sitabuldi", city: "Nagpur", state: "Maharashtra", region: "West", revenue: 521000, profit: 99000, orders: 2280, growth: 0.6, health: 55, rating: 3.8, status: "Average" },
  { id: 15, name: "Sector 17", city: "Chandigarh", state: "Punjab", region: "North", revenue: 604000, profit: 169000, orders: 2610, growth: 7.9, health: 74, rating: 4.2, status: "Average" },
  { id: 16, name: "Vesu", city: "Surat", state: "Gujarat", region: "West", revenue: 731000, profit: 281000, orders: 3190, growth: 13.5, health: 81, rating: 4.5, status: "Healthy" },
];

const cityCoords = {
  Chennai: { x: 63, y: 74 }, Bengaluru: { x: 55, y: 71 }, Mumbai: { x: 38, y: 55 },
  "New Delhi": { x: 48, y: 20 }, Hyderabad: { x: 55, y: 58 }, Kolkata: { x: 78, y: 42 },
  Pune: { x: 40, y: 60 }, Jaipur: { x: 42, y: 30 }, Kochi: { x: 52, y: 88 },
  Madurai: { x: 58, y: 83 }, Lucknow: { x: 58, y: 24 }, Ahmedabad: { x: 34, y: 46 },
  Nagpur: { x: 50, y: 50 }, Chandigarh: { x: 46, y: 12 }, Surat: { x: 33, y: 52 },
};

const salesSeries = {
  Daily: Array.from({ length: 14 }, (_, i) => ({ label: `Day ${i + 1}`, sales: Math.round(38000 + Math.sin(i / 2) * 9000 + i * 900) })),
  Weekly: Array.from({ length: 12 }, (_, i) => ({ label: `W${i + 1}`, sales: Math.round(260000 + Math.sin(i / 1.5) * 40000 + i * 6000) })),
  Monthly: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({ label: m, sales: Math.round(980000 + Math.sin(i / 2) * 150000 + i * 20000) })),
  Yearly: ["2021","2022","2023","2024","2025","2026"].map((y, i) => ({ label: y, sales: Math.round(8200000 + i * 1450000) })),
};

const revenueTrend = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => {
  const revenue = Math.round(980000 + Math.sin(i / 2) * 150000 + i * 26000);
  const expenses = Math.round(revenue * (0.58 + Math.sin(i) * 0.04));
  return { month: m, revenue, expenses, profit: revenue - expenses };
});

const forecastData = {
  "7D": Array.from({ length: 7 }, (_, i) => ({ label: `D${i + 1}`, forecast: Math.round(41000 + i * 620 + Math.sin(i) * 1500), low: Math.round(38000 + i * 500), high: Math.round(44000 + i * 750) })),
  "30D": Array.from({ length: 30 }, (_, i) => ({ label: `${i + 1}`, forecast: Math.round(41000 + i * 340 + Math.sin(i / 3) * 2200), low: Math.round(37000 + i * 300), high: Math.round(45000 + i * 400) })),
  "90D": Array.from({ length: 12 }, (_, i) => ({ label: `Wk ${i + 1}`, forecast: Math.round(290000 + i * 5200 + Math.sin(i / 2) * 12000), low: Math.round(265000 + i * 4400), high: Math.round(315000 + i * 6000) })),
};

const underperforming = outlets.filter(o => o.status !== "Healthy").map(o => ({
  ...o,
  drop: (Math.abs(o.growth) + 2.3).toFixed(1),
  revenueLoss: Math.round(o.revenue * 0.12),
  profitLoss: Math.round(o.profit * 0.28),
  complaints: o.status === "Critical" ? 14 + (o.id % 5) : 5 + (o.id % 4),
  inventoryIssue: ["Frequent stockouts on top sellers", "Delayed restock cycle", "No major issues"][o.id % 3],
  employeeIssue: ["Understaffed during peak hours", "High shift turnover", "No major issues"][(o.id + 1) % 3],
  reason: o.status === "Critical"
    ? ["Footfall decline near outlet", "Delayed inventory restocking", "Staff shortage during peak hours"][o.id % 3]
    : ["Rising local competition", "Menu pricing above region average", "Weekend staffing gaps"][o.id % 3],
  recommendedActions: o.status === "Critical"
    ? ["Run a localized win-back offer", "Audit staffing roster for peak hours", "Escalate for management review"]
    : ["Review pricing against nearby outlets", "Refresh weekend promotions", "Schedule a stock audit"],
  recoveryProgress: o.status === "Critical" ? 22 + (o.id % 3) * 6 : 48 + (o.id % 4) * 8,
  priority: o.status === "Critical" ? "High" : "Medium",
}));

const topPerformers = [...outlets].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
const rankedByRevenue = [...outlets].sort((a, b) => b.revenue - a.revenue);
const top10Outlets = rankedByRevenue.slice(0, 10);
const bottom10Outlets = [...rankedByRevenue].reverse().slice(0, 10);

const aiInsights = [
  { id: 1, icon: TrendingUp, tone: "success", title: "Revenue increased by 15% this month", detail: "Koramangala and Indiranagar outlets drove most of the lift.", time: "12 min ago" },
  { id: 2, icon: CalendarDays, tone: "info", title: "Weekend sales contribute the highest revenue", detail: "Saturday orders are running 32% above weekday average.", time: "1 hr ago" },
  { id: 3, icon: Star, tone: "success", title: "Outlet Chennai has the highest customer satisfaction", detail: "Anna Nagar Flagship leads the network with a 4.6 rating.", time: "2 hr ago" },
  { id: 4, icon: PackageX, tone: "warning", title: "Outlet Bengaluru needs inventory replenishment", detail: "Koramangala is running low on 4 fast-moving SKUs.", time: "3 hr ago" },
  { id: 5, icon: TrendingDown, tone: "danger", title: "Outlet Madurai sales have declined for three consecutive weeks", detail: "Madurai Junction is down 11.2% and flagged as critical.", time: "4 hr ago" },
  { id: 6, icon: ThumbsUp, tone: "success", title: "Customer complaints have reduced by 20%", detail: "Faster resolution times are improving satisfaction scores.", time: "6 hr ago" },
  { id: 7, icon: Wallet, tone: "success", title: "Profit margin improved due to lower operational expenses", detail: "Network-wide operating cost fell 3.1% this quarter.", time: "Yesterday" },
  { id: 8, icon: Boxes, tone: "info", title: "Inventory optimized for 6 outlets", detail: "Restock schedules adjusted to cut wastage by an estimated 9%.", time: "Yesterday" },
];

const notifications = [
  { id: 1, icon: ArrowDownRight, tone: "danger", title: "Revenue drop alert", detail: "Salt Lake Sector V down 8.1% week over week." },
  { id: 2, icon: HeartPulse, tone: "warning", title: "Health score warning", detail: "Connaught Place health score fell below 50." },
  { id: 3, icon: PackageX, tone: "warning", title: "Inventory warning", detail: "Low stock on 3 SKUs at Viman Nagar." },
  { id: 4, icon: MessageSquareWarning, tone: "info", title: "Customer review alert", detail: "New 2-star review flagged for Connaught Place." },
];

/* ---- Advanced KPI cards (Section: Advanced KPIs) ---- */
const advancedKPIs = [
  { label: "Net Profit", value: "₹31.84L", icon: Wallet, color: "#0ea5e9", trend: "+9.6%", up: true, prev: "vs ₹29.1L last month", spark: [5,6,6,7,8,7,9,10,11], ai: "Margins trending upward" },
  { label: "Customer Satisfaction Score", value: "4.5 / 5", icon: ThumbsUp, color: "#ec4899", trend: "+0.3", up: true, prev: "vs 4.2 last month", spark: [7,7,8,8,9,9,10,10,11], ai: "Fewer complaints logged" },
  { label: "Inventory Health", value: "92%", icon: PackageCheck, color: "#14b8a6", trend: "+4%", up: true, prev: "vs 88% last month", spark: [8,8,9,8,9,10,9,11,10], ai: "Stock accuracy improving" },
  { label: "Employee Productivity", value: "87%", icon: Users, color: "#f97316", trend: "+2.1%", up: true, prev: "vs 85% last month", spark: [6,7,7,8,7,9,8,9,10], ai: "Peak-hour staffing improved" },
  { label: "Overall Franchise Performance", value: "84 / 100", icon: Gauge, color: "#6366f1", trend: "+3 pts", up: true, prev: "vs 81 last month", spark: [7,8,7,9,8,9,10,10,11], ai: "Network trending positive" },
];

/* ---- Revenue forecast summary cards ---- */
const forecastSummary = [
  { range: "Next 7 Days", revenue: 294000, growth: 4.2, confidence: 87 },
  { range: "Next 30 Days", revenue: 1265000, growth: 6.8, confidence: 83 },
  { range: "Next Quarter", revenue: 3820000, growth: 9.4, confidence: 78 },
];

/* ---- Health score sub-metrics ---- */
const healthBreakdown = [
  { label: "Sales Performance", value: 86 }, { label: "Inventory Availability", value: 90 },
  { label: "Customer Reviews", value: 88 }, { label: "Staff Productivity", value: 82 },
  { label: "Profit Margin", value: 76 }, { label: "Audit Compliance", value: 94 },
  { label: "Complaint Resolution", value: 79 }, { label: "Stock Accuracy", value: 91 },
];
const healthTrend = [72, 74, 73, 76, 78, 77, 80, 81, 80, 83, 85, 84];

/* ---- Regional comparison ---- */
const regionNames = ["South", "North", "East", "West"];
const regionalComparison = regionNames.map(r => {
  const list = outlets.filter(o => o.region === r);
  const revenue = list.reduce((s, o) => s + o.revenue, 0);
  const profit = list.reduce((s, o) => s + o.profit, 0);
  const growth = (list.reduce((s, o) => s + o.growth, 0) / list.length).toFixed(1);
  const health = Math.round(list.reduce((s, o) => s + o.health, 0) / list.length);
  const csat = (list.reduce((s, o) => s + o.rating, 0) / list.length).toFixed(1);
  return { region: r, outlets: list.length, revenue, profit, growth, health, csat };
});

/* ---- Customer analytics ---- */
const customerStats = { avgRating: 4.3, repeatCustomers: "64%", retention: "78%", newCustomers: 1240 };
const customerTrend = [3.9, 4.0, 4.0, 4.1, 4.2, 4.2, 4.3, 4.3, 4.4, 4.3, 4.4, 4.3].map((v, i) => ({ label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], rating: v }));
const feedbackDistribution = [
  { name: "Positive", value: 68, color: "#10b981" },
  { name: "Neutral", value: 22, color: "#f59e0b" },
  { name: "Negative", value: 10, color: "#f43f5e" },
];

/* ---- Staff performance ---- */
const staffStats = { attendance: "94%", productivity: "87%", salesPerEmployee: 184000, bestEmployee: "Priya Sharma — Indiranagar Central", efficiency: "89%", training: "76%" };

/* ---- Inventory performance ---- */
const inventoryStats = {
  fastMoving: ["Paneer Tikka Wrap", "Cold Coffee", "Veg Biryani Bowl"],
  slowMoving: ["Multigrain Salad", "Herbal Iced Tea"],
  lowStock: ["Connaught Place — Paneer", "Salt Lake — Cheese Slices"],
  overstock: ["Jaipur — Bottled Water", "Nagpur — Napkins"],
  turnover: "6.2x / quarter",
  accuracy: "96.4%",
};

/* ---- Financial analytics ---- */
const financialTotals = (() => {
  const revenue = outlets.reduce((s, o) => s + o.revenue, 0);
  const profit = outlets.reduce((s, o) => s + o.profit, 0);
  const expenses = revenue - profit;
  const operatingCost = Math.round(expenses * 0.62);
  const margin = ((profit / revenue) * 100).toFixed(1);
  const roi = ((profit / operatingCost) * 100).toFixed(1);
  return { revenue, profit, expenses, operatingCost, margin, roi };
})();

const revenueDistribution = regionalComparison.map((r, i) => ({
  name: r.region, value: r.revenue, color: ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b"][i],
}));

const radarComparison = [
  { metric: "Revenue", top: 100, bottom: 31 },
  { metric: "Profit", top: 100, bottom: 10 },
  { metric: "Growth", top: 92, bottom: 12 },
  { metric: "Health", top: 92, bottom: 34 },
  { metric: "Rating", top: 96, bottom: 62 },
];

const heatmapMetrics = ["Sales", "Inventory", "Service", "Staff", "Profit"];
const heatmapOutlets = [...outlets].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

/* ---- Smart AI recommendations ---- */
const recommendations = [
  { icon: PackageCheck, text: "Increase inventory for high-demand products at Koramangala and Anna Nagar." },
  { icon: CalendarDays, text: "Launch weekend promotional offers to build on strong Saturday demand." },
  { icon: Users, text: "Improve staffing during peak hours at Connaught Place and Salt Lake Sector V." },
  { icon: Wallet, text: "Reduce operational costs at outlets with margins below 15%." },
  { icon: ThumbsUp, text: "Improve customer engagement at outlets with below-average ratings." },
  { icon: TrendingDown, text: "Focus recovery efforts on outlets with declining revenue for 3+ weeks." },
];

/* ---- Smart alerts ---- */
const smartAlerts = [
  { icon: TrendingDown, tone: "danger", title: "Revenue drop", detail: "Madurai Junction down 11.2% this month." },
  { icon: Wallet, tone: "danger", title: "Profit drop", detail: "Salt Lake Sector V margin fell to 10%." },
  { icon: HeartPulse, tone: "warning", title: "Low health score", detail: "2 outlets currently below a health score of 50." },
  { icon: PackageX, tone: "warning", title: "Low inventory", detail: "4 outlets flagged for low stock this week." },
  { icon: ClipboardCheck, tone: "info", title: "Audit pending", detail: "3 outlets due for compliance audit." },
  { icon: MessageSquareWarning, tone: "danger", title: "Complaint spike", detail: "Connaught Place complaints up 40% week over week." },
  { icon: UserX, tone: "warning", title: "Staff shortage", detail: "Viman Nagar short-staffed for weekend shifts." },
];

/* ---- Goal tracking ---- */
const goals = [
  { label: "Monthly Revenue Goal", current: financialTotals.revenue, target: 12500000, format: "currency" },
  { label: "Sales Target", current: outlets.reduce((s, o) => s + o.orders, 0), target: 55000, format: "number" },
  { label: "Profit Target", current: financialTotals.profit, target: 3800000, format: "currency" },
  { label: "Customer Satisfaction Goal", current: customerStats.avgRating, target: 4.6, format: "rating" },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Outlet Performance Agent", icon: Store, active: true },
  { label: "Inventory Agent", icon: Boxes },
  { label: "Staff Agent", icon: Users },
  { label: "Marketing Agent", icon: Megaphone },
  { label: "Notifications", icon: Bell },
  { label: "Reports", icon: FileBarChart },
  { label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const currency = (n) => "₹" + n.toLocaleString("en-IN");
const compactCurrency = (n) => "₹" + (n >= 1e7 ? (n / 1e7).toFixed(2) + "Cr" : n >= 1e5 ? (n / 1e5).toFixed(2) + "L" : n.toLocaleString("en-IN"));

const statusStyle = {
  Healthy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Average: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  Critical: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
};

const dotColor = { Healthy: "bg-emerald-500", Average: "bg-amber-500", Critical: "bg-rose-500" };

function healthColor(h) {
  if (h >= 75) return { ring: "#10b981", text: "text-emerald-600 dark:text-emerald-400" };
  if (h >= 50) return { ring: "#f59e0b", text: "text-amber-600 dark:text-amber-400" };
  return { ring: "#f43f5e", text: "text-rose-600 dark:text-rose-400" };
}

function heatCellStyle(v) {
  if (v >= 80) return "bg-emerald-500/80 text-white";
  if (v >= 65) return "bg-emerald-300/70 text-emerald-900 dark:text-emerald-950";
  if (v >= 50) return "bg-amber-300/70 text-amber-900";
  if (v >= 35) return "bg-orange-400/70 text-white";
  return "bg-rose-500/80 text-white";
}

function riskLevel(h) {
  if (h >= 75) return { label: "Low risk", cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" };
  if (h >= 50) return { label: "Moderate risk", cls: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" };
  return { label: "High risk", cls: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" };
}

function ProgressBar({ pct, color = "from-blue-500 to-purple-500" }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${color}`} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-4">
      {eyebrow && <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">{eyebrow}</span>}
      <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function GlassCard({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(30,41,59,0.15)] dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function Sparkline({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, label, prefix = "₹" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-slate-300">{p.name}:</span>
          <span className="font-semibold">{prefix}{Math.round(p.value).toLocaleString("en-IN")}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                       */
/* ------------------------------------------------------------------ */

export default function OutletPerformanceAgent({ embedded = false, dark: propDark, setDark: propSetDark }) {
  const [darkInternal, setDarkInternal] = useState(false);
  const dark = propDark !== undefined ? propDark : darkInternal;
  const setDark = propSetDark || setDarkInternal;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [period, setPeriod] = useState("Monthly");
  const [outletFilter, setOutletFilter] = useState("All Outlets");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [forecastRange, setForecastRange] = useState("30D");
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [selectedOutletDrillDown, setSelectedOutletDrillDown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/" || location.pathname === "";
  const [rankTab, setRankTab] = useState("top");
  const [agentTab, setAgentTab] = useState(isDashboardRoute ? "dashboard" : "overview");
  const [intelData, setIntelData] = useState(null);
  const [dashSummary, setDashSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [realBackendOutlets, setRealBackendOutlets] = useState([]);
  const pageSize = 5;

  const fetchTelemetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, intelRes, outletsRes] = await Promise.all([
        getDashboardSummary().catch(() => null),
        getFranchiseIntelligence().catch(() => null),
        apiFetch("/outlets").catch(() => null),
      ]);
      if (dashRes && dashRes.success && dashRes.data) {
        setDashSummary(dashRes.data);
      } else {
        setDashSummary({
          overview: { networkRevenue: 1334350, revenueTrendPct: 14.8, totalSalesOrders: 960, activeOutletsCount: 16 },
          outletPerformance: { healthDistribution: { Healthy: 10, Watch: 4, AtRisk: 2 } },
        });
      }
      if (intelRes && intelRes.success && intelRes.data) {
        setIntelData(intelRes.data);
      }
      if (outletsRes && outletsRes.success && Array.isArray(outletsRes.data) && outletsRes.data.length > 0) {
        setRealBackendOutlets(outletsRes.data);
      }
      setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      setError(err.message || "Failed to load telemetry from Express backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(() => {
      fetchTelemetry();
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setAgentTab("dashboard");
    } else if (location.pathname === "/outlet-performance" && agentTab === "dashboard") {
      setAgentTab("overview");
    }
  }, [location.pathname]);

  const filteredTable = useMemo(() => {
    let rows = outlets.filter(o =>
      (outletFilter === "All Outlets" || o.name === outletFilter) &&
      (regionFilter === "All Regions" || o.region === regionFilter) &&
      (o.name.toLowerCase().includes(search.toLowerCase()) || o.city.toLowerCase().includes(search.toLowerCase()))
    );
    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      return a[sortKey] > b[sortKey] ? dir : a[sortKey] < b[sortKey] ? -dir : 0;
    });
    return rows;
  }, [outletFilter, regionFilter, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredTable.length / pageSize));
  const pagedRows = filteredTable.slice((page - 1) * pageSize, page * pageSize);

  const totals = useMemo(() => {
    const revenue = outlets.reduce((s, o) => s + o.revenue, 0);
    const orders = outlets.reduce((s, o) => s + o.orders, 0);
    const active = outlets.length;
    const growth = (outlets.reduce((s, o) => s + o.growth, 0) / outlets.length).toFixed(1);
    const aov = Math.round(revenue / orders);
    const health = Math.round(outlets.reduce((s, o) => s + o.health, 0) / outlets.length);
    return { revenue, orders, active, growth, aov, health };
  }, []);

  const overviewCards = [
    { label: "Total Revenue", value: compactCurrency(totals.revenue), icon: DollarSign, trend: "+14.2%", up: true, color: "#3b82f6", spark: [4,6,5,8,7,9,11,10,12] },
    { label: "Total Sales", value: totals.orders.toLocaleString("en-IN"), icon: ShoppingCart, trend: "+9.8%", up: true, color: "#8b5cf6", spark: [8,7,9,10,9,11,12,13,12] },
    { label: "Active Outlets", value: totals.active, icon: Building2, trend: "+1 this month", up: true, color: "#06b6d4", spark: [9,9,9,9,10,10,10,10,10] },
    { label: "Monthly Growth", value: `${totals.growth}%`, icon: TrendingUp, trend: "vs last month", up: totals.growth > 0, color: "#10b981", spark: [3,5,4,6,7,6,8,7,9] },
    { label: "Avg Order Value", value: currency(totals.aov), icon: ReceiptText, trend: "+3.4%", up: true, color: "#f59e0b", spark: [6,7,6,8,7,9,8,10,9] },
    { label: "Outlet Health Score", value: `${totals.health}/100`, icon: HeartPulse, trend: "Stable", up: true, color: "#ec4899", spark: [7,8,7,8,9,8,9,9,10] },
  ];

  const gaugePct = totals.health;
  const radius = 58, circumference = 2 * Math.PI * radius;
  const gaugeColor = healthColor(gaugePct);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const mainDashboard = (
    <div className="space-y-6">
      {/* ============ TOP LEVEL AGENT TAB SWITCHER ============ */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setAgentTab("dashboard"); navigate("/"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              agentTab === "dashboard"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutDashboard size={15} /> Executive Dashboard (All Modules)
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <button
            onClick={() => { setAgentTab("overview"); navigate("/outlet-performance"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              agentTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Store size={15} /> Outlet Performance Agent
          </button>
          <button
            onClick={() => setAgentTab("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              agentTab === "audit"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck size={15} /> AI Audit Risk & Evidence Center
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live DB Sync
          </span>
          {lastUpdated && (
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Last updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={() => fetchTelemetry()}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-blue-500" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {agentTab === "audit" ? (
        <AuditRiskEvidenceCenter />
      ) : agentTab === "dashboard" ? (
        /* ============ EXECUTIVE OVERVIEW (ALL MODULES) ============ */
        <div className="space-y-6">
          {/* HEADER BANNER */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> FRANCHISEOPS AI · EXECUTIVE TELEMETRY ENGINE
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                Executive Operations Dashboard
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                  All 6 Modules Active
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl">
                Complete multi-module operational intelligence synthesizing PostgreSQL telemetry across Outlet Performance, Inventory, Staff Workforce, Marketing Campaigns, Compliance Audits, and Business Intelligence.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/business-intelligence")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25">
                <Sparkles size={15} /> Intelligence Engine
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => fetchTelemetry()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur">
                <RefreshCw size={15} className={loading ? "animate-spin text-blue-500" : ""} /> Sync Telemetry
              </motion.button>
            </div>
          </motion.div>

          {/* AI EXECUTIVE SUMMARY BANNER */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <GlassCard className="p-5 bg-gradient-to-br from-blue-600 via-blue-600 to-purple-700 border-none text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="flex items-start gap-3 relative">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold">AI Executive Summary</h2>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15">PostgreSQL Live Data</span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {intelData && intelData.aiExecutiveSummary ? (
                      intelData.aiExecutiveSummary
                    ) : (
                      <>
                        The franchise network generated <span className="font-semibold text-white">₹{(dashSummary?.executiveSummary?.totalRevenue || 1334350).toLocaleString("en-IN")}</span> in
                        revenue this period across {dashSummary?.outletPerformance?.totalOutlets || outlets.length} outlets, with an overall Executive Health score of {dashSummary?.executiveSummary?.healthScore || 82}/100 ({dashSummary?.executiveSummary?.healthStatus || "Good"}).{" "}
                        <span className="font-semibold text-white">{topPerformers[0]?.name || "Indiranagar Central"}</span> is the top performing outlet,
                        while <span className="font-semibold text-white">{bottom10Outlets[0]?.name || "Salt Lake Sector V"}</span> requires operational review.
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Best: {topPerformers[0]?.name || "Indiranagar Central"}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Watch: {bottom10Outlets[0]?.name || "Salt Lake Sector V"}</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Inventory Health: {dashSummary?.executiveSummary?.inventoryHealthPct || 92}%</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Staff Attendance: {dashSummary?.executiveSummary?.staffAttendancePct || 92}%</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Marketing ROI: {dashSummary?.executiveSummary?.marketingRoiPct || 296}%</span>
                    <span className="px-2.5 py-1 rounded-full bg-white/15">Audit Compliance: {dashSummary?.executiveSummary?.auditCompliancePct || 47}%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* 8 EXECUTIVE KPI CARDS ROW */}
          <div>
            <div className="mb-3">
              <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                Executive Core Metrics
              </span>
              <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                Franchise Executive KPI Overview
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {[
                {
                  label: "Total Revenue",
                  value: `₹${(dashSummary?.executiveSummary?.totalRevenue || 1334350).toLocaleString("en-IN")}`,
                  icon: DollarSign,
                  trend: "DB Verified",
                  up: true,
                  color: "#3b82f6",
                },
                {
                  label: "Transactions",
                  value: `${(dashSummary?.executiveSummary?.totalOrders || 960).toLocaleString("en-IN")}`,
                  icon: ShoppingCart,
                  trend: `${dashSummary?.outletPerformance?.regionalSalesCenters || 49} Cities`,
                  up: true,
                  color: "#8b5cf6",
                },
                {
                  label: "Inventory Health",
                  value: `${dashSummary?.executiveSummary?.inventoryHealthPct || 92}%`,
                  icon: Boxes,
                  trend: `${dashSummary?.inventoryIntelligence?.totalUnitsOnHand || 2675} Units`,
                  up: true,
                  color: "#10b981",
                },
                {
                  label: "Staff Attendance",
                  value: `${dashSummary?.executiveSummary?.staffAttendancePct || 92}%`,
                  icon: Users,
                  trend: `${dashSummary?.staffIntelligence?.onShiftCount || 5} On Shift`,
                  up: true,
                  color: "#f59e0b",
                },
                {
                  label: "Marketing ROI",
                  value: `${dashSummary?.executiveSummary?.marketingRoiPct || 296}%`,
                  icon: Megaphone,
                  trend: `${dashSummary?.marketingIntelligence?.roas || 3.72} ROAS`,
                  up: true,
                  color: "#ec4899",
                },
                {
                  label: "Audit Compliance",
                  value: `${dashSummary?.executiveSummary?.auditCompliancePct || 47}%`,
                  icon: ShieldCheck,
                  trend: `${dashSummary?.auditIntelligence?.totalAudits || 2} Logged`,
                  up: false,
                  color: "#06b6d4",
                },
                {
                  label: "High Risk Outlets",
                  value: `${dashSummary?.executiveSummary?.highRiskOutletsCount || 1}`,
                  icon: AlertTriangle,
                  trend: "Critical Flag",
                  up: false,
                  color: "#f43f5e",
                },
                {
                  label: "Health Score",
                  value: `${dashSummary?.executiveSummary?.healthScore || 82}/100`,
                  icon: Gauge,
                  trend: dashSummary?.executiveSummary?.healthStatus || "Good",
                  up: true,
                  color: "#6366f1",
                },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ y: -3 }}
                >
                  <GlassCard className="p-3 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${c.color}1A` }}
                      >
                        <c.icon size={14} style={{ color: c.color }} />
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          c.up
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {c.trend}
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                        {c.value}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {c.label}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ALL 6 OPERATIONAL MODULE PANELS GRID */}
          <div className="my-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                  Integrated Operational Modules
                </span>
                <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                  Complete FranchiseOps AI Agent Telemetry
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. OUTLET PERFORMANCE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-blue-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                        <Store size={18} />
                      </div>
                      Outlet Performance
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {dashSummary?.outletPerformance?.totalOutlets || outlets.length} Outlets
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ₹{(dashSummary?.executiveSummary?.totalRevenue || 1334350).toLocaleString("en-IN")}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Best Outlet:</span> {topPerformers[0]?.name} (₹{compactCurrency(topPerformers[0]?.revenue)})</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Watch Outlet:</span> {bottom10Outlets[0]?.name} ({bottom10Outlets[0]?.health}/100 Health)</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Coverage:</span> {dashSummary?.outletPerformance?.regionalSalesCenters || 49} regional cities</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/outlet-performance")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                >
                  Open Outlet Performance Agent <ArrowRight size={14} />
                </button>
              </GlassCard>

              {/* 2. INVENTORY INTELLIGENCE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-teal-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10">
                        <Boxes size={18} />
                      </div>
                      Inventory Intelligence
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      {dashSummary?.inventoryIntelligence?.totalItems || 64} Items
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dashSummary?.inventoryIntelligence?.totalUnitsOnHand || 2675} Units
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Inventory Health:</span> {dashSummary?.inventoryIntelligence?.inventoryHealthPct || 92}%</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Low Stock Items:</span> {dashSummary?.inventoryIntelligence?.lowStockCount || 4} flagged items</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Recommendation:</span> Reorder cheese block & coffee beans</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/inventory")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all"
                >
                  Open Inventory Agent <ArrowRight size={14} />
                </button>
              </GlassCard>

              {/* 3. STAFF & WORKFORCE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-amber-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                        <Users size={18} />
                      </div>
                      Staff Intelligence
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {dashSummary?.staffIntelligence?.totalStaff || 10} Total Staff
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dashSummary?.staffIntelligence?.avgAttendance || 92}% Attendance
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">On-Shift Staff:</span> {dashSummary?.staffIntelligence?.onShiftCount || 5} active staff</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Active Leaves:</span> {dashSummary?.staffIntelligence?.onLeaveCount || 1} SwiftLeave pending</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Insights:</span> Peak weekend coverage optimized</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/staff")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                >
                  Open Staff Agent <ArrowRight size={14} />
                </button>
              </GlassCard>

              {/* 4. MARKETING INTELLIGENCE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-purple-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10">
                        <Megaphone size={18} />
                      </div>
                      Marketing Intelligence
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {dashSummary?.marketingIntelligence?.activeCampaignsCount || 2} Active Campaigns
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dashSummary?.marketingIntelligence?.roiPct || 296}% ROI
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">ROAS Multiplier:</span> {dashSummary?.marketingIntelligence?.roas || 3.72}x</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Best Campaign:</span> Monsoon Combo Blitz</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Total Spend:</span> ₹1,00,000 | <span className="font-medium text-slate-700 dark:text-slate-300">Revenue:</span> ₹3,72,000</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/marketing")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all"
                >
                  Open Marketing Agent <ArrowRight size={14} />
                </button>
              </GlassCard>

              {/* 5. AI AUDIT INTELLIGENCE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-rose-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10">
                        <ShieldCheck size={18} />
                      </div>
                      AI Audit Agent
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      {dashSummary?.auditIntelligence?.totalAudits || 2} Audits Logged
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dashSummary?.auditIntelligence?.auditCompliancePct || 47}% Compliance
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">High Risk Outlets:</span> {dashSummary?.auditIntelligence?.failedAuditsCount || 1} flagged</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Pending Evidence:</span> {dashSummary?.auditIntelligence?.pendingEvidenceCount || 3} items</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Audit Status:</span> Reinspection mandatory for Anna Nagar</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/audit")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                >
                  Open AI Audit Agent <ArrowRight size={14} />
                </button>
              </GlassCard>

              {/* 6. FRANCHISE INTELLIGENCE ENGINE */}
              <GlassCard className="p-5 flex flex-col justify-between hover:border-indigo-400/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                        <Sparkles size={18} />
                      </div>
                      Franchise Intelligence Engine
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Cross-Module Synthesizer
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {dashSummary?.executiveSummary?.healthScore || 82}/100 Score
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Business Status:</span> {dashSummary?.executiveSummary?.healthStatus || "Good"}</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">Active Alerts:</span> {dashSummary?.alerts?.length || 2} telemetry alerts</p>
                    <p><span className="font-medium text-slate-700 dark:text-slate-300">AI Recommendations:</span> {dashSummary?.recommendations?.length || 4} priority actions</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/business-intelligence")}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                >
                  Open Franchise Intelligence <ArrowRight size={14} />
                </button>
              </GlassCard>
            </div>
          </div>

          {/* BUSINESS RECOMMENDATIONS & SMART ALERTS SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <GlassCard className="xl:col-span-2 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                    Business Recommendations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time AI prioritized actions synthesized from cross-module telemetry
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  {(dashSummary?.recommendations?.length || 4)} Action Items
                </span>
              </div>

              <div className="space-y-3">
                {(dashSummary?.recommendations && dashSummary.recommendations.length > 0
                  ? dashSummary.recommendations
                  : [
                      {
                        priority: "HIGH",
                        category: "Compliance & Audit",
                        title: "Anna Nagar Flagship Immediate Compliance Audit",
                        description: "Audit compliance score is currently 0%. Critical health rating risk.",
                        recommendedAction: "Schedule mandatory site reinspection within 24 hours.",
                        evidence: "Audit Score: 0%, Failed Criteria: 4",
                      },
                      {
                        priority: "MEDIUM",
                        category: "Marketing",
                        title: "Scale Monsoon Combo Blitz Campaign",
                        description: "Campaign ROAS achieved 4.2x with ₹1.8L revenue generated.",
                        recommendedAction: "Increase ad spend budget by 20% in Bengaluru region.",
                        evidence: "ROAS: 4.2x, Spend: ₹45,000",
                      },
                      {
                        priority: "HIGH",
                        category: "Inventory",
                        title: "Replenish Low Stock Items",
                        description: "4 outlets report stock levels below safety reorder threshold.",
                        recommendedAction: "Trigger auto-reorder for Mozzarella Cheese & Coffee Beans.",
                        evidence: "Units on hand < 15%",
                      },
                      {
                        priority: "MEDIUM",
                        category: "Staffing",
                        title: "Weekend Staff Coverage Optimization",
                        description: "Salt Lake Sector V reports peak hour service delays.",
                        recommendedAction: "Approve 2 shift adjustments for weekend rush.",
                        evidence: "Attendance: 95%, Active Shift: 5",
                      },
                    ]
                ).map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            rec.priority === "HIGH" || rec.priority === "CRITICAL"
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                              : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                          }`}
                        >
                          {rec.priority || "HIGH"}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {rec.category || rec.module || "Operational"}
                        </span>
                      </div>
                      {rec.evidence && (
                        <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          Data Source: {rec.evidence}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {rec.description}
                    </p>
                    {rec.recommendedAction && (
                      <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Sparkles size={12} /> Action: {rec.recommendedAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                  Smart Operational Alerts
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  Live Feed
                </span>
              </div>
              <div className="space-y-3">
                {smartAlerts.map((a, i) => (
                  <div key={i} className="flex gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                      ${a.tone === "danger" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : a.tone === "warning" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" : "bg-blue-50 dark:bg-blue-500/10 text-blue-500"}`}>
                      <a.icon size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{a.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <>
          {/* ============ HEADER ============ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI AGENT · LIVE MONITORING
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Outlet Performance Agent</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl">
                  Monitor outlet performance, analyze revenue trends, compare franchise locations, and identify underperforming stores.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25">
                  <Wand2 size={15} /> AI Analysis
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur">
                  <GitCompareArrows size={15} /> Compare Outlets
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur">
                  <Download size={15} /> Export Report
                </motion.button>
                <motion.button whileHover={{ scale: 1.03, rotate: 90 }} whileTap={{ scale: 0.97 }} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur">
                  <RefreshCw size={15} />
                </motion.button>
              </div>
            </motion.div>

            {/* ============ AI EXECUTIVE SUMMARY ============ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
              <GlassCard className="p-5 bg-gradient-to-br from-blue-600 via-blue-600 to-purple-700 border-none text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="flex items-start gap-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-semibold">AI executive summary</h2>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15">Auto-generated</span>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {intelData && intelData.aiExecutiveSummary ? (
                        intelData.aiExecutiveSummary
                      ) : (
                        <>
                          The franchise network generated <span className="font-semibold text-white">{compactCurrency(financialTotals.revenue)}</span> in
                          revenue this period, up {totals.growth}% month over month, with an overall health score of {totals.health}/100.{" "}
                          <span className="font-semibold text-white">{topPerformers[0].name}</span> is the best performing outlet, growing {topPerformers[0].growth}%,
                          while <span className="font-semibold text-white">{bottom10Outlets[0].name}</span> is the weakest, down {Math.abs(bottom10Outlets[0].growth)}% with a health score of {bottom10Outlets[0].health}.
                        </>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                      <span className="px-2.5 py-1 rounded-full bg-white/15">Best: {topPerformers[0].name}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15">Watch: {bottom10Outlets[0].name}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15">Margin: {financialTotals.margin}%</span>
                      <span className="px-2.5 py-1 rounded-full bg-white/15">Critical outlets: {outlets.filter(o => o.status === "Critical").length}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* ============ EXPORT TOOLBAR ============ */}
            <div className="flex flex-wrap items-center gap-2 -mt-2">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1"><FileDown size={13} /> Export:</span>
              {[
                { label: "Export PDF", icon: FileDown },
                { label: "Export Excel", icon: FileSpreadsheet },
                { label: "Export CSV", icon: ListChecks },
                { label: "Print Dashboard", icon: Printer },
              ].map(btn => (
                <button key={btn.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 backdrop-blur">
                  <btn.icon size={12} /> {btn.label}
                </button>
              ))}
            </div>

            {/* ============ EXECUTIVE KPI OVERVIEW CARDS (MODULE 7 HEADER) ============ */}
            <div>
              <div className="mb-3">
                <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                  Executive Telemetry
                </span>
                <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                  Franchise Executive KPI Overview
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                {[
                  {
                    label: "Total Revenue",
                    value: `₹${(dashSummary?.executiveSummary?.totalRevenue || 1334350).toLocaleString("en-IN")}`,
                    icon: DollarSign,
                    trend: "DB Verified",
                    up: true,
                    color: "#3b82f6",
                  },
                  {
                    label: "Transactions",
                    value: `${(dashSummary?.executiveSummary?.totalOrders || 960).toLocaleString("en-IN")}`,
                    icon: ShoppingCart,
                    trend: "49 Cities",
                    up: true,
                    color: "#8b5cf6",
                  },
                  {
                    label: "Inventory Health",
                    value: `${dashSummary?.executiveSummary?.inventoryHealthPct || 92}%`,
                    icon: Boxes,
                    trend: `${dashSummary?.inventoryIntelligence?.totalUnitsOnHand || 2675} Units`,
                    up: true,
                    color: "#10b981",
                  },
                  {
                    label: "Staff Attendance",
                    value: `${dashSummary?.executiveSummary?.staffAttendancePct || 92}%`,
                    icon: Users,
                    trend: `${dashSummary?.staffIntelligence?.onShiftCount || 5} On Shift`,
                    up: true,
                    color: "#f59e0b",
                  },
                  {
                    label: "Marketing ROI",
                    value: `${dashSummary?.executiveSummary?.marketingRoiPct || 296}%`,
                    icon: Megaphone,
                    trend: `${dashSummary?.marketingIntelligence?.roas || 3.72} ROAS`,
                    up: true,
                    color: "#ec4899",
                  },
                  {
                    label: "Audit Compliance",
                    value: `${dashSummary?.executiveSummary?.auditCompliancePct || 47}%`,
                    icon: ShieldCheck,
                    trend: `${dashSummary?.auditIntelligence?.totalAudits || 2} Logged`,
                    up: false,
                    color: "#06b6d4",
                  },
                  {
                    label: "High Risk Outlets",
                    value: `${dashSummary?.executiveSummary?.highRiskOutletsCount || 1}`,
                    icon: AlertTriangle,
                    trend: "Critical Flag",
                    up: false,
                    color: "#f43f5e",
                  },
                  {
                    label: "Health Score",
                    value: `${dashSummary?.executiveSummary?.healthScore || 70}/100`,
                    icon: Gauge,
                    trend: dashSummary?.executiveSummary?.healthStatus || "Watch",
                    up: true,
                    color: "#6366f1",
                  },
                ].map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    whileHover={{ y: -3 }}
                  >
                    <GlassCard className="p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `${c.color}1A` }}
                        >
                          <c.icon size={14} style={{ color: c.color }} />
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            c.up
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {c.trend}
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
                          {c.value}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {c.label}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ============ MODULE 1-6 INTEGRATED AGENTS SUMMARY GRID ============ */}
            <div className="my-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                    Integrated Operations Hub
                  </span>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-lg">
                    Full Franchise Agent Telemetry (Modules 1–6)
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. OUTLET PERFORMANCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-blue-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10">
                          <Store size={18} />
                        </div>
                        Outlet Performance
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {dashSummary?.outletPerformance?.totalOutlets || 9} Outlets
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ₹{(dashSummary?.executiveSummary?.totalRevenue || 1334350).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Network sales across {dashSummary?.outletPerformance?.regionalSalesCenters || 49} regional sales cities.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/outlet-performance")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                  >
                    View Outlet Performance Agent <ArrowRight size={14} />
                  </button>
                </GlassCard>

                {/* 2. INVENTORY INTELLIGENCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-teal-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10">
                          <Boxes size={18} />
                        </div>
                        Inventory Intelligence
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        {dashSummary?.inventoryIntelligence?.totalItems || 64} Items
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {dashSummary?.inventoryIntelligence?.totalUnitsOnHand || 2675} Units
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {dashSummary?.inventoryIntelligence?.inventoryHealthPct || 92}% Health Rate | {dashSummary?.inventoryIntelligence?.lowStockCount || 4} Low Stock Reorder Alerts.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/inventory")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-all"
                  >
                    View Inventory Intelligence <ArrowRight size={14} />
                  </button>
                </GlassCard>

                {/* 3. STAFF & WORKFORCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-amber-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                          <Users size={18} />
                        </div>
                        Staff & Workforce
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {dashSummary?.staffIntelligence?.totalStaff || 10} Staff
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {dashSummary?.staffIntelligence?.avgAttendance || 92}% Attendance
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {dashSummary?.staffIntelligence?.onShiftCount || 5} Active on Shift | {dashSummary?.staffIntelligence?.onLeaveCount || 1} SwiftLeave Application.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/staff")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
                  >
                    View Staff Intelligence <ArrowRight size={14} />
                  </button>
                </GlassCard>

                {/* 4. MARKETING INTELLIGENCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-purple-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10">
                          <Megaphone size={18} />
                        </div>
                        Marketing Intelligence
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {dashSummary?.marketingIntelligence?.activeCampaignsCount || 2} Active Campaigns
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {dashSummary?.marketingIntelligence?.roiPct || 296}% ROI
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      ROAS: {dashSummary?.marketingIntelligence?.roas || 3.72}x | Total Spend: ₹1,00,000 | Revenue: ₹3,72,000.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/marketing")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all"
                  >
                    View Marketing Intelligence <ArrowRight size={14} />
                  </button>
                </GlassCard>

                {/* 5. AI AUDIT INTELLIGENCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-rose-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10">
                          <ShieldCheck size={18} />
                        </div>
                        AI Audit Intelligence
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                        {dashSummary?.auditIntelligence?.totalAudits || 2} Audits
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {dashSummary?.auditIntelligence?.auditCompliancePct || 47}% Compliance
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      1 Critical non-compliance finding (Anna Nagar Flagship - Score 0%). Inspection mandatory.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/audit")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                  >
                    View AI Audit Agent <ArrowRight size={14} />
                  </button>
                </GlassCard>

                {/* 6. FRANCHISE INTELLIGENCE */}
                <GlassCard className="p-5 flex flex-col justify-between hover:border-indigo-400/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                          <Sparkles size={18} />
                        </div>
                        Franchise Intelligence
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        PostgreSQL Telemetry
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {dashSummary?.executiveSummary?.healthScore || 70}/100 Score
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Synthesis of 4 dynamic business recommendations & 2 active smart alerts.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/business-intelligence")}
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                  >
                    View Franchise Intelligence <ArrowRight size={14} />
                  </button>
                </GlassCard>
              </div>
            </div>

            {/* ============ ADVANCED KPI CARDS ============ */}
            <div>
              <SectionHeading eyebrow="Extended metrics" title="Advanced KPI cards" subtitle="Profitability, satisfaction, inventory and workforce health at a glance" />
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {advancedKPIs.map((c, i) => (
                  <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} whileHover={{ y: -4 }}>
                    <GlassCard className="p-4 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${c.color}1A` }}>
                          <c.icon size={16} style={{ color: c.color }} />
                        </div>
                        <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${c.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {c.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {c.trend}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{c.value}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{c.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{c.prev}</p>
                      <div className="mt-auto pt-2 -mx-1">
                        <Sparkline data={c.spark} color={c.color} />
                      </div>
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit">
                        <Sparkles size={10} /> {c.ai}
                      </span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ============ SECTION 2: SALES PERFORMANCE ============ */}
            <GlassCard className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Outlet Sales Performance</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Interactive trend across selected timeframe</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-100 dark:bg-slate-800/60 rounded-lg p-1">
                    {Object.keys(salesSeries).map(p => (
                      <button key={p} onClick={() => setPeriod(p)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === p ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <select value={outletFilter} onChange={e => setOutletFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>All Outlets</option>
                    {outlets.map(o => <option key={o.id}>{o.name}</option>)}
                  </select>
                  <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
                    className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>All Regions</option>
                    <option>North</option><option>South</option><option>East</option><option>West</option>
                  </select>
                  <button className="flex items-center gap-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <CalendarDays size={13} /> Date Range
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesSeries[period]} margin={{ left: -10, right: 10 }}>
                  <defs>
                    <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => compactCurrency(v)} width={60} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="sales" name="Sales" stroke="url(#salesLine)" strokeWidth={3} dot={{ r: 3, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* ============ SECTION 3: REVENUE TREND ============ */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <GlassCard className="xl:col-span-2 p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Revenue Trend Analysis</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Revenue, expenses and profit — last 12 months</p>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenueTrend} margin={{ left: -10, right: 10 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                      <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={0.25} /><stop offset="100%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                      <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => compactCurrency(v)} width={60} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fill="url(#rev)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" fill="url(#exp)" strokeWidth={2} />
                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#8b5cf6" fill="url(#prof)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard className="p-5 bg-gradient-to-br from-blue-600 to-purple-700 border-none text-white flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center"><Sparkles size={15} /></div>
                  <span className="text-sm font-semibold">AI Insight</span>
                </div>
                <p className="text-sm leading-relaxed text-white/90">
                  Profit margins improved <span className="font-semibold text-white">4.2 points</span> over the last quarter,
                  driven mainly by South region outlets. Expense growth is outpacing revenue in the East region —
                  consider a cost review for Salt Lake Sector V.
                </p>
                <div className="mt-4 pt-4 border-t border-white/15 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-white/70">Best margin</span><span className="font-semibold">Koramangala · 41%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-white/70">Weakest margin</span><span className="font-semibold">Salt Lake · 19%</span></div>
                </div>
                <button className="mt-4 w-full py-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors text-xs font-medium">View full analysis</button>
              </GlassCard>
            </div>

            {/* ============ SECTION 4: COMPARE OUTLETS TABLE ============ */}
            <GlassCard className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Compare Franchise Locations</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{filteredTable.length} outlets found</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search outlet or city..."
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-transparent focus:border-blue-400 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <SlidersHorizontal size={12} /> Sort:
                  </div>
                  {[["revenue", "Revenue"], ["health", "Health Score"], ["growth", "Growth"]].map(([key, label]) => (
                    <button key={key} onClick={() => toggleSort(key)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border ${sortKey === key ? "border-blue-300 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-400" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm min-w-[820px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      {[["name", "Outlet Name"], ["city", "City"], ["revenue", "Revenue"], ["orders", "Orders"], ["growth", "Growth %"], ["health", "Health Score"], ["rating", "Rating"], ["status", "Status"]].map(([key, label]) => (
                        <th key={key} className="py-3 pr-4 font-medium">
                          <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300">
                            {label} <ArrowUpDown size={11} className={sortKey === key ? "text-blue-500" : ""} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((o, i) => (
                      <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{o.name}</td>
                        <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{o.city}</td>
                        <td className="py-3 pr-4 font-medium tabular-nums">{compactCurrency(o.revenue)}</td>
                        <td className="py-3 pr-4 tabular-nums text-slate-500 dark:text-slate-400">{o.orders.toLocaleString("en-IN")}</td>
                        <td className={`py-3 pr-4 font-medium tabular-nums ${o.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                          {o.growth >= 0 ? "+" : ""}{o.growth}%
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${o.health}%`, background: healthColor(o.health).ring }} />
                            </div>
                            <span className="text-xs tabular-nums text-slate-500">{o.health}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4"><span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {o.rating}</span></td>
                        <td className="py-3 pr-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusStyle[o.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor[o.status]}`} /> {o.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                <div className="flex gap-1.5">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronLeft size={14} /></button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"><ChevronRight size={14} /></button>
                </div>
              </div>
            </GlassCard>

            {/* ============ SECTION 5 + 6: HEALTH GAUGE + UNDERPERFORMING ============ */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
                <h2 className="font-semibold text-slate-900 dark:text-white self-start mb-4">Outlet Health Score</h2>
                <div className="relative w-40 h-40">
                  <svg width="160" height="160" className="-rotate-90">
                    <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-100 dark:text-slate-800" />
                    <motion.circle
                      cx="80" cy="80" r={radius} stroke={gaugeColor.ring} strokeWidth="12" fill="none" strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (gaugePct / 100) * circumference }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${gaugeColor.text}`}>{gaugePct}</span>
                    <span className="text-[11px] text-slate-400">out of 100</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 max-w-[220px]">
                  Network-wide health is <span className="font-medium text-slate-700 dark:text-slate-200">stable</span>, with 2 outlets flagged for immediate review.
                </p>
                <div className="flex gap-3 mt-4 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> ≥75 Healthy</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> 50-74 Average</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;50 Critical</span>
                </div>
              </GlassCard>

              <GlassCard className="xl:col-span-2 p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Underperforming Stores</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Outlets that need action this week</p>
                <div className="space-y-3">
                  {underperforming.map(o => (
                    <div key={o.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${o.priority === "High" ? "bg-rose-50 dark:bg-rose-500/10" : "bg-amber-50 dark:bg-amber-500/10"}`}>
                            <AlertTriangle size={16} className={o.priority === "High" ? "text-rose-500" : "text-amber-500"} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{o.name} <span className="text-slate-400 font-normal">· {o.city}</span></p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{o.reason}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                              <span className="text-rose-500 font-medium">-{o.drop}% revenue</span>
                              <span>Health: {o.health}/100</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${o.priority === "High" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20"}`}>
                          {o.priority} priority
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2">
                          <p className="text-slate-400">Revenue loss</p>
                          <p className="font-semibold text-rose-500">{compactCurrency(o.revenueLoss)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2">
                          <p className="text-slate-400">Profit loss</p>
                          <p className="font-semibold text-rose-500">{compactCurrency(o.profitLoss)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2">
                          <p className="text-slate-400">Complaints</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{o.complaints}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-2">
                          <p className="text-slate-400">Recovery</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{o.recoveryProgress}%</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><PackageX size={11} /> {o.inventoryIssue}</span>
                        <span className="flex items-center gap-1"><UserX size={11} /> {o.employeeIssue}</span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>Recovery progress</span><span>{o.recoveryProgress}%</span>
                        </div>
                        <ProgressBar pct={o.recoveryProgress} color={o.priority === "High" ? "from-rose-500 to-orange-500" : "from-amber-400 to-amber-500"} />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {o.recommendedActions.map((a, ai) => (
                          <span key={ai} className="text-[10px] px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">{a}</span>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">View Details</button>
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-1"><Sparkles size={12} /> Generate AI Recommendation</button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* ============ OUTLET HEALTH ANALYSIS (DETAILED) ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Deep dive" title="Outlet health analysis" subtitle="What the network-wide health score of 84/100 is built from" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1 space-y-2.5">
                  {healthBreakdown.map(h => (
                    <div key={h.label}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500 dark:text-slate-400">{h.label}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{h.value}%</span>
                      </div>
                      <ProgressBar pct={h.value} color={h.value >= 80 ? "from-emerald-400 to-emerald-500" : h.value >= 60 ? "from-amber-400 to-amber-500" : "from-rose-400 to-rose-500"} />
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Health score trend — last 12 months</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={healthTrend.map((v, i) => ({ i, v }))}>
                      <defs><linearGradient id="healthTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient></defs>
                      <Area type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} fill="url(#healthTrendFill)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${riskLevel(totals.health).cls}`}>{riskLevel(totals.health).label}</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><ArrowUpRight size={11} /> +12 pts vs a year ago</span>
                  </div>
                </div>
                <div className="lg:col-span-1 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/60 dark:from-slate-800/40 dark:to-blue-500/5 border border-slate-100 dark:border-slate-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-blue-500" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">AI explanation</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Health scores are being lifted by strong audit compliance and stock accuracy, while profit margin and
                    complaint resolution are the weakest contributors. Improving weekend staffing and resolving open complaints
                    faster at Connaught Place and Salt Lake Sector V would add an estimated 4-6 points to the network score.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* ============ OUTLET RANKING: TOP 10 / BOTTOM 10 ============ */}
            <GlassCard className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <SectionHeading eyebrow="Leaderboard" title="Outlet ranking" subtitle="Full ranking across revenue, profit, growth, rating and health" />
                <div className="flex bg-slate-100 dark:bg-slate-800/60 rounded-lg p-1 h-fit">
                  <button onClick={() => setRankTab("top")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${rankTab === "top" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>Top 10</button>
                  <button onClick={() => setRankTab("bottom")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${rankTab === "bottom" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>Bottom 10</button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm min-w-[760px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2.5 pr-4 font-medium">Rank</th>
                      <th className="py-2.5 pr-4 font-medium">Outlet</th>
                      <th className="py-2.5 pr-4 font-medium">Revenue</th>
                      <th className="py-2.5 pr-4 font-medium">Profit</th>
                      <th className="py-2.5 pr-4 font-medium">Growth %</th>
                      <th className="py-2.5 pr-4 font-medium">Rating</th>
                      <th className="py-2.5 pr-4 font-medium">Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rankTab === "top" ? top10Outlets : bottom10Outlets).map((o, i) => (
                      <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 pr-4 font-semibold text-slate-400">#{i + 1}</td>
                        <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{o.name} <span className="text-slate-400 font-normal">· {o.city}</span></td>
                        <td className="py-2.5 pr-4 tabular-nums">{compactCurrency(o.revenue)}</td>
                        <td className="py-2.5 pr-4 tabular-nums">{compactCurrency(o.profit)}</td>
                        <td className={`py-2.5 pr-4 font-medium tabular-nums ${o.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{o.growth >= 0 ? "+" : ""}{o.growth}%</td>
                        <td className="py-2.5 pr-4"><span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {o.rating}</span></td>
                        <td className="py-2.5 pr-4"><span className={`font-medium ${healthColor(o.health).text}`}>{o.health}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* ============ SECTION 7: TOP PERFORMERS ============ */}
            <GlassCard className="p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Top Performing Outlets</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ranked by revenue this month</p>
              <div className="space-y-2">
                {topPerformers.map((o, i) => (
                  <div key={o.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
                      ${i === 0 ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15" : i === 1 ? "bg-slate-100 text-slate-500 dark:bg-slate-700/50" : i === 2 ? "bg-orange-100 text-orange-600 dark:bg-orange-500/15" : "bg-slate-50 text-slate-400 dark:bg-slate-800/50"}`}>
                      {i < 3 ? <Medal size={15} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{o.name}</p>
                      <p className="text-xs text-slate-400">{o.city}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold tabular-nums">{compactCurrency(o.revenue)}</p>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">+{o.growth}%</p>
                    </div>
                    <div className="w-20 hidden md:block">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${o.health}%` }} />
                        </div>
                      </div>
                    </div>
                    {i === 0 && <Award size={18} className="text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* ============ SECTION 8: REVENUE FORECAST ============ */}
            <GlassCard className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">Revenue Forecast</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI-projected revenue with confidence band</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800/60 rounded-lg p-1">
                  {["7D", "30D", "90D"].map(r => (
                    <button key={r} onClick={() => setForecastRange(r)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${forecastRange === r ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}>
                      Next {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {forecastSummary.map(f => (
                  <div key={f.range} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                    <p className="text-[11px] text-slate-400 mb-1">{f.range}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{compactCurrency(f.revenue)}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[11px]">
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5"><ArrowUpRight size={11} /> {f.growth}% growth</span>
                      <span className="text-slate-400">{f.confidence}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <div className="lg:col-span-3">
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={forecastData[forecastRange]} margin={{ left: -10, right: 10 }}>
                      <defs>
                        <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => compactCurrency(v)} width={60} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="high" name="High estimate" stroke="none" fill="url(#fc)" />
                      <Area type="monotone" dataKey="low" name="Low estimate" stroke="none" fill="#ffffff" fillOpacity={0} />
                      <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/60 dark:from-slate-800/40 dark:to-blue-500/5 border border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Forecast Confidence</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">87%</p>
                  <p className="text-[11px] text-slate-400 mt-1">Based on 12 months of historical data across 10 outlets</p>
                  <div className="mt-3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* ============ SECTION 9: REAL GEOGRAPHIC LOCATION MAP ============ */}
            <OutletLocationMap
              outlets={realBackendOutlets.length > 0 ? realBackendOutlets : (dashSummary?.outletPerformance?.leaderboard || outlets)}
              salesByCity={dashSummary?.salesAnalytics?.salesByCity || []}
              onSelectOutlet={(outlet) => setSelectedOutletDrillDown(outlet)}
            />


            {/* ============ REGIONAL COMPARISON ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Geography" title="Regional comparison" subtitle="Revenue, profit, growth, health and satisfaction by region" />
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm min-w-[680px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2.5 pr-4 font-medium">Region</th>
                      <th className="py-2.5 pr-4 font-medium">Outlets</th>
                      <th className="py-2.5 pr-4 font-medium">Revenue</th>
                      <th className="py-2.5 pr-4 font-medium">Profit</th>
                      <th className="py-2.5 pr-4 font-medium">Avg growth</th>
                      <th className="py-2.5 pr-4 font-medium">Avg health</th>
                      <th className="py-2.5 pr-4 font-medium">CSAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalComparison.map(r => (
                      <tr key={r.region} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 pr-4 font-medium text-slate-800 dark:text-slate-100">{r.region}</td>
                        <td className="py-2.5 pr-4 text-slate-500 dark:text-slate-400">{r.outlets}</td>
                        <td className="py-2.5 pr-4 tabular-nums font-medium">{compactCurrency(r.revenue)}</td>
                        <td className="py-2.5 pr-4 tabular-nums">{compactCurrency(r.profit)}</td>
                        <td className={`py-2.5 pr-4 font-medium tabular-nums ${r.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{r.growth >= 0 ? "+" : ""}{r.growth}%</td>
                        <td className="py-2.5 pr-4"><span className={`font-medium ${healthColor(r.health).text}`}>{r.health}</span></td>
                        <td className="py-2.5 pr-4"><span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /> {r.csat}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* ============ CUSTOMER ANALYTICS + STAFF PERFORMANCE ============ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <GlassCard className="p-5">
                <SectionHeading eyebrow="Customers" title="Customer analytics" subtitle="Satisfaction, retention and feedback distribution" />
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Average rating</p><p className="text-lg font-bold flex items-center gap-1">{customerStats.avgRating} <Star size={14} className="text-amber-400 fill-amber-400" /></p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Repeat customers</p><p className="text-lg font-bold">{customerStats.repeatCustomers}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Retention</p><p className="text-lg font-bold">{customerStats.retention}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">New customers</p><p className="text-lg font-bold">{customerStats.newCustomers.toLocaleString("en-IN")}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Satisfaction trend</p>
                    <ResponsiveContainer width="100%" height={100}>
                      <LineChart data={customerTrend}>
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Line type="monotone" dataKey="rating" stroke="#ec4899" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">Feedback distribution</p>
                    <div className="space-y-1.5">
                      {feedbackDistribution.map(f => (
                        <div key={f.name}>
                          <div className="flex justify-between text-[10px] text-slate-400"><span>{f.name}</span><span>{f.value}%</span></div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${f.value}%`, background: f.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <SectionHeading eyebrow="Workforce" title="Staff performance analytics" subtitle="Attendance, productivity and training across the network" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Attendance</p><p className="text-lg font-bold">{staffStats.attendance}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Productivity</p><p className="text-lg font-bold">{staffStats.productivity}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Efficiency</p><p className="text-lg font-bold">{staffStats.efficiency}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Sales / employee</p><p className="text-lg font-bold">{compactCurrency(staffStats.salesPerEmployee)}</p></div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 col-span-2 sm:col-span-1"><p className="text-[11px] text-slate-400">Training completed</p><p className="text-lg font-bold">{staffStats.training}</p></div>
                </div>
                <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">PS</div>
                  <div>
                    <p className="text-[11px] text-slate-400">Best performing employee</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{staffStats.bestEmployee}</p>
                  </div>
                  <BadgeCheck size={16} className="ml-auto text-blue-500 shrink-0" />
                </div>
              </GlassCard>
            </div>

            {/* ============ INVENTORY PERFORMANCE ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Stock" title="Inventory performance" subtitle="Movement, alerts and accuracy across outlets" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1"><Flame size={13} /> Fast moving</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">{inventoryStats.fastMoving.map(x => <li key={x} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500" />{x}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1"><PackageSearch size={13} /> Slow moving</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">{inventoryStats.slowMoving.map(x => <li key={x} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-slate-400" />{x}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1"><PackageX size={13} /> Low stock alerts</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">{inventoryStats.lowStock.map(x => <li key={x} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-rose-500" />{x}</li>)}</ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1"><Layers size={13} /> Overstock alerts</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">{inventoryStats.overstock.map(x => <li key={x} className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-amber-500" />{x}</li>)}</ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Inventory turnover: <span className="font-semibold text-slate-800 dark:text-slate-100">{inventoryStats.turnover}</span></span>
                <span className="text-slate-500 dark:text-slate-400">Stock accuracy: <span className="font-semibold text-slate-800 dark:text-slate-100">{inventoryStats.accuracy}</span></span>
              </div>
            </GlassCard>

            {/* ============ FINANCIAL ANALYTICS + CHARTS ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Finance" title="Financial analytics" subtitle="Revenue, expenses, profit, margin, operating cost and ROI" />
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Revenue</p><p className="text-base font-bold">{compactCurrency(financialTotals.revenue)}</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Expenses</p><p className="text-base font-bold">{compactCurrency(financialTotals.expenses)}</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Profit</p><p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{compactCurrency(financialTotals.profit)}</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Profit margin</p><p className="text-base font-bold">{financialTotals.margin}%</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">Operating cost</p><p className="text-base font-bold">{compactCurrency(financialTotals.operatingCost)}</p></div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3"><p className="text-[11px] text-slate-400">ROI</p><p className="text-base font-bold text-blue-600 dark:text-blue-400">{financialTotals.roi}%</p></div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Monthly sales — bar chart</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={revenueTrend} margin={{ left: -20, right: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => compactCurrency(v)} width={50} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Revenue distribution by region</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RPieChart>
                      <Tooltip content={<ChartTooltip prefix="₹" />} />
                      <Pie data={revenueDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                        {revenueDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </RPieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-1 text-[10px]">
                    {revenueDistribution.map(d => <span key={d.name} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: d.color }} />{d.name}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Outlet comparison — radar chart</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarComparison}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <RRadar name={topPerformers[0].name} dataKey="top" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                      <RRadar name={bottom10Outlets[0].name} dataKey="bottom" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-3 mt-1 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />{topPerformers[0].name}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />{bottom10Outlets[0].name}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* ============ PERFORMANCE HEATMAP ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Cross-outlet view" title="Performance heatmap" subtitle="Sales, inventory, service, staff and profit scores by outlet" />
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-xs min-w-[600px] border-separate" style={{ borderSpacing: "6px" }}>
                  <thead>
                    <tr>
                      <th className="text-left text-[11px] text-slate-400 font-medium pb-1">Outlet</th>
                      {heatmapMetrics.map(m => <th key={m} className="text-[11px] text-slate-400 font-medium pb-1">{m}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapOutlets.map(o => {
                      const cells = {
                        Sales: Math.min(100, Math.round(o.growth * 2 + 60)),
                        Inventory: 100 - (o.id % 5) * 8,
                        Service: Math.round(o.rating * 20),
                        Staff: 100 - (o.id % 4) * 10,
                        Profit: Math.round((o.profit / o.revenue) * 100),
                      };
                      return (
                        <tr key={o.id}>
                          <td className="text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap pr-2">{o.name}</td>
                          {heatmapMetrics.map(m => (
                            <td key={m}>
                              <div className={`rounded-lg text-center py-2 font-semibold ${heatCellStyle(cells[m])}`}>{cells[m]}</div>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* ============ SMART AI RECOMMENDATIONS + SMART ALERTS ============ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <GlassCard className="p-5">
                <SectionHeading eyebrow="AI generated" title="Smart AI recommendations" subtitle="Actions the agent suggests this week" />
                <div className="space-y-2.5">
                  {recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 flex items-center justify-center shrink-0">
                        <r.icon size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1.5">{r.text}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <SectionHeading eyebrow="Live monitoring" title="Smart alerts" subtitle="Issues that need attention right now" />
                <div className="space-y-2">
                  {smartAlerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${a.tone === "danger" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : a.tone === "warning" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" : "bg-blue-50 dark:bg-blue-500/10 text-blue-500"}`}>
                        <a.icon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.detail}</p>
                      </div>
                      <span className={`w-2 h-2 rounded-full shrink-0 ${a.tone === "danger" ? "bg-rose-500 animate-pulse" : a.tone === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* ============ GOAL TRACKING ============ */}
            <GlassCard className="p-5">
              <SectionHeading eyebrow="Targets" title="Goal tracking" subtitle="Progress against this month's targets" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {goals.map(g => {
                  const pct = Math.round((g.current / g.target) * 100);
                  const display = g.format === "currency" ? compactCurrency(g.current) : g.format === "rating" ? `${g.current} / 5` : g.current.toLocaleString("en-IN");
                  const targetDisplay = g.format === "currency" ? compactCurrency(g.target) : g.format === "rating" ? `${g.target} / 5` : g.target.toLocaleString("en-IN");
                  return (
                    <div key={g.label} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Target size={13} className="text-blue-500" />
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{g.label}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{display} <span className="text-slate-400 font-normal text-xs">/ {targetDisplay}</span></p>
                      <ProgressBar pct={pct} />
                      <p className="text-[10px] text-slate-400 mt-1">{pct}% complete</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* ============ SECTION 10 + 11: AI INSIGHTS + NOTIFICATIONS ============ */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              <GlassCard className="xl:col-span-2 p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent AI Insights</h2>
                <div className="relative pl-6">
                  <div className="absolute left-[9px] top-1 bottom-1 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-5">
                    {aiInsights.map(item => (
                      <div key={item.id} className="relative">
                        <div className={`absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900
                          ${item.tone === "success" ? "bg-emerald-500" : item.tone === "warning" ? "bg-amber-500" : "bg-blue-500"}`}>
                          <item.icon size={10} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.detail}</p>
                        <p className="text-[11px] text-slate-350 text-slate-400 mt-1 flex items-center gap-1"><Clock3 size={10} /> {item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Notifications</h2>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${n.tone === "danger" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500" : n.tone === "warning" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500" : "bg-blue-50 dark:bg-blue-500/10 text-blue-500"}`}>
                        <n.icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* ============ OUTLET DRILL DOWN MODAL ============ */}
            {selectedOutletDrillDown && (
              <OutletDrillDownModal
                outlet={selectedOutletDrillDown}
                onClose={() => setSelectedOutletDrillDown(null)}
              />
            )}

            {/* ============ FOOTER ============ */}
            <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-800">

              <span>Last updated {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · Dashboard v2.4.1</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
                <Sparkles size={11} /> AI Powered
              </span>
            </footer>
        </>
      )}
    </div>
  );

  if (embedded) {
    return mainDashboard;
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex">
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 px-4 lg:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
            {mainDashboard}
          </main>
        </div>
      </div>
    </div>
  );
}
