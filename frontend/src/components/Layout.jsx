import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, clearAuthData, getOperationalAlerts, getNotificationsApi, queryAiAssistant } from "../api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Store,
  Boxes,
  TrendingUp,
  Users,
  Megaphone,
  Bell,
  FileBarChart,
  Settings,
  Search,
  Sparkles,
  Sun,
  Moon,
  Zap,
  X,
  Menu,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  ShieldCheck,
  Brain,
  Send,
  Loader2,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function Layout({ children, dark, setDark }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // AI Assistant Drawer State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your FranchiseOS AI Intelligence Assistant. Ask me anything about franchise health, underperforming outlets, low stock, audit compliance, or top management actions.",
    },
  ]);

  // Notifications State & Ref
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getUser();

  const loadNotificationsData = () => {
    // 1. Fetch live operational notifications from PostgreSQL backend
    getNotificationsApi()
      .then((res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const dbMapped = res.data.map((item) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            outletName: item.outlet_name || "Franchise Store",
            severity: item.priority === "CRITICAL" ? "CRITICAL" : item.priority === "HIGH" ? "WARNING" : "INFO",
            read: item.acknowledged || item.status === "ACKNOWLEDGED" || item.status === "RESOLVED",
            priority: item.priority,
            status: item.status,
            channel: item.channel,
          }));

          setAlerts(dbMapped);
          setUnreadCount(dbMapped.filter((a) => !a.read).length);
        }
      })
      .catch(() => {
        // Fallback to legacy alerts endpoint if needed
        getOperationalAlerts().then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            const dbMapped = res.data.map((item) => ({
              id: `db-${item.id || item.notification_id}`,
              title: `${item.type || "Operational"} Alert`,
              message: item.message,
              severity: item.priority === "CRITICAL" ? "CRITICAL" : "WARNING",
              read: item.status === "Read",
            }));
            setAlerts(dbMapped);
            setUnreadCount(dbMapped.filter((a) => !a.read).length);
          }
        }).catch(() => {});
      });
  };

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadNotificationsData();
    // Live update polling every 10 seconds for real-time telemetry updates
    const pollTimer = setInterval(loadNotificationsData, 10000);
    window.addEventListener("notifications_updated", loadNotificationsData);
    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("notifications_updated", loadNotificationsData);
    };
  }, []);

  // Dismiss notification dropdown on outside click
  useEffect(() => {
    if (!notificationsOpen) return;
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Executive Decision Center", icon: Brain, path: "/executive-decision-center" },
    { label: "Outlet Performance Agent", icon: Store, path: "/outlet-performance" },
    { label: "Franchise Intelligence", icon: Brain, path: "/business-intelligence" },
    { label: "AI Audit Agent", icon: ShieldCheck, path: "/audit" },
    { label: "Inventory Agent", icon: Boxes, path: "/inventory" },
    { label: "Staff Agent", icon: Users, path: "/staff" },
    { label: "Marketing Agent", icon: Megaphone, path: "/marketing" },
    { label: "Notifications & Workflows", icon: Bell, path: "/notifications" },
    { label: "Reports", icon: FileBarChart, path: "/reports" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const activePath = location.pathname;

  const getDemoAiResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("overall franchise health") || q.includes("franchise health")) {
      return "📊 Overall Franchise Network Health: 88/100 (Optimal)\n• Total Active Outlets: 16 Outlets\n• Network Revenue: ₹13,34,350 (+14.8% YoY)\n• Audit Compliance: 91.6%\n• Inventory Health: 92.4%\n• Customer CSAT: 4.82/5.0";
    }
    if (q.includes("immediate attention") || q.includes("underperforming")) {
      return "⚠️ Outlets Requiring Management Review:\n1. Jaipur - C-Scheme: Revenue dips -3.8%, Audit Compliance 74% (Cold unit flag)\n2. Madurai Junction: Staffing shortage during peak evening shifts (-11.2% growth)";
    }
    if (q.includes("reordering") || q.includes("inventory")) {
      return "📦 Critical SKUs Needing Reorder:\n1. Premium Paneer Slices 1kg (Stock: 18kg | Threshold: 50kg)\n2. Eco Craft Containers (Stock: 0 | Threshold: 200 units)\n3. Cold Brew Beans (Stock: 12kg | Threshold: 25kg)";
    }
    if (q.includes("audit risk") || q.includes("audit")) {
      return "🛡️ Audit Risk Analysis:\n• 1 Critical Flag: Jubilee Hills store cold storage temperature fluctuation.\n• Overall Audit Pass Rate: 91.6%\n• Top Compliant Outlet: Park Street Kolkata (99% score).";
    }
    if (q.includes("marketing campaign") || q.includes("marketing")) {
      return "📢 Marketing Performance Insights:\n• Best Campaign: 'Monsoon Festive BOGO Blitz' (5.38x ROAS, ₹31.2L gross revenue)\n• Underperforming Campaign: 'Delhi Outdoor Print' (CPL ₹39.3, recommend reallocating budget to PPC).";
    }
    if (q.includes("top 5 actions") || q.includes("actions")) {
      return "🎯 Top 5 Management Priority Actions:\n1. Scale Meta Ad budget (+₹50k) for Monsoon BOGO campaign.\n2. Reorder Eco Containers & Cold Brew Beans stock.\n3. Complete temperature calibration audit at Jubilee Hills.\n4. Shift 1 cashier from morning to evening peak shift at Connaught Place.\n5. Issue win-back coupon promotion for Jaipur C-Scheme store.";
    }
    return `🤖 FranchiseOS AI Intelligence Summary for "${query}":\nTelemetry records across 16 regional outlets show strong revenue growth (+14.8% YoY). Audit compliance remains high at 91.6%. Inventory stock cover is at 92.4% health score. Recommended action: Check the Reports or Intelligence Agent module for full telemetry breakdowns.`;
  };

  const handleAskAi = async (customPrompt) => {
    const queryText = customPrompt || aiPrompt;
    if (!queryText.trim()) return;

    setAiMessages((prev) => [...prev, { sender: "user", text: queryText }]);
    setAiPrompt("");
    setAiLoading(true);

    try {
      const res = await queryAiAssistant(queryText);
      if (res && res.success && res.data && res.data.answer) {
        setAiMessages((prev) => [...prev, { sender: "ai", text: res.data.answer }]);
      } else {
        setAiMessages((prev) => [
          ...prev,
          { sender: "ai", text: getDemoAiResponse(queryText) },
        ]);
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        { sender: "ai", text: getDemoAiResponse(queryText) },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const presetQuestions = [
    "What is the overall franchise health?",
    "Which outlet needs immediate attention?",
    "Which products need reordering?",
    "Which outlets have audit risks?",
    "Which marketing campaign is performing poorly?",
    "What are the top 5 actions management should take?",
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 flex">

        {/* ============ SIDEBAR ============ */}
        <AnimatePresence>
          {(sidebarOpen || true) && (
            <motion.aside
              initial={false}
              className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 border-r border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300`}
            >
              {/* BRAND HEADER */}
              <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-200/70 dark:border-slate-800">
                <Link to="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4.5 h-4.5 text-white" size={18} />
                  </div>
                  <span className="font-semibold tracking-tight text-slate-900 dark:text-white text-lg">FranchiseOS</span>
                </Link>
                <button className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white" onClick={() => setSidebarOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* NAVIGATION LINKS */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? (activePath === "/" || activePath === "/dashboard")
                      : activePath === item.path;

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative
                        ${isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25 font-medium"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      <item.icon size={17} className={isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"} />
                      <span className="truncate">{item.label}</span>
                      {item.label === "Notifications" && unreadCount > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white shrink-0 shadow-xs">
                          {unreadCount}
                        </span>
                      )}
                      {isActive && item.label !== "Notifications" && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </Link>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800 px-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Authentication</p>
                  <Link
                    to="/login"
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activePath === "/login"
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <LogIn size={15} /> Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activePath === "/signup"
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                  >
                    <UserPlus size={15} /> Create Account
                  </Link>
                </div>
              </nav>

              {/* FOOTER BADGE */}
              <div className="p-4 border-t border-slate-200/70 dark:border-slate-800">
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-100 dark:border-blue-500/20 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                    <Zap size={14} /> AI Intelligence Active
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Cross-module operational telemetry</p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ============ MAIN CONTENT AREA ============ */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* TOP NAVBAR */}
          <header className="sticky top-0 z-50 h-16 border-b border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl flex items-center gap-4 px-4 lg:px-8">
            <button className="lg:hidden text-slate-600 dark:text-slate-300" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            <div className="relative hidden md:block w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search outlets, inventory, insights..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-transparent focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="ml-auto flex items-center gap-2 lg:gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setAiAssistantOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md shadow-blue-500/25"
              >
                <Sparkles size={15} /> AI Assistant
              </motion.button>

              {/* NOTIFICATION BELL DROPDOWN */}
              <div ref={notificationRef} id="notification-dropdown-container" className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsOpen((prev) => !prev);
                  }}
                  className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer z-10"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-rose-500 text-white ring-2 ring-white dark:ring-slate-950 shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 text-xs"
                    >
                      <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">Live Intelligence Alerts</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                          {alerts.length} Active
                        </span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {alerts.length === 0 ? (
                          <div className="p-4 text-center text-slate-400">No active alerts</div>
                        ) : (
                          alerts.map((a) => (
                            <div key={a.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                                {a.severity === "CRITICAL" ? (
                                  <AlertTriangle size={14} className="text-rose-500" />
                                ) : (
                                  <Info size={14} className="text-amber-500" />
                                )}
                                <span>{a.title}</span>
                              </div>
                              <p className="text-slate-500 dark:text-slate-400 mt-1 leading-snug">{a.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                          onClick={() => {
                            setNotificationsOpen(false);
                            navigate("/notifications");
                          }}
                          className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          View All Notifications →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setDark((d) => !d)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title="Toggle Dark/Light Mode"
              >
                {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              <div className="hidden md:block text-right leading-tight px-2 border-l border-slate-200 dark:border-slate-800 ml-1 pl-3">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
                <p className="text-[11px] text-slate-400">
                  {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {/* USER PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-md">
                    RK
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white">{currentUser?.full_name || "P Karunakar"}</p>
                        <p className="text-slate-400 text-[11px]">{currentUser?.role || "Regional Manager"}</p>
                      </div>
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <LogIn size={14} /> Switch Account
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <UserPlus size={14} /> Add Manager
                      </Link>
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                      <button
                        onClick={() => {
                          clearAuthData();
                          setUserDropdownOpen(false);
                          navigate("/login");
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left"
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 lg:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* ============ AI ASSISTANT DRAWER / MODAL ============ */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiAssistantOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Franchise AI Assistant</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by PostgreSQL Intelligence Engine</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Preset Query Chips */}
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAi(q)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap shadow-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md shadow-blue-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50"
                        }`}
                    >
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <Loader2 size={16} className="animate-spin" /> Querying PostgreSQL intelligence telemetry...
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
                  placeholder="Ask intelligence assistant..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={() => handleAskAi()}
                  disabled={aiLoading}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
