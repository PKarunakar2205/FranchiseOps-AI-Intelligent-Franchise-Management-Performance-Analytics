import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Sliders,
  Moon,
  Sun,
  Bell,
  Shield,
  Server,
  Save,
  CheckCircle2,
  Lock,
  Key,
  Globe,
  Database,
  Smartphone,
  Mail,
  Zap,
} from "lucide-react";

export default function SettingsPage({ dark, setDark }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [toastMessage, setToastMessage] = useState(null);

  // Profile Form State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_profile");
    return saved
      ? JSON.parse(saved)
      : {
        fullName: "P Karunakar",
        email: "pkarunakar@franchiseops.ai",
        role: "Enterprise Franchise Director",
        region: "South India (Chennai, BLR, HYD)",
        avatarUrl: "",
      };
  });

  // App Preferences State
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_preferences");
    return saved
      ? JSON.parse(saved)
      : {
        currency: "INR (₹)",
        dateFormat: "DD/MM/YYYY",
        autoRefreshInterval: "30",
        defaultLandingPage: "Dashboard",
      };
  });

  // Notification Preferences State
  const [notifPref, setNotifPref] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_notif");
    return saved
      ? JSON.parse(saved)
      : {
        emailDigest: true,
        smsAlerts: false,
        anomalyPush: true,
        auditFailures: true,
        lowStockWarnings: true,
      };
  });

  // API Config State
  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_api");
    return saved
      ? JSON.parse(saved)
      : {
        apiUrl: getApiBaseUrl(),
        environment: typeof window !== "undefined" && window.location.hostname !== "localhost" ? "Production (Cloud)" : "Development (Local)",
        timeoutMs: "5000",
      };
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_profile", JSON.stringify(profile));
    showToast("Profile settings saved successfully!");
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_preferences", JSON.stringify(preferences));
    showToast("Application preferences updated!");
  };

  const handleSaveNotifPref = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_notif", JSON.stringify(notifPref));
    showToast("Notification preferences updated!");
  };

  const handleSaveApiConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_api", JSON.stringify(apiConfig));
    showToast("Backend API configuration saved!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "Backend API", icon: Server },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-3.5 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {toastMessage}
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800 backdrop-blur-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings size={16} /> Enterprise System Setup
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            FranchiseOS Settings & Configurations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your director profile, alert channels, security keys, and telemetry thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
            <Zap size={14} /> Telemetry Online
          </span>
        </div>
      </div>

      {/* TAB SELECTOR PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-800"
                }`}
            >
              <IconComp size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-6 shadow-xs">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Executive Director Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update your account identity and regional franchise jurisdiction.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Role Designation</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Franchise Region Jurisdiction</label>
                <select
                  value={profile.region}
                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="All India (Master Headquarters)">All India (Master Headquarters)</option>
                  <option value="South India (Chennai, BLR, HYD)">South India (Chennai, BLR, HYD)</option>
                  <option value="West India (Mumbai, Pune, ADM)">West India (Mumbai, Pune, ADM)</option>
                  <option value="North India (Delhi NCR, CHD, LKO)">North India (Delhi NCR, CHD, LKO)</option>
                  <option value="East India (Kolkata, GAU)">East India (Kolkata, GAU)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Save size={15} /> Save Profile Changes
            </button>
          </form>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "preferences" && (
          <form onSubmit={handleSavePreferences} className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Preferences</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure global currency formats, telemetry refresh frequencies, and theme preferences.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Currency Display</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="INR (₹)">INR (Indian Rupee - ₹)</option>
                  <option value="USD ($)">USD (US Dollar - $)</option>
                  <option value="EUR (€)">EUR (Euro - €)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date Display Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 15/08/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Format)</option>
                  <option value="MMM DD, YYYY">MMM DD, YYYY (e.g. Aug 15, 2026)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto Refresh Interval</label>
                <select
                  value={preferences.autoRefreshInterval}
                  onChange={(e) => setPreferences({ ...preferences, autoRefreshInterval: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="15">Every 15 Seconds</option>
                  <option value="30">Every 30 Seconds (Default)</option>
                  <option value="60">Every 60 Seconds</option>
                  <option value="0">Manual Refresh Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">UI Color Theme Mode</label>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setDark(true)}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${dark
                      ? "bg-slate-800 border-blue-500 text-white shadow-md"
                      : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}
                  >
                    <Moon size={15} className="text-amber-400" /> Dark Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setDark(false)}
                    className={`flex-1 p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${!dark
                      ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                  >
                    <Sun size={15} className="text-amber-500" /> Light Mode
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Save size={15} /> Save Application Preferences
            </button>
          </form>
        )}

        {/* NOTIFICATION PREFERENCES TAB */}
        {activeTab === "notifications" && (
          <form onSubmit={handleSaveNotifPref} className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notification & Alert Channels</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose which operational telemetry anomalies trigger email, SMS, or browser push notifications.</p>
            </div>

            <div className="space-y-3">
              {[
                { key: "emailDigest", label: "Daily Executive Email Digest", desc: "Receive daily telemetry summaries across sales, inventory, and staff at 8:00 AM." },
                { key: "anomalyPush", label: "Real-time AI Anomaly Push Alerts", desc: "Instant browser alerts when sales spike/dip by over 25%." },
                { key: "lowStockWarnings", label: "Critical Low Stock & Expiry Warnings", desc: "Trigger notifications when SKU stock cover drops below 3 days." },
                { key: "auditFailures", label: "Audit Compliance Violation Alerts", desc: "Immediate notification if an outlet fails safety or temperature checks." },
                { key: "smsAlerts", label: "SMS Urgent Alerts for Store Managers", desc: "Send SMS dispatch for emergency critical operational flags." },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifPref[item.key]}
                    onChange={(e) => setNotifPref({ ...notifPref, [item.key]: e.target.checked })}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Save size={15} /> Save Notification Preferences
            </button>
          </form>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Password Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage director authentication, active sessions, and 2FA authentication.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showToast("Password updated cleanly!"); }} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Key size={14} /> Update Security Password
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Director Sessions</h4>
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Smartphone size={16} className="text-blue-500" />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Chrome on Windows (Current Session)</div>
                    <div className="text-[10px] text-slate-400">IP: 127.0.0.1 • Chennai, India</div>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* API CONFIG TAB */}
        {activeTab === "api" && (
          <form onSubmit={handleSaveApiConfig} className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Backend API & Server Integration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure connection strings for the Express/Node.js telemetry backend service.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Backend API Target Base URL</label>
                <input
                  type="text"
                  value={apiConfig.apiUrl}
                  onChange={(e) => setApiConfig({ ...apiConfig, apiUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate-400">Default local development: http://localhost:5000/api</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Environment Profile</label>
                  <select
                    value={apiConfig.environment}
                    onChange={(e) => setApiConfig({ ...apiConfig, environment: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Development (Local)">Development (Local Host)</option>
                    <option value="Production (Render Cloud)">Production (Render Cloud)</option>
                    <option value="Staging Sandbox">Staging Sandbox</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Request Timeout (ms)</label>
                  <input
                    type="number"
                    value={apiConfig.timeoutMs}
                    onChange={(e) => setApiConfig({ ...apiConfig, timeoutMs: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
            >
              <Save size={15} /> Save API Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
