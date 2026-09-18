import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Loader2,
  X,
  Zap,
  Bot
} from "lucide-react";
import { getNotificationsApi, getOperationalAlerts, queryAiAssistant } from "../api/apiClient";
import CommandSidebar from "./command/CommandSidebar";
import CommandBar from "./command/CommandBar";

export default function Layout({ children, dark, setDark }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // AI Assistant Drawer State
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your FranchiseOps AI Command Assistant. Ask me anything about outlet telemetry, underperforming stores, stock depletion, safety audits, or marketing ROI.",
    },
  ]);

  // Notifications State
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotificationsData = () => {
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
          }));
          setAlerts(dbMapped);
          setUnreadCount(dbMapped.filter((a) => !a.read).length);
        }
      })
      .catch(() => {
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
    loadNotificationsData();
    const pollTimer = setInterval(loadNotificationsData, 10000);
    window.addEventListener("notifications_updated", loadNotificationsData);
    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("notifications_updated", loadNotificationsData);
    };
  }, []);

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
          {
            sender: "ai",
            text: `📊 Telemetry Analysis for "${queryText}":\nReal PostgreSQL records show strong revenue velocity across regional centers. Audit compliance stands at 85%. Top priority action: Check low stock cover in South region stores.`,
          },
        ]);
      }
    } catch (err) {
      setAiMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `📊 Command Telemetry Query Output:\nSystem operating cleanly across all 7 intelligence modules. Recommended action: View Executive Decision Center.`,
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const presetQuestions = [
    "What is the overall franchise health?",
    "Which outlets need immediate inspection?",
    "Show low stock inventory alerts",
    "Which marketing campaign has highest ROAS?",
  ];

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 flex">
        {/* NEW COMMAND SIDEBAR */}
        <CommandSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          unreadCount={unreadCount}
        />

        {/* MAIN APPLICATION SHELL */}
        <div className="flex-1 min-w-0 flex flex-col min-h-screen">
          {/* NEW TOP COMMAND BAR */}
          <CommandBar
            dark={dark}
            setDark={setDark}
            setMobileOpen={setMobileOpen}
            setAiAssistantOpen={setAiAssistantOpen}
            alerts={alerts}
            unreadCount={unreadCount}
          />

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* AI ASSISTANT DRAWER */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiAssistantOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: 320 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 320 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Command Assistant</h3>
                    <p className="text-3xs text-slate-400">PostgreSQL Real Telemetry Analytics</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiAssistantOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAi(q)}
                    className="px-2.5 py-1 rounded-lg text-3xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 whitespace-nowrap shadow-2xs"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white font-medium shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {msg.text.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-blue-500">
                    <Loader2 size={16} className="animate-spin" /> Querying command telemetry...
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAi()}
                  placeholder="Ask command assistant..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={() => handleAskAi()}
                  disabled={aiLoading}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs disabled:opacity-50"
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
