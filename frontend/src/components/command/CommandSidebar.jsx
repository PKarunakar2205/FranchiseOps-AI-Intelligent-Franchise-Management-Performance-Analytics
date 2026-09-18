import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BrainCircuit,
  Store,
  Boxes,
  Users,
  Megaphone,
  ShieldCheck,
  Brain,
  Bell,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  X,
  MapPin
} from "lucide-react";

export default function CommandSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  unreadCount = 0
}) {
  const location = useLocation();
  const activePath = location.pathname;

  const navGroups = [
    {
      title: "COMMAND CENTER",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/" },
        { label: "Executive Decision Center", icon: BrainCircuit, path: "/executive-decision-center" },
      ]
    },
    {
      title: "AI INTELLIGENCE",
      items: [
        { label: "Outlet Performance Agent", icon: Store, path: "/outlet-performance" },
        { label: "Inventory Agent", icon: Boxes, path: "/inventory" },
        { label: "Staff Agent", icon: Users, path: "/staff" },
        { label: "Marketing Intelligence Agent", icon: Megaphone, path: "/marketing" },
        { label: "Audit & Compliance Intelligence", icon: ShieldCheck, path: "/audit" },
        { label: "Franchise Intelligence Engine", icon: Brain, path: "/business-intelligence" },
        { label: "Notification & Workflow Management", icon: Bell, path: "/notifications", badge: unreadCount },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { label: "Outlets & Locations", icon: MapPin, path: "/outlets" },
        { label: "Reports & Analytics", icon: FileBarChart, path: "/reports" },
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { label: "Settings", icon: Settings, path: "/settings" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen shrink-0 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* BRAND LOGO HEADER */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="space-y-0.5 truncate">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight block leading-none">
                  FranchiseOps AI
                </span>
                <span className="text-3xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                  AI Operations Command Center
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile Close Toggle */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION GROUP LIST */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-none">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-3xs font-extrabold text-slate-400 uppercase tracking-widest">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const IconComp = item.icon;
                const isActive =
                  item.path === "/"
                    ? activePath === "/" || activePath === "/dashboard"
                    : activePath === item.path || (item.path === "/outlets" && activePath === "/outlet-performance");

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <IconComp
                      size={18}
                      className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"}`}
                    />

                    {!collapsed && <span className="truncate">{item.label}</span>}

                    {/* Notification Badge */}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`ml-auto text-3xs font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? "bg-white text-blue-600" : "bg-rose-500 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Active Pill Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* BOTTOM TELEMETRY FOOTER */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Zap size={14} className="animate-pulse" /> Telemetry Online
            </div>
            <p className="text-3xs text-slate-500 dark:text-slate-400 leading-tight">
              PostgreSQL DB • 7/7 AI Agents Operational
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
