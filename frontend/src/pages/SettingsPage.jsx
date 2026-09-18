import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  RotateCcw,
  LogOut,
  AlertTriangle,
  Loader2,
  Check,
  Palette
} from "lucide-react";
import {
  getUser,
  setAuthData,
  clearAuthData,
  updateUserProfileApi,
  changePasswordApi,
  getApiBaseUrl
} from "../api/apiClient";

export default function SettingsPage({ dark, setDark }) {
  const navigate = useNavigate();
  const currentUser = getUser() || {};
  const [activeTab, setActiveTab] = useState("profile");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");

  // Loading States for Async Actions
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      fullName: currentUser.full_name || "P Karunakar",
      email: currentUser.email || "pkarunakar@franchiseops.ai",
      phone: currentUser.phone || "+91 99887 76655",
      role: currentUser.role || "Enterprise Franchise Director",
      region: "South India (Chennai, BLR, HYD)",
    };
  });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // App Preferences State
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_preferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      currency: "INR (₹)",
      dateFormat: "DD/MM/YYYY",
      autoRefreshInterval: "30",
      defaultLandingPage: "/dashboard",
      accentTheme: "indigo",
    };
  });

  // Notification Preferences State
  const [notifPref, setNotifPref] = useState(() => {
    const saved = localStorage.getItem("franchise_settings_notif");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
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
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      apiUrl: getApiBaseUrl(),
      environment: typeof window !== "undefined" && window.location.hostname !== "localhost" ? "Production (Cloud)" : "Development (Local)",
      timeoutMs: "5000",
    };
  });

  const showToast = (msg, type = "success") => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. SAVE PROFILE HANDLER
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // If user is authenticated, sync with backend database
      if (currentUser && currentUser.user_id) {
        const res = await updateUserProfileApi({
          full_name: profile.fullName,
          phone: profile.phone,
        });
        if (res && res.user) {
          const updatedUser = { ...currentUser, full_name: res.user.full_name, phone: res.user.phone };
          setAuthData(localStorage.getItem("token"), updatedUser);
        }
      }
      localStorage.setItem("franchise_settings_profile", JSON.stringify(profile));
      showToast("Profile settings saved & synced successfully!", "success");
    } catch (err) {
      localStorage.setItem("franchise_settings_profile", JSON.stringify(profile));
      showToast("Profile saved locally (" + (err.message || "Offline") + ")", "warning");
    } finally {
      setSavingProfile(false);
    }
  };

  // 2. CHANGE PASSWORD HANDLER
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    setChangingPassword(true);
    try {
      await changePasswordApi({ currentPassword, newPassword });
      showToast("Security password updated successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
      showToast(err.message || "Password update failed", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  // 3. SAVE PREFERENCES HANDLER
  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_preferences", JSON.stringify(preferences));
    showToast("Application preferences saved!", "success");
  };

  // 4. RESET PREFERENCES HANDLER
  const handleResetPreferences = () => {
    if (window.confirm("Are you sure you want to reset all preferences back to default settings?")) {
      const defaultPref = {
        currency: "INR (₹)",
        dateFormat: "DD/MM/YYYY",
        autoRefreshInterval: "30",
        defaultLandingPage: "/dashboard",
        accentTheme: "indigo",
      };
      setPreferences(defaultPref);
      localStorage.setItem("franchise_settings_preferences", JSON.stringify(defaultPref));
      setDark(true);
      showToast("Preferences reset to defaults!", "info");
    }
  };

  // 5. SAVE NOTIFICATION PREFERENCES HANDLER
  const handleSaveNotifPref = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_notif", JSON.stringify(notifPref));
    window.dispatchEvent(new Event("notifications_updated"));
    showToast("Notification channel preferences updated!", "success");
  };

  // 6. SAVE API CONFIG HANDLER
  const handleSaveApiConfig = (e) => {
    e.preventDefault();
    localStorage.setItem("franchise_settings_api", JSON.stringify(apiConfig));
    showToast("Backend API configuration saved!", "success");
  };

  // 7. LOGOUT HANDLER
  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "Backend API", icon: Server },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xl backdrop-blur-md border ${
              toastType === "error"
                ? "bg-red-950/90 border-red-500/50 text-red-300"
                : toastType === "warning"
                ? "bg-amber-950/90 border-amber-500/50 text-amber-300"
                : "bg-emerald-950/90 border-emerald-500/50 text-emerald-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {toastType === "error" ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {toastMessage}
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings size={16} /> Enterprise System Setup
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            FranchiseOS Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your executive profile, password security, notification channels, theme and API targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>

      {/* TAB SELECTOR PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <IconComp size={15} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {/* 1. PROFILE TAB */}
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Role Designation</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Franchise Region Jurisdiction</label>
                <select
                  value={profile.region}
                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {savingProfile ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </form>
        )}

        {/* 2. PREFERENCES TAB */}
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="15">Every 15 Seconds</option>
                  <option value="30">Every 30 Seconds (Default)</option>
                  <option value="60">Every 60 Seconds</option>
                  <option value="0">Manual Refresh Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Default Landing Page</label>
                <select
                  value={preferences.defaultLandingPage}
                  onChange={(e) => setPreferences({ ...preferences, defaultLandingPage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="/dashboard">Executive Dashboard</option>
                  <option value="/executive-decision-center">Executive Decision Center</option>
                  <option value="/business-intelligence">Franchise Intelligence</option>
                  <option value="/outlet-performance">Outlet Performance Agent</option>
                  <option value="/audit">AI Audit Agent</option>
                  <option value="/inventory">Inventory Agent</option>
                  <option value="/staff">Staff Agent</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">UI Color Theme Mode</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setDark(true)}
                    className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      dark
                        ? "bg-slate-800 border-blue-500 text-white shadow-md"
                        : "bg-slate-100 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Moon size={16} className="text-amber-400" /> Dark Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setDark(false)}
                    className={`flex-1 p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      !dark
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    <Sun size={16} className="text-amber-500" /> Light Mode
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetPreferences}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
              >
                <RotateCcw size={14} /> Reset Defaults
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
              >
                <Save size={15} /> Save Application Preferences
              </button>
            </div>
          </form>
        )}

        {/* 3. NOTIFICATION PREFERENCES TAB */}
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
                <div key={item.key} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
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

        {/* 4. SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Password Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage director authentication password using bcrypt hash validation.</p>
            </div>

            {passwordError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertTriangle size={15} />
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {changingPassword ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
                {changingPassword ? "Updating Password..." : "Update Security Password"}
              </button>
            </form>
          </div>
        )}

        {/* 5. API CONFIG TAB */}
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
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
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
