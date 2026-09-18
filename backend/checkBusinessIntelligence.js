const prisma = require("./config/prisma");

async function checkBusinessIntelligence() {
  try {
    const usersCount = await prisma.user.count();
    const outletsCount = await prisma.outlet.count();
    const retailSalesCount = await prisma.retail_sales.count();
    const inventoryCount = await prisma.inventory.count();
    const staffCount = await prisma.staff.count();
    const swiftLeavesCount = await prisma.swiftLeave.count();
    const auditsCount = await prisma.audit.count();
    const auditEvidenceCount = await prisma.auditEvidence.count();
    const campaignsCount = await prisma.marketingCampaign.count();
    const promotionsCount = await prisma.promotion.count();
    const alertsCount = await prisma.alerts.count();

    const salesSum = await prisma.retail_sales.aggregate({
      _sum: { total_amount: true, quantity: true },
    });
    const citiesGroup = await prisma.retail_sales.groupBy({ by: ["city"] });

    const activeCampaignsCount = await prisma.marketingCampaign.count({
      where: { status: "Active" },
    });

    const activeStaffCount = await prisma.staff.count({
      where: {
        OR: [
          { status: "On Shift" },
          { status: "Active" },
        ],
      },
    });

    const unreadAlertsCount = await prisma.alerts.count({
      where: {
        OR: [
          { status: "Active" },
          { status: "Unread" },
          { status: "Pending" },
        ],
      },
    });

    const totalRev = Number(salesSum._sum.total_amount || 0);

    console.log("==================================================");
    console.log("=== FRANCHISE INTELLIGENCE DATABASE CHECK      ===");
    console.log("==================================================");
    console.log("Users               :", usersCount);
    console.log("Outlets             :", outletsCount);
    console.log("Retail Sales        :", retailSalesCount);
    console.log("Inventory           :", inventoryCount);
    console.log("Staff               :", staffCount);
    console.log("Swift Leaves        :", swiftLeavesCount);
    console.log("Audits              :", auditsCount);
    console.log("Audit Evidence      :", auditEvidenceCount);
    console.log("Campaigns           :", campaignsCount);
    console.log("Promotions          :", promotionsCount);
    console.log("Alerts              :", alertsCount);
    console.log("--------------------------------------------------");
    console.log("Total Revenue       : ₹" + totalRev.toLocaleString());
    console.log("Total Transactions  :", retailSalesCount);
    console.log("Unique Cities       :", citiesGroup.length);
    console.log("Active Campaigns    :", activeCampaignsCount);
    console.log("Active Staff        :", activeStaffCount);
    console.log("Audit Count         :", auditsCount);
    console.log("Unread Alerts       :", unreadAlertsCount);
    console.log("==================================================\n");
  } catch (err) {
    console.error("Error running checkBusinessIntelligence:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

checkBusinessIntelligence();
