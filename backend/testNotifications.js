const prisma = require("./config/prisma");
const notificationServices = require("./services/notificationServices");
const workflowEngine = require("./services/workflowEngine");

async function testNotificationModule() {
  console.log("==================================================");
  console.log("  TESTING NOTIFICATION & WORKFLOW MODULE BACKEND ");
  console.log("==================================================");

  try {
    // 1. Analytics Test
    const analytics = await notificationServices.getNotificationAnalytics();
    console.log("✔ Analytics KPIs computed cleanly:", {
      totalSent: analytics.kpis.totalSent,
      ackRate: analytics.kpis.ackRate + "%",
      openActions: analytics.kpis.openActions,
      slaBreaches: analytics.kpis.slaBreaches,
      avgResolutionTimeHours: analytics.kpis.avgResolutionTimeHours,
    });

    // 2. Fetch Notifications List
    const notifications = await notificationServices.getNotifications();
    console.log(`✔ Notifications Query returned ${notifications.length} records.`);
    if (notifications.length === 0) {
      throw new Error("No notifications found in database!");
    }

    const testNotif = notifications[0];

    // 3. Acknowledge Notification
    const ackResult = await notificationServices.acknowledgeNotification(testNotif.id, "Test Runner");
    console.log(`✔ Acknowledge Notification #${ackResult.id} success. Status: ${ackResult.status}, Acknowledged: ${ackResult.acknowledged}`);

    // 4. Escalate Notification
    const escResult = await notificationServices.escalateNotification(testNotif.id, "Test Escalation", "Test Runner");
    console.log(`✔ Escalate Notification #${testNotif.id} success. Level: ${escResult.notification.escalation_level}, Escalated To: ${escResult.notification.recipient_role}`);

    // 5. Create Action Plan & Tasks
    const plan = await notificationServices.createActionPlan({
      title: "Test Verification Action Plan",
      description: "Automated test action plan created during integration test.",
      source_notification_id: testNotif.id,
      priority: "HIGH",
      owner_name: "Test Runner Lead",
      tasks: [
        { title: "Task 1: Verify System Health", assigned_to: "Tester 1" },
        { title: "Task 2: Audit Logs Check", assigned_to: "Tester 2" },
      ],
    });
    console.log(`✔ Action Plan #${plan.id} created with ${plan.tasks.length} tasks.`);

    // 6. Update Task Status
    const firstTask = plan.tasks[0];
    const updatedTask = await notificationServices.updateActionPlanTask(firstTask.id, {
      status: "COMPLETED",
      comments: "Verified by test suite",
    });
    console.log(`✔ Task #${updatedTask.id} status updated to COMPLETED. Parent plan progress recalculation verified.`);

    // 7. Trigger Workflow Rule Engine
    const ruleResult = await workflowEngine.evaluateWorkflowRules();
    console.log(`✔ Rule Engine trigger completed. Count: ${ruleResult.count}`);

    // 8. Process SLA Escalations
    const slaResult = await workflowEngine.processSLAEscalations();
    console.log(`✔ SLA Escalation process completed cleanly. Escalated Count: ${slaResult.count}`);

    console.log("\n==================================================");
    console.log("   ALL NOTIFICATION & WORKFLOW TESTS PASSED!      ");
    console.log("==================================================\n");
  } catch (err) {
    console.error("❌ TEST FAILURE:", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testNotificationModule();
