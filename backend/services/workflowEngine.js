const prisma = require("../config/prisma");
const { createNotification, escalateNotification } = require("./notificationServices");

/**
 * 1. Rule Engine: Scans live project database telemetry & generates notifications
 */
async function evaluateWorkflowRules() {
  const generated = [];

  try {
    // Rule A: Inventory Stock Shortages
    const lowStockItems = await prisma.inventory.findMany({
      where: {
        OR: [
          { current_stock: { lte: 20 } },
          { status: "Low Stock" },
          { status: "Critical" },
        ],
      },
      include: { outlet: true },
      take: 5,
    });

    for (const item of lowStockItems) {
      const outletName = item.outlet ? item.outlet.outlet_name : "Franchise Store";
      const isCritical = (item.current_stock || 0) <= 5;
      const priority = isCritical ? "CRITICAL" : "HIGH";

      // Prevent duplicate creation within last 24h
      const existing = await prisma.notification.findFirst({
        where: {
          event_type: "INVENTORY_LOW",
          outlet_id: item.outlet_id,
          title: { contains: item.product_name || "Stock" },
          created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (!existing) {
        const notif = await createNotification({
          title: `Low Stock Alert — ${item.product_name || "Raw Material"}`,
          message: `Stock level for '${item.product_name || "Item"}' at ${outletName} dropped to ${item.current_stock || 0} units (threshold: ${item.reorder_level || 20}). Immediate reorder required.`,
          eventType: "INVENTORY_LOW",
          priority,
          channel: isCritical ? "SMS" : "IN_APP",
          outlet_id: item.outlet_id,
          outlet_name: outletName,
          recipient_role: "Inventory Manager",
          metadata: { inventory_id: item.inventory_id, current_stock: item.current_stock },
        });
        generated.push(notif);
      }
    }

    // Rule B: Audit Compliance Failures
    const failedAudits = await prisma.audit.findMany({
      where: { score: { lt: 75 } },
      include: { outlet: true },
      take: 5,
    });

    for (const audit of failedAudits) {
      const outletName = audit.outlet ? audit.outlet.outlet_name : "Franchise Center";
      const isCritical = (audit.score || 0) < 60;
      const priority = isCritical ? "CRITICAL" : "HIGH";

      const existing = await prisma.notification.findFirst({
        where: {
          event_type: "AUDIT_FAILURE",
          outlet_id: audit.outlet_id,
          created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (!existing) {
        const notif = await createNotification({
          title: `Audit Hygiene Compliance Flag — ${outletName}`,
          message: `Audit conducted on ${audit.audit_date ? String(audit.audit_date).split("T")[0] : "recently"} recorded a compliance score of ${audit.score}%. Remarks: ${audit.remarks || "Multiple hygiene flags identified."}`,
          eventType: "AUDIT_FAILURE",
          priority,
          channel: "EMAIL",
          outlet_id: audit.outlet_id,
          outlet_name: outletName,
          recipient_role: "Audit Compliance Officer",
          metadata: { audit_id: audit.audit_id, score: audit.score },
        });
        generated.push(notif);
      }
    }

    // Rule C: Swift Leave Approval Pending
    const pendingLeaves = await prisma.swiftLeave.findMany({
      where: { status: { contains: "Pending" } },
      include: { outlet: true, applicant: true },
      take: 3,
    });

    for (const leave of pendingLeaves) {
      const outletName = leave.outlet ? leave.outlet.outlet_name : "Franchise Store";
      const applicantName = leave.applicant ? leave.applicant.staff_name : "Staff Member";

      const existing = await prisma.notification.findFirst({
        where: {
          event_type: "LEAVE_APPROVAL_PENDING",
          outlet_id: leave.outlet_id,
          metadata: { contains: `leave_id":${leave.leave_id}` },
        },
      });

      if (!existing) {
        const notif = await createNotification({
          title: `Staff Swift Leave Approval Required — ${applicantName}`,
          message: `${applicantName} submitted a ${leave.leave_type} request for ${leave.total_days} days (${leave.reason}). AI recommendation: ${leave.replacement_suggested || "Review schedule"}.`,
          eventType: "LEAVE_APPROVAL_PENDING",
          priority: "MEDIUM",
          channel: "IN_APP",
          outlet_id: leave.outlet_id,
          outlet_name: outletName,
          recipient_role: "Outlet Manager",
          metadata: { leave_id: leave.leave_id, leave_code: leave.leave_code },
        });
        generated.push(notif);
      }
    }

    // Rule D: Underperforming Outlet Performance Health Risk
    const riskOutlets = await prisma.outlet.findMany({
      where: { health: { lt: 70 } },
      take: 3,
    });

    for (const out of riskOutlets) {
      const existing = await prisma.notification.findFirst({
        where: {
          event_type: "OUTLET_HEALTH_RISK",
          outlet_id: out.outlet_id,
          created_at: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        },
      });

      if (!existing) {
        const notif = await createNotification({
          title: `Outlet Performance Health Drop — ${out.outlet_name}`,
          message: `${out.outlet_name} health score dropped to ${out.health}/100. Growth rate is ${out.growth}%. Regional management action plan recommended.`,
          eventType: "OUTLET_HEALTH_RISK",
          priority: "HIGH",
          channel: "IN_APP",
          outlet_id: out.outlet_id,
          outlet_name: out.outlet_name,
          recipient_role: "Regional Manager",
          metadata: { outlet_id: out.outlet_id, health: out.health },
        });
        generated.push(notif);
      }
    }

    console.log(`[WORKFLOW RULE ENGINE] Evaluated rules cleanly. ${generated.length} new operational notifications generated.`);
    return { success: true, count: generated.length, notifications: generated };
  } catch (err) {
    console.error("[WORKFLOW RULE ENGINE ERROR]:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. SLA Escalation Checker: Auto-escalates unacknowledged notifications past SLA deadline
 */
async function processSLAEscalations() {
  try {
    const now = new Date();
    const expiredNotifications = await prisma.notification.findMany({
      where: {
        acknowledged: false,
        status: { in: ["NEW", "SENT", "DELIVERED"] },
        due_at: { lte: now },
        escalation_level: { lt: 3 }, // Limit max escalation to level 3
      },
      include: { outlet: true },
    });

    if (expiredNotifications.length === 0) {
      return { count: 0 };
    }

    console.log(`[SLA ESCALATION WORKER] Found ${expiredNotifications.length} notifications breaching SLA deadlines.`);

    const escalatedResults = [];
    for (const notif of expiredNotifications) {
      const nextLevel = notif.escalation_level + 1;
      const targetRole = nextLevel === 1 ? "Outlet Manager" : nextLevel === 2 ? "Regional Manager" : "VP of Operations";
      const reason = `Automated SLA Breach: Unacknowledged after SLA deadline (${notif.due_at.toISOString()})`;

      const result = await escalateNotification(notif.id, reason, "SLA Escalation Daemon");
      escalatedResults.push(result);
    }

    return { count: escalatedResults.length, items: escalatedResults };
  } catch (err) {
    console.error("[SLA ESCALATION WORKER ERROR]:", err.message);
    return { count: 0, error: err.message };
  }
}

/**
 * 3. Background Daemon: Starts periodic internal SLA checker interval inside Node.js Express server
 */
let daemonTimer = null;
function startWorkflowDaemon(intervalMs = 60000) {
  if (daemonTimer) return;
  console.log(`[WORKFLOW DAEMON] Internal SLA Escalation worker started (checking every ${intervalMs / 1000}s)...`);

  daemonTimer = setInterval(async () => {
    try {
      await processSLAEscalations();
    } catch (e) {
      console.error("[WORKFLOW DAEMON CYCLE ERROR]:", e.message);
    }
  }, intervalMs);
}

module.exports = {
  evaluateWorkflowRules,
  processSLAEscalations,
  startWorkflowDaemon,
};
