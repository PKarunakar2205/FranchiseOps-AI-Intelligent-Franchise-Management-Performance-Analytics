import React, { useState, useEffect } from "react";
import {
  getNotificationsApi,
  getNotificationAnalyticsApi,
  acknowledgeNotificationApi,
  resolveNotificationApi,
  escalateNotificationApi,
  deleteNotificationApi,
  createNotificationApi,
  triggerWorkflowEngineApi,
  getActionPlansApi,
  createActionPlanApi,
  updateActionPlanApi,
  createActionPlanTaskApi,
  updateActionPlanTaskApi,
  getNotificationByIdApi,
} from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Search,
  CheckCheck,
  Trash2,
  Filter,
  Boxes,
  TrendingUp,
  ShieldCheck,
  Users,
  Megaphone,
  Server,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Plus,
  Play,
  Activity,
  Layers,
  FileText,
  ListTodo,
  History,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronRight,
  UserCheck,
  CheckSquare,
  Square,
  AlertCircle,
  X,
  PieChart as PieIcon,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
  Legend,
} from "recharts";

const PRIORITY_COLORS = {
  LOW: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  CRITICAL: "bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse",
};

const CHANNEL_ICONS = {
  IN_APP: Bell,
  EMAIL: Mail,
  SMS: Smartphone,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'escalations' | 'action_plans' | 'analytics'
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [actionPlans, setActionPlans] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter States
  const [selectedChannel, setSelectedChannel] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [selectedNotificationForPlan, setSelectedNotificationForPlan] = useState(null);
  const [auditModalData, setAuditModalData] = useState(null);
  const [customAlertModalOpen, setCustomAlertModalOpen] = useState(false);

  // Form States for Action Plan Creation
  const [planTitle, setPlanTitle] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPriority, setPlanPriority] = useState("HIGH");
  const [planOwner, setPlanOwner] = useState("P. Karunakar (Regional Ops)");
  const [planTask1, setPlanTask1] = useState("");
  const [planTask2, setPlanTask2] = useState("");

  // Form States for Custom Alert Creation
  const [customAlertTitle, setCustomAlertTitle] = useState("");
  const [customAlertMsg, setCustomAlertMsg] = useState("");
  const [customAlertPriority, setCustomAlertPriority] = useState("HIGH");
  const [customAlertChannel, setCustomAlertChannel] = useState("IN_APP");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [notifRes, analyticsRes, plansRes] = await Promise.all([
        getNotificationsApi(),
        getNotificationAnalyticsApi(),
        getActionPlansApi(),
      ]);

      if (notifRes && notifRes.success) {
        setNotifications(notifRes.data);
      }
      if (analyticsRes && analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }
      if (plansRes && plansRes.success) {
        setActionPlans(plansRes.data);
      }
    } catch (err) {
      console.error("Failed to load notifications module data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Live update polling every 12 seconds
    const interval = setInterval(loadData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Notifications Feed
  const filteredNotifications = notifications.filter((n) => {
    const matchesChannel = selectedChannel === "All" || n.channel === selectedChannel;
    const matchesPriority = selectedPriority === "All" || n.priority === selectedPriority;
    const matchesStatus = selectedStatus === "All" || n.status === selectedStatus;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.outlet_name && n.outlet_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesPriority && matchesStatus && matchesSearch;
  });

  // Action Handlers
  const handleAcknowledge = async (id) => {
    try {
      const res = await acknowledgeNotificationApi(id, "Regional Manager");
      if (res && res.success) {
        showToast("Notification acknowledged cleanly.");
        loadData();
        window.dispatchEvent(new Event("notifications_updated"));
      }
    } catch (e) {
      showToast("Error acknowledging notification.");
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await resolveNotificationApi(id, "Regional Manager");
      if (res && res.success) {
        showToast("Notification resolved and closed.");
        loadData();
        window.dispatchEvent(new Event("notifications_updated"));
      }
    } catch (e) {
      showToast("Error resolving notification.");
    }
  };

  const handleEscalate = async (id) => {
    try {
      const res = await escalateNotificationApi(id, "Manual Manager Override Escalation", "Regional Lead");
      if (res && res.success) {
        showToast("Notification escalated to higher authority tier.");
        loadData();
        window.dispatchEvent(new Event("notifications_updated"));
      }
    } catch (e) {
      showToast("Error escalating notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id);
      showToast("Notification record removed.");
      loadData();
      window.dispatchEvent(new Event("notifications_updated"));
    } catch (e) {
      showToast("Error removing notification.");
    }
  };

  const handleTriggerEngine = async () => {
    showToast("Scanning live telemetry & evaluating rule engine...");
    try {
      const res = await triggerWorkflowEngineApi();
      if (res && res.success) {
        showToast(`Rule engine evaluated cleanly! Generated ${res.data.count} new operational notifications.`);
        loadData();
        window.dispatchEvent(new Event("notifications_updated"));
      }
    } catch (e) {
      showToast("Failed to run workflow engine.");
    }
  };

  const handleOpenAuditModal = async (id) => {
    try {
      const res = await getNotificationByIdApi(id);
      if (res && res.success) {
        setAuditModalData(res.data);
      }
    } catch (e) {
      showToast("Failed to load audit trail.");
    }
  };

  const handleCreateActionPlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const tasks = [];
      if (planTask1.trim()) tasks.push({ title: planTask1, assigned_to: planOwner });
      if (planTask2.trim()) tasks.push({ title: planTask2, assigned_to: "Store Supervisor" });

      const payload = {
        title: planTitle,
        description: planDescription,
        source_notification_id: selectedNotificationForPlan ? selectedNotificationForPlan.id : null,
        outlet_name: selectedNotificationForPlan ? selectedNotificationForPlan.outlet_name : "All Outlets",
        priority: planPriority,
        owner_name: planOwner,
        tasks,
      };

      const res = await createActionPlanApi(payload);
      if (res && res.success) {
        showToast(`Action Plan '${planTitle}' created successfully with ${tasks.length} tasks!`);
        setCreatePlanModalOpen(false);
        setPlanTitle("");
        setPlanDescription("");
        setPlanTask1("");
        setPlanTask2("");
        setSelectedNotificationForPlan(null);
        loadData();
      }
    } catch (err) {
      showToast("Failed to create Action Plan.");
    }
  };

  const handleCreateCustomAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await createNotificationApi({
        title: customAlertTitle,
        message: customAlertMsg,
        priority: customAlertPriority,
        channel: customAlertChannel,
        outlet_name: "Chennai T. Nagar Flagship",
        recipient_role: "Store Manager",
      });

      if (res && res.success) {
        showToast("Custom alert created & dispatched across multi-channel abstraction!");
        setCustomAlertModalOpen(false);
        setCustomAlertTitle("");
        setCustomAlertMsg("");
        loadData();
        window.dispatchEvent(new Event("notifications_updated"));
      }
    } catch (err) {
      showToast("Failed to create alert.");
    }
  };

  const handleTaskToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      await updateActionPlanTaskApi(taskId, { status: newStatus });
      showToast(`Task marked as ${newStatus}`);
      loadData();
    } catch (err) {
      showToast("Failed to update task.");
    }
  };

  const handleVerifyActionPlan = async (planId) => {
    try {
      await updateActionPlanApi(planId, { status: "VERIFIED", progress: 100 });
      showToast("Action Plan verified & marked as VERIFIED!");
      loadData();
    } catch (err) {
      showToast("Failed to verify action plan.");
    }
  };

  const kpis = analytics?.kpis || {
    totalSent: notifications.length,
    ackRate: 75.0,
    openActions: actionPlans.filter((p) => p.status !== "CLOSED").length,
    slaBreaches: notifications.filter((n) => !n.acknowledged && n.priority === "CRITICAL").length,
    avgResolutionTimeHours: 2.4,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell size={16} /> Notification & Workflow Management System
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Franchise Operations Control Center
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Live DB Sync
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-channel notifications (In-App, Email, SMS), automated SLA escalation engine, franchise action plans, and complete audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleTriggerEngine}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Play size={15} /> Trigger Rule Engine
          </button>
          <button
            onClick={() => {
              setSelectedNotificationForPlan(null);
              setCreatePlanModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
          >
            <Plus size={15} /> New Action Plan
          </button>
          <button
            onClick={() => setCustomAlertModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <Mail size={15} /> Send Alert
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* DYNAMIC TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notifications Sent</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.totalSent}</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} /> Across 3 Channels
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <Bell size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Acknowledgement Rate</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.ackRate}%</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 size={12} /> Target SLA &gt; 90%
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <UserCheck size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Open Action Plans</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.openActions}</h3>
            <span className="text-[10px] text-purple-500 font-semibold flex items-center gap-0.5 mt-0.5">
              <ListTodo size={12} /> Active Tasks Tracked
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
            <ListTodo size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SLA Breaches</p>
            <h3 className="text-2xl font-black text-rose-500 mt-1">{kpis.slaBreaches}</h3>
            <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5 mt-0.5">
              <AlertTriangle size={12} /> Escalated to Managers
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
            <ShieldAlert size={20} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Resolution Time</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {kpis.avgResolutionTimeHours} <span className="text-xs font-normal">hrs</span>
            </h3>
            <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-0.5 mt-0.5">
              <Clock size={12} /> Optimal SLA
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Clock size={20} />
          </div>
        </motion.div>
      </div>

      {/* MODULE NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "feed"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Bell size={16} /> Notifications Feed ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab("escalations")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "escalations"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ShieldAlert size={16} /> Escalation Queue ({analytics?.escalationQueue?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("action_plans")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "action_plans"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <ListTodo size={16} /> Franchise Action Plans ({actionPlans.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <BarChart2 size={16} /> Analytics & Charts
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: NOTIFICATIONS FEED */}
      {/* ========================================================================= */}
      {activeTab === "feed" && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="p-4 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alerts by title, message, outlet..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Channel Filter */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Channel:</span>
                {["All", "IN_APP", "EMAIL", "SMS"].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChannel(ch)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                      selectedChannel === ch
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {ch === "IN_APP" ? "In-App" : ch}
                  </button>
                ))}
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Priority:</span>
                {["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                      selectedPriority === p
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Status:</span>
                {["All", "SENT", "ACKNOWLEDGED", "ESCALATED", "RESOLVED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                      selectedStatus === st
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {st === "SENT" ? "New" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS LIST */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => {
                  const ChannelIcon = CHANNEL_ICONS[notif.channel] || Bell;
                  const priorityStyle = PRIORITY_COLORS[notif.priority] || PRIORITY_COLORS.MEDIUM;

                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-5 rounded-3xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        notif.priority === "CRITICAL" && !notif.acknowledged
                          ? "bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-500/5"
                          : notif.status === "ESCALATED"
                          ? "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/40"
                          : "bg-white/80 dark:bg-slate-900/80 border-slate-200/70 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl border shrink-0 ${priorityStyle}`}>
                          <ChannelIcon size={20} />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${priorityStyle}`}>
                              {notif.priority}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Channel: {notif.channel}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                              Outlet: {notif.outlet_name || "Franchise Store"}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Recipient: {notif.recipient_role || "Store Manager"}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {notif.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                            {notif.message}
                          </p>

                          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-medium">
                            <span>Created: {new Date(notif.created_at).toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" })}</span>
                            {notif.due_at && (
                              <span className={new Date(notif.due_at) < new Date() && !notif.acknowledged ? "text-rose-500 font-bold" : ""}>
                                SLA Deadline: {new Date(notif.due_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                            {notif.status && (
                              <span className="font-bold text-indigo-500 uppercase">Status: {notif.status}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ACTION BUTTONS ON EACH ITEM */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0 self-end lg:self-center">
                        {!notif.acknowledged && notif.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleAcknowledge(notif.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={14} /> Acknowledge
                          </button>
                        )}

                        {notif.status !== "ESCALATED" && notif.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleEscalate(notif.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <ShieldAlert size={14} /> Escalate
                          </button>
                        )}

                        {notif.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleResolve(notif.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedNotificationForPlan(notif);
                            setPlanTitle(`Action Plan — ${notif.title}`);
                            setPlanDescription(notif.message);
                            setCreatePlanModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus size={14} /> Create Action Plan
                        </button>

                        <button
                          onClick={() => handleOpenAuditModal(notif.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Full Audit Trail"
                        >
                          <History size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-16 text-center rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-slate-400 text-xs">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  No operational notifications matching active search and filters.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ESCALATION QUEUE */}
      {/* ========================================================================= */}
      {activeTab === "escalations" && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} /> SLA Escalation Queue & Multi-Tier Routing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Notifications that breached initial response SLA deadlines and were automatically routed to higher management tiers (Level 1: Store Manager → Level 2: Regional Manager → Level 3: VP Ops).
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/70 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Issue Alert</th>
                  <th className="px-6 py-4">Franchise Outlet</th>
                  <th className="px-6 py-4">Escalation Tier</th>
                  <th className="px-6 py-4">Current Assigned Owner</th>
                  <th className="px-6 py-4">Pending Duration</th>
                  <th className="px-6 py-4">Next Escalation Target</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics?.escalationQueue && analytics.escalationQueue.length > 0 ? (
                  analytics.escalationQueue.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                        {item.outletName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          Level {item.escalationLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-500">
                        {item.currentOwner}
                      </td>
                      <td className="px-6 py-4 font-mono text-rose-500 font-bold">
                        {item.timePendingHours}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {item.nextEscalation}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleResolve(item.notificationId)}
                          className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors"
                        >
                          Resolve Issue
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No active escalated alerts in queue. All SLAs are currently within safe thresholds.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FRANCHISE ACTION PLANS */}
      {/* ========================================================================= */}
      {activeTab === "action_plans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/70 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ListTodo className="text-purple-500" size={20} /> Operational Action Plan Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Structured action plans generated from critical notifications with step-by-step task assignments and verification tracking.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedNotificationForPlan(null);
                setCreatePlanModalOpen(true);
              }}
              className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} /> Create Action Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actionPlans.length > 0 ? (
              actionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${PRIORITY_COLORS[plan.priority] || PRIORITY_COLORS.MEDIUM}`}>
                        {plan.priority} Priority
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        {plan.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{plan.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Outlet: {plan.outlet_name || "Franchise Store"}</span>
                      <span>Owner: {plan.owner_name || "Operations Lead"}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <span>Completion Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500"
                          style={{ width: `${plan.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Sub-Tasks:</p>
                      {plan.tasks && plan.tasks.length > 0 ? (
                        plan.tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleTaskToggle(task.id, task.status)}
                            className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {task.status === "COMPLETED" ? (
                                <CheckSquare size={16} className="text-emerald-500 shrink-0" />
                              ) : (
                                <Square size={16} className="text-slate-400 shrink-0" />
                              )}
                              <span className={task.status === "COMPLETED" ? "line-through text-slate-400" : "font-semibold text-slate-800 dark:text-slate-200"}>
                                {task.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">Assigned: {task.assigned_to}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No sub-tasks assigned yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Due: {plan.due_date ? String(plan.due_date).split("T")[0] : "Next 7 Days"}
                    </span>
                    {plan.status !== "VERIFIED" && plan.status !== "CLOSED" && (
                      <button
                        onClick={() => handleVerifyActionPlan(plan.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Verify & Close Plan
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-12 text-center text-slate-400 text-xs">
                No action plans created yet. Click 'Create Action Plan' to initiate task tracking.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ANALYTICS & VISUALIZATIONS */}
      {/* ========================================================================= */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Notifications by Channel */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={18} className="text-indigo-500" /> Notifications by Channel
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.byChannel || []}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="channel" stroke="#8884d8" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Priority Distribution */}
            <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon size={18} className="text-purple-500" /> Priority Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.byPriority || []}
                      dataKey="count"
                      nameKey="priority"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {(analytics?.byPriority || []).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#f59e0b", "#f97316", "#ef4444"][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE ACTION PLAN */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {createPlanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreatePlanModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-50 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <ListTodo className="text-purple-500" size={18} /> Create Franchise Action Plan
                </h3>
                <button onClick={() => setCreatePlanModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateActionPlanSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Action Plan Title</label>
                  <input
                    type="text"
                    required
                    value={planTitle}
                    onChange={(e) => setPlanTitle(e.target.value)}
                    placeholder="e.g. Cold Storage Calibration & Servicing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description & Scope</label>
                  <textarea
                    rows={2}
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Detailed steps required to fix the operational issue..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority Level</label>
                    <select
                      value={planPriority}
                      onChange={(e) => setPlanPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white font-semibold"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Owner</label>
                    <input
                      type="text"
                      value={planOwner}
                      onChange={(e) => setPlanOwner(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Initial Sub-Tasks</label>
                  <input
                    type="text"
                    value={planTask1}
                    onChange={(e) => setPlanTask1(e.target.value)}
                    placeholder="Sub-Task 1: e.g. Dispatch HVAC Engineer"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white"
                  />
                  <input
                    type="text"
                    value={planTask2}
                    onChange={(e) => setPlanTask2(e.target.value)}
                    placeholder="Sub-Task 2: e.g. Verify 12-hour temperature log"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatePlanModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-500/20"
                  >
                    Save Action Plan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: SEND CUSTOM ALERT */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {customAlertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomAlertModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-50 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Mail className="text-indigo-500" size={18} /> Dispatch Multi-Channel Alert
                </h3>
                <button onClick={() => setCustomAlertModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomAlert} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={customAlertTitle}
                    onChange={(e) => setCustomAlertTitle(e.target.value)}
                    placeholder="e.g. Critical Stock Shortage Alert"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Content</label>
                  <textarea
                    rows={2}
                    required
                    value={customAlertMsg}
                    onChange={(e) => setCustomAlertMsg(e.target.value)}
                    placeholder="Message to be sent to store managers..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                    <select
                      value={customAlertPriority}
                      onChange={(e) => setCustomAlertPriority(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-white font-semibold"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Channel</label>
                    <select
                      value={customAlertChannel}
                      onChange={(e) => setCustomAlertChannel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 text-slate-800 dark:text-white font-semibold"
                    >
                      <option value="IN_APP">In-App Notification</option>
                      <option value="EMAIL">Email Dispatch</option>
                      <option value="SMS">SMS Gateway Alert</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomAlertModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-500/20"
                  >
                    Dispatch Alert
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: AUDIT TRAIL TIMELINE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {auditModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuditModalData(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-50 w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <History className="text-indigo-500" size={18} /> Complete Notification Audit Trail
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Notification #{auditModalData.id} — {auditModalData.title}
                  </p>
                </div>
                <button onClick={() => setAuditModalData(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              {/* TIMELINE LIST */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {auditModalData.auditTrail && auditModalData.auditTrail.length > 0 ? (
                  auditModalData.auditTrail.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1 shrink-0 ring-4 ring-indigo-500/20" />
                      {i < auditModalData.auditTrail.length - 1 && (
                        <div className="absolute left-[5px] top-4 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
                      )}
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex-1 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                            {log.event}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{log.details}</p>
                        <p className="text-[10px] text-slate-400 italic">Actor: {log.actor}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No audit records found for this notification.</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
                <button
                  onClick={() => setAuditModalData(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Close Audit View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
