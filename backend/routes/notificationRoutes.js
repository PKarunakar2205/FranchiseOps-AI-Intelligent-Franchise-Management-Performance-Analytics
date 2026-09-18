const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// Notification Analytics & Dashboard
router.get("/analytics", controller.getNotificationAnalytics);

// Trigger Notification Rule Engine
router.post("/trigger-engine", controller.triggerWorkflowEngine);

// Action Plans Routes
router.get("/action-plans", controller.getActionPlans);
router.post("/action-plans", controller.createActionPlan);
router.get("/action-plans/:id", controller.getActionPlanById);
router.patch("/action-plans/:id", controller.updateActionPlan);
router.post("/action-plans/:id/tasks", controller.createActionPlanTask);
router.patch("/action-plans/tasks/:taskId", controller.updateActionPlanTask);

// Main Notifications Routes
router.get("/", controller.getNotifications);
router.post("/", controller.createNotification);
router.get("/:id", controller.getNotificationById);
router.patch("/:id/acknowledge", controller.acknowledgeNotification);
router.patch("/:id/read", controller.readNotification);
router.patch("/:id/resolve", controller.resolveNotification);
router.patch("/:id/escalate", controller.escalateNotification);
router.delete("/:id", controller.deleteNotification);

module.exports = router;
