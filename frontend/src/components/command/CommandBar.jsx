import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Menu,
  ChevronDown,
  LogOut,
  AlertTriangle,
  Info,
  CheckCircle2,
  Database,
  Cpu,
  Clock,
  User
} from "lucide-react";
import { getUser, clearAuthData } from "../../api/apiClient";

export default function CommandBar({
  dark,
  setDark,
  setMobileOpen,
  setAiAssistantOpen,
  alerts = [],
  unreadCount = 0
}) {
  const navigate = useNavigate();
  const currentUser = getUser() || {};
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const themeRef = useRef(null);

  // System time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotificationsOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("decision") || q.includes("executive")) navigate("/executive-decision-center");
    else if (q.includes("audit")) navigate("/audit");
    else if (q.includes("inventory") || q.includes("stock")) navigate("/inventory");
    else if (q.includes("staff") || q.includes("leave")) navigate("/staff");
    else if (q.includes("marketing") || q.includes("campaign")) navigate("/marketing");
    else if (q.includes("notification")) navigate("/notifications");
    else navigate("/business-intelligence");
  };

  const currentThemeMode = localStorage.getItem("theme_mode") || (dark ? "dark" : "light");

  const handleSetThemeMode = (mode) => {
    localStorage.setItem("theme_mode", mode);
    if (mode === "dark") {
      setDark(true);
    } else if (mode === "light") {
      setDark(false);
    } else {
      const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(systemDark);
    }
    setThemeMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 transition-colors">
      {/* LEFT: Mobile Menu Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search outlet, city, report, alert..."
            className="w-full pl-10 pr-12 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-3xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-400">
            ⌘K
          </span>
        </form>
      </div>

      {/* RIGHT: LIVE TELEMETRY STATUS PILLS, NOTIFICATIONS, THEME, USER MENU */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Pill 1: Live System Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-3xs font-extrabold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Operational</span>
        </div>

        {/* Status Pill 2: Database Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-3xs font-extrabold">
          <Database size={12} />
          <span>PostgreSQL Connected</span>
        </div>

        {/* Status Pill 3: AI Agents Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-3xs font-extrabold">
          <Cpu size={12} />
          <span>7/7 Active</span>
        </div>

        {/* Clock Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-3xs font-bold border border-slate-200 dark:border-slate-800">
          <Clock size={12} className="text-slate-400" />
          <span>{currentTime}</span>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs shadow-blue-500/20 transition"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Live Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-3xs font-black rounded-full bg-rose-500 text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-50 text-xs"
              >
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Telemetry Notifications</span>
                  <span className="text-3xs font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {alerts.length} Active
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {alerts.length === 0 ? (
                    <p className="p-4 text-center text-slate-400">No unacknowledged notifications.</p>
                  ) : (
                    alerts.slice(0, 5).map((a, i) => (
                      <div key={a.id || i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
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
                    className="w-full py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 transition"
                  >
                    View Notifications Queue →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Selector */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            title="Appearance Theme"
          >
            {dark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          <AnimatePresence>
            {themeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs"
              >
                <button
                  onClick={() => handleSetThemeMode("light")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 transition ${
                    currentThemeMode === "light" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Sun size={14} className="text-amber-500" /> Light Mode
                </button>
                <button
                  onClick={() => handleSetThemeMode("dark")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 transition ${
                    currentThemeMode === "dark" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Moon size={14} className="text-amber-400" /> Dark Mode
                </button>
                <button
                  onClick={() => handleSetThemeMode("system")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 transition ${
                    currentThemeMode === "system" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Monitor size={14} className="text-indigo-400" /> System Mode
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
              {currentUser.full_name ? currentUser.full_name.slice(0, 2).toUpperCase() : "PK"}
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 text-xs"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">{currentUser.full_name || "P Karunakar"}</p>
                  <p className="text-slate-400 text-3xs">{currentUser.role || "Enterprise Director"}</p>
                </div>

                <Link
                  to="/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <User size={14} /> Profile & Settings
                </Link>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                  onClick={() => {
                    clearAuthData();
                    setUserMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left font-semibold transition"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
