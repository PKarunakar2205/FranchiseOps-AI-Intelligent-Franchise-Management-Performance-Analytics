import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OutletPerformanceAgent from "./OutletPerformanceAgent";
import InventoryAgent from "./pages/InventoryAgent";
import MarketingAgent from "./pages/MarketingAgent";
import StaffAgent from "./pages/StaffAgent";
import AuditAgent from "./pages/AuditAgent";
import IntelligenceAgent from "./pages/IntelligenceAgent";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import ExecutiveDecisionCenter from "./pages/ExecutiveDecisionCenter";
import ReportsView from "./components/dashboard/ReportsView";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) {
    return saved === "dark";
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function App() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage dark={dark} setDark={setDark} />} />
        <Route path="/signup" element={<SignUpPage dark={dark} setDark={setDark} />} />

        {/* COMMAND CENTER DASHBOARD ROUTES */}
        <Route
          path="/"
          element={
            <Layout dark={dark} setDark={setDark}>
              <ExecutiveDashboard dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout dark={dark} setDark={setDark}>
              <ExecutiveDashboard dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/executive-decision-center"
          element={
            <Layout dark={dark} setDark={setDark}>
              <ExecutiveDecisionCenter dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/outlet-performance"
          element={
            <Layout dark={dark} setDark={setDark}>
              <OutletPerformanceAgent embedded={true} dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/outlets"
          element={
            <Layout dark={dark} setDark={setDark}>
              <OutletPerformanceAgent embedded={true} dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/business-intelligence"
          element={
            <Layout dark={dark} setDark={setDark}>
              <IntelligenceAgent dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/intelligence"
          element={<Navigate to="/business-intelligence" replace />}
        />
        <Route
          path="/audit"
          element={
            <Layout dark={dark} setDark={setDark}>
              <AuditAgent dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/inventory"
          element={
            <Layout dark={dark} setDark={setDark}>
              <InventoryAgent dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/staff"
          element={
            <Layout dark={dark} setDark={setDark}>
              <StaffAgent dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/marketing"
          element={
            <Layout dark={dark} setDark={setDark}>
              <MarketingAgent dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout dark={dark} setDark={setDark}>
              <NotificationsPage dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/reports"
          element={
            <Layout dark={dark} setDark={setDark}>
              <ReportsView dark={dark} setDark={setDark} />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout dark={dark} setDark={setDark}>
              <SettingsPage dark={dark} setDark={setDark} />
            </Layout>
          }
        />

        {/* 404 FALLBACK */}
        <Route
          path="*"
          element={
            <Layout dark={dark} setDark={setDark}>
              <NotFoundPage dark={dark} setDark={setDark} />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;