const prisma = require("../config/prisma");

async function seedNotificationWorkflowData() {
  console.log("==================================================");
  console.log("   SEEDING NOTIFICATION & WORKFLOW DEMO TELEMETRY  ");
  console.log("==================================================");

  try {
    const outlets = await prisma.outlet.findMany({ take: 5 });
    const primaryOutlet = outlets[0] || { outlet_id: 1, outlet_name: "Chennai T. Nagar Flagship" };
    const secondaryOutlet = outlets[1] || { outlet_id: 2, outlet_name: "Bengaluru Indiranagar Hub" };
    const thirdOutlet = outlets[2] || { outlet_id: 3, outlet_name: "Mumbai Bandra West Store" };

    // Clear existing notification tables for clean seeding
    await prisma.notificationAudit.deleteMany({});
    await prisma.actionPlanTask.deleteMany({});
    await prisma.actionPlan.deleteMany({});
    await prisma.notificationEscalation.deleteMany({});
    await prisma.notification.deleteMany({});

    console.log("Cleaned existing notification records.");

    // 1. Create Notifications
    const n1 = await prisma.notification.create({
      data: {
        title: "Critical Cold Storage Temperature SLA Breach",
        message: "Cold Storage Unit #3 temperature rose to +8.5°C at Jubilee Hills store (safe limit: +2°C to +4°C). Immediate technician response required.",
        event_type: "AUDIT_FAILURE",
        priority: "CRITICAL",
        channel: "SMS",
        outlet_id: primaryOutlet.outlet_id,
        outlet_name: primaryOutlet.outlet_name,
        recipient_role: "Regional Operations Manager",
        status: "ESCALATED",
        acknowledged: false,
        due_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // Breached SLA 2h ago
        escalated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        escalation_level: 2,
      },
    });

    const n2 = await prisma.notification.create({
      data: {
        title: "Low Inventory Alert — Premium Cold Brew Beans",
        message: "Inventory stock cover for Premium Cold Brew Beans dropped to 12 kg (below reorder threshold of 25 kg) at T. Nagar store.",
        event_type: "INVENTORY_LOW",
        priority: "HIGH",
        channel: "IN_APP",
        outlet_id: primaryOutlet.outlet_id,
        outlet_name: primaryOutlet.outlet_name,
        recipient_role: "Store Inventory Manager",
        status: "ACKNOWLEDGED",
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
        due_at: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
    });

    const n3 = await prisma.notification.create({
      data: {
        title: "Staff Attendance & Shift Shortage Flag",
        message: "3 shift workers clocked out 45 mins late at Bandra West outlet without supervisor override log during evening rush.",
        event_type: "STAFF_SHORTAGE",
        priority: "MEDIUM",
        channel: "EMAIL",
        outlet_id: thirdOutlet.outlet_id,
        outlet_name: thirdOutlet.outlet_name,
        recipient_role: "Store Manager",
        status: "IN_PROGRESS",
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
        due_at: new Date(Date.now() + 18 * 60 * 60 * 1000),
      },
    });

    const n4 = await prisma.notification.create({
      data: {
        title: "Monsoon BOGO Ad Campaign Scaling Opportunity",
        message: "Meta Ad Campaign 'Monsoon Festive BOGO Blitz' achieved 5.38x ROAS. AI recommends allocating +₹50,000 budget to capture peak demand.",
        event_type: "MARKETING_ALERT",
        priority: "LOW",
        channel: "IN_APP",
        outlet_id: secondaryOutlet.outlet_id,
        outlet_name: secondaryOutlet.outlet_name,
        recipient_role: "Marketing Director",
        status: "RESOLVED",
        acknowledged: true,
        acknowledged_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        resolved_at: new Date(Date.now() - 10 * 60 * 60 * 1000),
        due_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });

    console.log(`Created 4 primary notifications.`);

    // 2. Escalation Record for Notification N1
    await prisma.notificationEscalation.create({
      data: {
        notification_id: n1.id,
        escalation_level: 1,
        previous_owner: "Store Manager",
        escalated_to: "Outlet Manager",
        reason: "No response within 30-minute SLA for critical cold unit alert.",
        status: "ESCALATED",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    });

    await prisma.notificationEscalation.create({
      data: {
        notification_id: n1.id,
        escalation_level: 2,
        previous_owner: "Outlet Manager",
        escalated_to: "Regional Operations Manager",
        reason: "Unacknowledged after Level 1 escalation.",
        status: "ESCALATED",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    });

    // 3. Franchise Action Plans
    const ap1 = await prisma.actionPlan.create({
      data: {
        title: "Cold Storage Repair & Temperature Calibration",
        description: "Emergency calibration and compressor servicing for Cold Storage Unit #3 at Jubilee Hills.",
        source_notification_id: n1.id,
        outlet_id: primaryOutlet.outlet_id,
        outlet_name: primaryOutlet.outlet_name,
        priority: "CRITICAL",
        owner_name: "P. Karunakar (Regional Ops Lead)",
        status: "IN_PROGRESS",
        progress: 66,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        tasks: {
          create: [
            {
              title: "Dispatch Certified HVAC Technician",
              description: "Call BlueStar authorized service engineer for emergency sensor replacement.",
              assigned_to: "Ramesh Technicians",
              status: "COMPLETED",
              completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
            {
              title: "Transfer Perishables to Backup Freezer",
              description: "Move all dairy and cold brew stock to Unit #1 immediately.",
              assigned_to: "Store Shift Supervisor",
              status: "COMPLETED",
              completed_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
            },
            {
              title: "Run 12-Hour Temperature Audit Telemetry Log",
              description: "Verify constant +3°C reading for 12 hours continuous without drift.",
              assigned_to: "Compliance Officer",
              status: "IN_PROGRESS",
            },
          ],
        },
      },
    });

    const ap2 = await prisma.actionPlan.create({
      data: {
        title: "Stock Reorder & Emergency Vendor Expedite",
        description: "Expedite delivery of Cold Brew Beans 50kg and Eco Craft Containers to prevent stockout during weekend surge.",
        source_notification_id: n2.id,
        outlet_id: secondaryOutlet.outlet_id,
        outlet_name: secondaryOutlet.outlet_name,
        priority: "HIGH",
        owner_name: "Anil Kumar (Supply Chain Lead)",
        status: "OPEN",
        progress: 33,
        due_date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        tasks: {
          create: [
            {
              title: "Approve Purchase Order PO-9942",
              description: "Approve ₹45,000 PO for regional supplier Bangalore Roast Co.",
              assigned_to: "Supply Chain Lead",
              status: "COMPLETED",
              completed_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
            },
            {
              title: "Track Dispatch & Logistics Transit",
              description: "Confirm express logistics dispatch vehicle tracking ID.",
              assigned_to: "Logistics Coordinator",
              status: "PENDING",
            },
            {
              title: "Receive & Stock Inward Verification",
              description: "Perform quality check on batch delivery upon arrival.",
              assigned_to: "Store Manager",
              status: "PENDING",
            },
          ],
        },
      },
    });

    // 4. Audit Trail Entries
    await prisma.notificationAudit.createMany({
      data: [
        {
          notification_id: n1.id,
          event: "NOTIFICATION_CREATED",
          actor: "IoT Telemetry Engine",
          details: "Cold unit sensor flagged temperature breach (+8.5°C). Notification created via SMS.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
        {
          notification_id: n1.id,
          event: "NOTIFICATION_ESCALATED",
          actor: "Workflow Engine",
          details: "Escalated to Level 1 (Outlet Manager) due to 30-min SLA timeout.",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          notification_id: n1.id,
          event: "NOTIFICATION_ESCALATED",
          actor: "Workflow Engine",
          details: "Escalated to Level 2 (Regional Operations Manager) - High Severity Breach.",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          notification_id: n1.id,
          action_plan_id: ap1.id,
          event: "ACTION_PLAN_CREATED",
          actor: "P. Karunakar",
          details: "Created Action Plan 'Cold Storage Repair & Temperature Calibration' with 3 sub-tasks.",
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
        },
      ],
    });

    console.log("Seeded action plans, tasks, escalations, and audit logs cleanly!");
  } catch (err) {
    console.error("Error seeding notification workflow data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotificationWorkflowData();
