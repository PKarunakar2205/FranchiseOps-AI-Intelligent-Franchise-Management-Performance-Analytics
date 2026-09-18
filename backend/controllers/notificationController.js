const notificationServices = require("../services/notificationServices");
const workflowEngine = require("../services/workflowEngine");

// GET /api/notifications
async function getNotifications(req, res) {
  try {
    const filters = {
      priority: req.query.priority,
      status: req.query.status,
      channel: req.query.channel,
      eventType: req.query.eventType,
      outlet_id: req.query.outlet_id,
      search: req.query.search,
    };
    const notifications = await notificationServices.getNotifications(filters);
    return res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    console.error("Error in getNotifications controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/notifications/analytics
async function getNotificationAnalytics(req, res) {
  try {
    const analytics = await notificationServices.getNotificationAnalytics();
    return res.json({ success: true, data: analytics });
  } catch (error) {
    console.error("Error in getNotificationAnalytics controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/notifications/:id
async function getNotificationById(req, res) {
  try {
    const notification = await notificationServices.getNotificationById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    return res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error in getNotificationById controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/notifications
async function createNotification(req, res) {
  try {
    const notification = await notificationServices.createNotification(req.body);
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error("Error in createNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/:id/acknowledge
async function acknowledgeNotification(req, res) {
  try {
    const actorName = req.body.actorName || req.user?.full_name || "Outlet Manager";
    const notification = await notificationServices.acknowledgeNotification(req.params.id, actorName);
    return res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error in acknowledgeNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/:id/read
async function readNotification(req, res) {
  try {
    const notification = await notificationServices.readNotification(req.params.id);
    return res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error in readNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/:id/resolve
async function resolveNotification(req, res) {
  try {
    const actorName = req.body.actorName || req.user?.full_name || "Regional Operations Lead";
    const notification = await notificationServices.resolveNotification(req.params.id, actorName);
    return res.json({ success: true, data: notification });
  } catch (error) {
    console.error("Error in resolveNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/:id/escalate
async function escalateNotification(req, res) {
  try {
    const reason = req.body.reason || "Manual Escalation Triggered";
    const actorName = req.body.actorName || req.user?.full_name || "Manager";
    const result = await notificationServices.escalateNotification(req.params.id, reason, actorName);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in escalateNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// DELETE /api/notifications/:id
async function deleteNotification(req, res) {
  try {
    await notificationServices.deleteNotification(req.params.id);
    return res.json({ success: true, message: "Notification deleted cleanly" });
  } catch (error) {
    console.error("Error in deleteNotification controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/notifications/trigger-engine
async function triggerWorkflowEngine(req, res) {
  try {
    const result = await workflowEngine.evaluateWorkflowRules();
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in triggerWorkflowEngine controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// ==========================================
// ACTION PLAN CONTROLLERS
// ==========================================

// GET /api/notifications/action-plans
async function getActionPlans(req, res) {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      outlet_id: req.query.outlet_id,
    };
    const plans = await notificationServices.getActionPlans(filters);
    return res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    console.error("Error in getActionPlans controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/notifications/action-plans/:id
async function getActionPlanById(req, res) {
  try {
    const plan = await notificationServices.getActionPlanById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Action plan not found" });
    return res.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error in getActionPlanById controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/notifications/action-plans
async function createActionPlan(req, res) {
  try {
    const plan = await notificationServices.createActionPlan(req.body);
    return res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error("Error in createActionPlan controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/action-plans/:id
async function updateActionPlan(req, res) {
  try {
    const plan = await notificationServices.updateActionPlan(req.params.id, req.body);
    return res.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error in updateActionPlan controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/notifications/action-plans/:id/tasks
async function createActionPlanTask(req, res) {
  try {
    const task = await notificationServices.createActionPlanTask(req.params.id, req.body);
    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error("Error in createActionPlanTask controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PATCH /api/notifications/action-plans/tasks/:taskId
async function updateActionPlanTask(req, res) {
  try {
    const task = await notificationServices.updateActionPlanTask(req.params.taskId, req.body);
    return res.json({ success: true, data: task });
  } catch (error) {
    console.error("Error in updateActionPlanTask controller:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getNotifications,
  getNotificationAnalytics,
  getNotificationById,
  createNotification,
  acknowledgeNotification,
  readNotification,
  resolveNotification,
  escalateNotification,
  deleteNotification,
  triggerWorkflowEngine,
  getActionPlans,
  getActionPlanById,
  createActionPlan,
  updateActionPlan,
  createActionPlanTask,
  updateActionPlanTask,
};
