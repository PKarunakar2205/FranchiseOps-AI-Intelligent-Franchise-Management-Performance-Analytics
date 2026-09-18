const prisma = require("../config/prisma");
const { sendEmail } = require("./emailService");
const { sendSMS } = require("./smsService");

/**
 * Log an audit entry into notification_audits table
 */
async function logAuditTrail({ notification_id, action_plan_id, event, actor = "System", details }) {
  try {
    return await prisma.notificationAudit.create({
      data: {
        notification_id: notification_id ? Number(notification_id) : null,
        action_plan_id: action_plan_id ? Number(action_plan_id) : null,
        event,
        actor,
        details: typeof details === "object" ? JSON.stringify(details) : String(details),
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error("[NOTIFICATION AUDIT LOG ERROR]:", err.message);
  }
}

/**
 * Get filtered notifications list
 */
async function getNotifications(filters = {}) {
  const where = {};

  if (filters.priority && filters.priority !== "All") {
    where.priority = filters.priority;
  }
  if (filters.status && filters.status !== "All") {
    where.status = filters.status;
  }
  if (filters.channel && filters.channel !== "All") {
    where.channel = filters.channel;
  }
  if (filters.eventType && filters.eventType !== "All") {
    where.event_type = filters.eventType;
  }
  if (filters.outlet_id) {
    where.outlet_id = Number(filters.outlet_id);
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { message: { contains: filters.search, mode: "insensitive" } },
      { outlet_name: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      outlet: {
        select: { outlet_id: true, outlet_name: true, region: true, manager_name: true, owner_name: true },
      },
      recipient: {
        select: { user_id: true, full_name: true, email: true, role: true },
      },
      escalations: {
        orderBy: { timestamp: "asc" },
      },
      action_plans: true,
    },
  });

  return notifications;
}

/**
 * Get notification by ID with full relations & audit trail
 */
async function getNotificationById(id) {
  const notificationId = Number(id);
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: {
      outlet: true,
      recipient: true,
      escalations: true,
      action_plans: {
        include: { tasks: true },
      },
    },
  });

  if (!notification) return null;

  const auditTrail = await prisma.notificationAudit.findMany({
    where: { notification_id: notificationId },
    orderBy: { timestamp: "asc" },
  });

  return { ...notification, auditTrail };
}

/**
 * Create a new notification
 */
async function createNotification(data) {
  const {
    title,
    message,
    eventType = "GENERAL",
    priority = "MEDIUM",
    channel = "IN_APP",
    outlet_id,
    outlet_name,
    recipient_id,
    recipient_role = "Outlet Manager",
    metadata,
    due_at,
  } = data;

  // Compute default SLA due_at if not provided
  let calculatedDueAt = due_at ? new Date(due_at) : new Date();
  if (!due_at) {
    const now = new Date();
    if (priority === "CRITICAL") now.setHours(now.getHours() + 1);
    else if (priority === "HIGH") now.setHours(now.getHours() + 6);
    else if (priority === "MEDIUM") now.setHours(now.getHours() + 24);
    else now.setHours(now.getHours() + 48);
    calculatedDueAt = now;
  }

  // Resolve outlet name if outlet_id is provided
  let finalOutletName = outlet_name;
  if (outlet_id && !finalOutletName) {
    const outletObj = await prisma.outlet.findUnique({ where: { outlet_id: Number(outlet_id) } });
    if (outletObj) finalOutletName = outletObj.outlet_name;
  }

  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      event_type: eventType,
      priority,
      channel,
      outlet_id: outlet_id ? Number(outlet_id) : null,
      outlet_name: finalOutletName || "All Franchise Network",
      recipient_id: recipient_id ? Number(recipient_id) : null,
      recipient_role: recipient_role || "Outlet Manager",
      status: "SENT",
      due_at: calculatedDueAt,
      metadata: typeof metadata === "object" ? JSON.stringify(metadata) : metadata,
    },
  });

  // Log audit
  await logAuditTrail({
    notification_id: notification.id,
    event: "NOTIFICATION_CREATED",
    actor: "System Engine",
    details: `Notification created via ${channel} channel for outlet '${finalOutletName || "Global"}' with priority ${priority}`,
  });

  // Multi-channel dispatch abstractions
  if (channel === "EMAIL" || priority === "CRITICAL" || priority === "HIGH") {
    await sendEmail({
      to: "regional-manager@franchiseops.ai",
      subject: `[${priority}] ${title}`,
      text: message,
      html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #4f46e5;">FranchiseOps AI Telemetry Notification</h2>
        <p><strong>Priority:</strong> ${priority}</p>
        <p><strong>Outlet:</strong> ${finalOutletName || "All Outlets"}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>SLA Deadline:</strong> ${calculatedDueAt.toISOString()}</p>
      </div>`,
    });
  }

  if (channel === "SMS" || priority === "CRITICAL") {
    await sendSMS({
      phone: "+919876543210",
      message: `[FranchiseOps AI Alert] ${priority}: ${title} - ${message.substring(0, 100)}`,
    });
  }

  return notification;
}

/**
 * Acknowledge notification
 */
async function acknowledgeNotification(id, actorName = "Store Manager") {
  const notificationId = Number(id);
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      acknowledged: true,
      acknowledged_at: new Date(),
      status: "ACKNOWLEDGED",
    },
  });

  await logAuditTrail({
    notification_id: notificationId,
    event: "NOTIFICATION_ACKNOWLEDGED",
    actor: actorName,
    details: `Notification acknowledged by ${actorName} at ${new Date().toISOString()}`,
  });

  return updated;
}

/**
 * Mark notification read
 */
async function readNotification(id) {
  const notificationId = Number(id);
  const existing = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!existing) return null;

  const newStatus = existing.status === "NEW" || existing.status === "SENT" ? "DELIVERED" : existing.status;

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { status: newStatus },
  });

  await logAuditTrail({
    notification_id: notificationId,
    event: "NOTIFICATION_READ",
    actor: "User",
    details: `Notification marked as read/opened`,
  });

  return updated;
}

/**
 * Resolve notification
 */
async function resolveNotification(id, actorName = "Regional Operations Manager") {
  const notificationId = Number(id);
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      status: "RESOLVED",
      resolved_at: new Date(),
    },
  });

  await logAuditTrail({
    notification_id: notificationId,
    event: "NOTIFICATION_RESOLVED",
    actor: actorName,
    details: `Issue marked as RESOLVED by ${actorName}`,
  });

  return updated;
}

/**
 * Escalate notification
 */
async function escalateNotification(id, reason = "SLA Breach / No Acknowledgement", actorName = "Workflow Engine") {
  const notificationId = Number(id);
  const currentNotif = await prisma.notification.findUnique({ where: { id: notificationId } });

  if (!currentNotif) throw new Error("Notification not found");

  const newLevel = (currentNotif.escalation_level || 0) + 1;
  const previousOwner = currentNotif.recipient_role || "Outlet Manager";
  const escalatedTo = newLevel === 1 ? "Outlet Manager" : newLevel === 2 ? "Regional Manager" : "VP of Operations";

  // Create escalation record
  const escalation = await prisma.notificationEscalation.create({
    data: {
      notification_id: notificationId,
      escalation_level: newLevel,
      previous_owner: previousOwner,
      escalated_to: escalatedTo,
      reason,
      status: "ESCALATED",
      timestamp: new Date(),
    },
  });

  // Update notification record
  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      status: "ESCALATED",
      escalation_level: newLevel,
      recipient_role: escalatedTo,
      escalated_at: new Date(),
    },
  });

  await logAuditTrail({
    notification_id: notificationId,
    event: "NOTIFICATION_ESCALATED",
    actor: actorName,
    details: `Escalated to Level ${newLevel} (${escalatedTo}). Reason: ${reason}`,
  });

  return { notification: updated, escalation };
}

/**
 * Delete notification
 */
async function deleteNotification(id) {
  const notificationId = Number(id);
  return await prisma.notification.delete({ where: { id: notificationId } });
}

/**
 * Get Action Plans list
 */
async function getActionPlans(filters = {}) {
  const where = {};
  if (filters.status && filters.status !== "All") {
    where.status = filters.status;
  }
  if (filters.priority && filters.priority !== "All") {
    where.priority = filters.priority;
  }
  if (filters.outlet_id) {
    where.outlet_id = Number(filters.outlet_id);
  }

  return await prisma.actionPlan.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: {
      tasks: { orderBy: { created_at: "asc" } },
      source_notification: true,
      outlet: { select: { outlet_id: true, outlet_name: true, region: true } },
      owner: { select: { user_id: true, full_name: true, role: true } },
    },
  });
}

/**
 * Get Action Plan by ID
 */
async function getActionPlanById(id) {
  const actionPlanId = Number(id);
  const plan = await prisma.actionPlan.findUnique({
    where: { id: actionPlanId },
    include: {
      tasks: true,
      source_notification: true,
      outlet: true,
      owner: true,
    },
  });

  if (!plan) return null;

  const auditTrail = await prisma.notificationAudit.findMany({
    where: { action_plan_id: actionPlanId },
    orderBy: { timestamp: "asc" },
  });

  return { ...plan, auditTrail };
}

/**
 * Create Action Plan
 */
async function createActionPlan(data) {
  const {
    title,
    description,
    source_notification_id,
    outlet_id,
    outlet_name,
    priority = "MEDIUM",
    owner_id,
    owner_name = "Regional Operations Lead",
    due_date,
    tasks = [],
  } = data;

  let finalOutletName = outlet_name;
  if (outlet_id && !finalOutletName) {
    const o = await prisma.outlet.findUnique({ where: { outlet_id: Number(outlet_id) } });
    if (o) finalOutletName = o.outlet_name;
  }

  const actionPlan = await prisma.actionPlan.create({
    data: {
      title,
      description,
      source_notification_id: source_notification_id ? Number(source_notification_id) : null,
      outlet_id: outlet_id ? Number(outlet_id) : null,
      outlet_name: finalOutletName || "All Outlets",
      priority,
      owner_id: owner_id ? Number(owner_id) : null,
      owner_name,
      status: "OPEN",
      progress: 0,
      due_date: due_date ? new Date(due_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tasks: {
        create: tasks.map((t) => ({
          title: t.title,
          description: t.description || "",
          assigned_to: t.assigned_to || owner_name,
          due_date: t.due_date ? new Date(t.due_date) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "PENDING",
        })),
      },
    },
    include: { tasks: true },
  });

  // If created from a notification, update notification status
  if (source_notification_id) {
    await prisma.notification.update({
      where: { id: Number(source_notification_id) },
      data: { status: "IN_PROGRESS" },
    }).catch(() => {});
  }

  await logAuditTrail({
    action_plan_id: actionPlan.id,
    notification_id: source_notification_id ? Number(source_notification_id) : null,
    event: "ACTION_PLAN_CREATED",
    actor: owner_name,
    details: `Action Plan '${title}' created for outlet ${finalOutletName || "Global"} with ${tasks.length} tasks`,
  });

  return actionPlan;
}

/**
 * Update Action Plan
 */
async function updateActionPlan(id, updateData) {
  const actionPlanId = Number(id);
  const { status, progress, owner_name, due_date } = updateData;

  const data = {};
  if (status) data.status = status;
  if (typeof progress === "number") data.progress = progress;
  if (owner_name) data.owner_name = owner_name;
  if (due_date) data.due_date = new Date(due_date);

  if (status === "COMPLETED") data.completed_at = new Date();
  if (status === "VERIFIED" || status === "CLOSED") {
    data.verified_at = new Date();
    data.status = status;
  }

  const updated = await prisma.actionPlan.update({
    where: { id: actionPlanId },
    data,
    include: { tasks: true },
  });

  await logAuditTrail({
    action_plan_id: actionPlanId,
    event: `ACTION_PLAN_${status || "UPDATED"}`,
    actor: owner_name || "User",
    details: `Action Plan status changed to ${updated.status} (Progress: ${updated.progress}%)`,
  });

  return updated;
}

/**
 * Add Task to Action Plan
 */
async function createActionPlanTask(actionPlanId, taskData) {
  const planId = Number(actionPlanId);
  const task = await prisma.actionPlanTask.create({
    data: {
      action_plan_id: planId,
      title: taskData.title,
      description: taskData.description || "",
      assigned_to: taskData.assigned_to || "Store Staff",
      due_date: taskData.due_date ? new Date(taskData.due_date) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "PENDING",
    },
  });

  await recalculateActionPlanProgress(planId);

  await logAuditTrail({
    action_plan_id: planId,
    event: "TASK_CREATED",
    actor: taskData.assigned_to || "Manager",
    details: `New task '${taskData.title}' assigned to ${task.assigned_to}`,
  });

  return task;
}

/**
 * Update Action Plan Task
 */
async function updateActionPlanTask(taskId, taskData) {
  const id = Number(taskId);
  const { status, comments, assigned_to } = taskData;

  const data = {};
  if (status) data.status = status;
  if (comments) data.comments = comments;
  if (assigned_to) data.assigned_to = assigned_to;
  if (status === "COMPLETED") data.completed_at = new Date();

  const task = await prisma.actionPlanTask.update({
    where: { id },
    data,
  });

  await recalculateActionPlanProgress(task.action_plan_id);

  await logAuditTrail({
    action_plan_id: task.action_plan_id,
    event: "TASK_UPDATED",
    actor: assigned_to || "Staff",
    details: `Task '${task.title}' updated to ${task.status}`,
  });

  return task;
}

/**
 * Recalculate progress of parent Action Plan based on completed tasks
 */
async function recalculateActionPlanProgress(actionPlanId) {
  const planId = Number(actionPlanId);
  const tasks = await prisma.actionPlanTask.findMany({ where: { action_plan_id: planId } });

  if (tasks.length === 0) return;

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  let newStatus = "IN_PROGRESS";
  if (progressPct === 100) newStatus = "COMPLETED";

  await prisma.actionPlan.update({
    where: { id: planId },
    data: { progress: progressPct, status: newStatus },
  });
}

/**
 * Compute Notification & Workflow Dashboard Analytics
 */
async function getNotificationAnalytics() {
  const allNotifications = await prisma.notification.findMany({
    orderBy: { created_at: "desc" },
    include: { outlet: true, escalations: true },
  });

  const totalSent = allNotifications.length;
  const acknowledgedCount = allNotifications.filter((n) => n.acknowledged || n.status === "ACKNOWLEDGED").length;
  const ackRate = totalSent > 0 ? ((acknowledgedCount / totalSent) * 100).toFixed(1) : 0;

  const openActionPlans = await prisma.actionPlan.count({
    where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
  });

  const now = new Date();
  const slaBreaches = allNotifications.filter(
    (n) => n.due_at && new Date(n.due_at) < now && !n.acknowledged && n.status !== "RESOLVED" && n.status !== "CLOSED"
  ).length;

  // Compute average resolution time in hours
  const resolvedNotifs = allNotifications.filter((n) => n.resolved_at && n.created_at);
  let totalResolutionHours = 0;
  resolvedNotifs.forEach((n) => {
    const diffMs = new Date(n.resolved_at) - new Date(n.created_at);
    totalResolutionHours += diffMs / (1000 * 60 * 60);
  });
  const avgResolutionTimeHours =
    resolvedNotifs.length > 0 ? (totalResolutionHours / resolvedNotifs.length).toFixed(1) : "2.4";

  // Channel distribution
  const byChannel = [
    { channel: "In-App", count: allNotifications.filter((n) => n.channel === "IN_APP").length },
    { channel: "Email", count: allNotifications.filter((n) => n.channel === "EMAIL").length },
    { channel: "SMS", count: allNotifications.filter((n) => n.channel === "SMS").length },
  ];

  // Priority distribution
  const byPriority = [
    { priority: "Low", count: allNotifications.filter((n) => n.priority === "LOW").length },
    { priority: "Medium", count: allNotifications.filter((n) => n.priority === "MEDIUM").length },
    { priority: "High", count: allNotifications.filter((n) => n.priority === "HIGH").length },
    { priority: "Critical", count: allNotifications.filter((n) => n.priority === "CRITICAL").length },
  ];

  // Status breakdown
  const byStatus = [
    { status: "Sent", count: allNotifications.filter((n) => n.status === "SENT" || n.status === "NEW").length },
    { status: "Acknowledged", count: allNotifications.filter((n) => n.status === "ACKNOWLEDGED").length },
    { status: "In Progress", count: allNotifications.filter((n) => n.status === "IN_PROGRESS").length },
    { status: "Escalated", count: allNotifications.filter((n) => n.status === "ESCALATED").length },
    { status: "Resolved", count: allNotifications.filter((n) => n.status === "RESOLVED").length },
  ];

  // Escalation Queue
  const escalationQueue = allNotifications
    .filter((n) => n.status === "ESCALATED" || n.escalation_level > 0)
    .map((n) => ({
      notificationId: n.id,
      title: n.title,
      outletName: n.outlet_name || "Franchise Store",
      escalationLevel: n.escalation_level,
      currentOwner: n.recipient_role || "Regional Manager",
      timePendingHours: (((now - new Date(n.created_at)) / (1000 * 60 * 60)).toFixed(1)) + " hrs",
      nextEscalation: n.escalation_level >= 2 ? "VP of Operations" : "Regional Manager",
      status: n.status,
    }));

  // Open Action Plans summary
  const actionPlansList = await prisma.actionPlan.findMany({
    take: 10,
    orderBy: { created_at: "desc" },
    include: { tasks: true },
  });

  return {
    kpis: {
      totalSent,
      ackRate: Number(ackRate),
      openActions: openActionPlans,
      slaBreaches,
      avgResolutionTimeHours: Number(avgResolutionTimeHours),
    },
    byChannel,
    byPriority,
    byStatus,
    escalationQueue,
    actionPlansList,
    recentNotifications: allNotifications.slice(0, 15),
  };
}

module.exports = {
  logAuditTrail,
  getNotifications,
  getNotificationById,
  createNotification,
  acknowledgeNotification,
  readNotification,
  resolveNotification,
  escalateNotification,
  deleteNotification,
  getActionPlans,
  getActionPlanById,
  createActionPlan,
  updateActionPlan,
  createActionPlanTask,
  updateActionPlanTask,
  getNotificationAnalytics,
};
