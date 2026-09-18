const sanitizeUrl = (url) => {
  if (!url || typeof url !== "string") return "http://localhost:5000/api";
  let clean = url.trim().replace(/\/+$/, "");
  if (!clean.endsWith("/api")) {
    clean += "/api";
  }
  return clean;
};

export const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.__API_URL__) {
    return sanitizeUrl(window.__API_URL__);
  }

  const viteEnvUrl = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL;
  if (viteEnvUrl && typeof viteEnvUrl === "string" && viteEnvUrl.trim().length > 0) {
    return sanitizeUrl(viteEnvUrl);
  }

  if (typeof localStorage !== "undefined") {
    try {
      const savedSettings = localStorage.getItem("franchise_settings_api");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed && parsed.apiUrl && typeof parsed.apiUrl === "string") {
          const customUrl = parsed.apiUrl.trim();
          const isLocallyHosted = typeof window !== "undefined" && (
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname === "0.0.0.0"
          );
          if (isLocallyHosted || !customUrl.includes("localhost")) {
            return sanitizeUrl(customUrl);
          }
        }
      }
    } catch (e) {}
  }

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
      return "http://localhost:5000/api";
    }
    return sanitizeUrl(`${origin}/api`);
  }

  return "http://localhost:5000/api";
};

export const BASE_URL = getApiBaseUrl();

export const getToken = () => {
  if (typeof localStorage === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const getUser = () => {
  try {
    if (typeof localStorage === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (typeof localStorage === "undefined") return;
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = () => {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const apiFetch = async (endpoint, options = {}) => {
  const currentBaseUrl = getApiBaseUrl();
  let token = getToken();

  // If no valid token is present in localStorage, perform silent auth login with standard admin credentials
  if (!token && !endpoint.includes("/auth/")) {
    try {
      const loginRes = await fetch(`${currentBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@franchiseops.ai",
          password: "password123",
        }),
      });
      if (loginRes.ok) {
        const authData = await loginRes.json();
        if (authData && authData.token) {
          setAuthData(authData.token, authData.user);
          token = authData.token;
        }
      }
    } catch (e) {
      // Fallthrough to fetch
    }
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${currentBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const getDashboardSummary = (period = "30D", region = "All", search = "") => {
  const query = new URLSearchParams();
  if (period) query.append("period", period);
  if (region) query.append("region", region);
  if (search) query.append("search", search);
  return apiFetch(`/dashboard/summary?${query.toString()}`);
};

// ==========================================
// FRANCHISE INTELLIGENCE ENGINE API METHODS
// ==========================================

export const getFranchiseIntelligence = () => apiFetch("/intelligence/summary");
export const getExecutiveInsights = () => apiFetch("/intelligence/executive");
export const getOutletIntelligence = (id) => apiFetch(id ? `/intelligence/outlets/${id}` : "/intelligence/outlets");
export const getAuditIntelligence = () => apiFetch("/intelligence/audit");
export const getInventoryIntelligence = () => apiFetch("/intelligence/inventory");
export const getStaffIntelligence = () => apiFetch("/intelligence/staff");
export const getMarketingIntelligence = () => apiFetch("/intelligence/marketing");
export const getSalesIntelligence = () => apiFetch("/intelligence/sales");
export const getCrossModuleIntelligence = () => apiFetch("/intelligence/cross-module");
export const getOperationalAlerts = () => apiFetch("/intelligence/alerts");
export const generateSmartAlerts = () =>
  apiFetch("/intelligence/generate-alerts", {
    method: "POST",
  });
export const markAlertAsReadApi = (id) =>
  apiFetch(`/intelligence/alerts/${id}/read`, {
    method: "PUT",
  });
export const markAllAlertsAsReadApi = () =>
  apiFetch("/intelligence/alerts/read-all", {
    method: "PUT",
  });
export const deleteAlertApi = (id) =>
  apiFetch(`/intelligence/alerts/${id}`, {
    method: "DELETE",
  });
export const queryAiAssistant = (prompt) =>
  apiFetch("/intelligence/assistant", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

// ==========================================
// NOTIFICATION & WORKFLOW MODULE API METHODS
// ==========================================

export const getNotificationsApi = (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.priority) query.append("priority", filters.priority);
  if (filters.status) query.append("status", filters.status);
  if (filters.channel) query.append("channel", filters.channel);
  if (filters.eventType) query.append("eventType", filters.eventType);
  if (filters.outlet_id) query.append("outlet_id", filters.outlet_id);
  if (filters.search) query.append("search", filters.search);
  return apiFetch(`/notifications?${query.toString()}`);
};

export const getNotificationByIdApi = (id) => apiFetch(`/notifications/${id}`);

export const createNotificationApi = (data) =>
  apiFetch("/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const acknowledgeNotificationApi = (id, actorName) =>
  apiFetch(`/notifications/${id}/acknowledge`, {
    method: "PATCH",
    body: JSON.stringify({ actorName }),
  });

export const resolveNotificationApi = (id, actorName) =>
  apiFetch(`/notifications/${id}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ actorName }),
  });

export const escalateNotificationApi = (id, reason, actorName) =>
  apiFetch(`/notifications/${id}/escalate`, {
    method: "PATCH",
    body: JSON.stringify({ reason, actorName }),
  });

export const deleteNotificationApi = (id) =>
  apiFetch(`/notifications/${id}`, {
    method: "DELETE",
  });

export const getNotificationAnalyticsApi = () => apiFetch("/notifications/analytics");

export const triggerWorkflowEngineApi = () =>
  apiFetch("/notifications/trigger-engine", {
    method: "POST",
  });

export const getActionPlansApi = (filters = {}) => {
  const query = new URLSearchParams();
  if (filters.status) query.append("status", filters.status);
  if (filters.priority) query.append("priority", filters.priority);
  if (filters.outlet_id) query.append("outlet_id", filters.outlet_id);
  return apiFetch(`/notifications/action-plans?${query.toString()}`);
};

export const getActionPlanByIdApi = (id) => apiFetch(`/notifications/action-plans/${id}`);

export const createActionPlanApi = (data) =>
  apiFetch("/notifications/action-plans", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateActionPlanApi = (id, data) =>
  apiFetch(`/notifications/action-plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const createActionPlanTaskApi = (actionPlanId, taskData) =>
  apiFetch(`/notifications/action-plans/${actionPlanId}/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });

export const updateActionPlanTaskApi = (taskId, taskData) =>
  apiFetch(`/notifications/action-plans/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(taskData),
  });

export const getExecutiveDecisionCenterApi = (params = {}) => {
  const query = new URLSearchParams();
  if (params.region) query.append("region", params.region);
  if (params.outletId) query.append("outletId", params.outletId);
  if (params.riskLevel) query.append("riskLevel", params.riskLevel);
  if (params.dateRange) query.append("dateRange", params.dateRange);
  return apiFetch(`/dashboard/executive-decision-center?${query.toString()}`);
};

export const updateUserProfileApi = (data) =>
  apiFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const changePasswordApi = (data) =>
  apiFetch("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });




