const prisma = require("./config/prisma");

async function checkIntelligenceData() {
  try {
    const usersCount = await prisma.user.count();
    const outletsCount = await prisma.outlet.count();
    const retailSalesCount = await prisma.retail_sales.count();
    const productsCount = await prisma.product.count();
    const inventoryCount = await prisma.inventory.count();
    const staffCount = await prisma.staff.count();
    const leavesCount = await prisma.swiftLeave.count();
    const auditsCount = await prisma.audit.count();
    const evidenceCount = await prisma.auditEvidence.count();
    const campaignsCount = await prisma.marketingCampaign.count();
    const promotionsCount = await prisma.promotion.count();
    const alertsCount = await prisma.alerts.count();

    const salesSum = await prisma.retail_sales.aggregate({
      _sum: { total_amount: true, quantity: true },
    });
    const citiesGroup = await prisma.retail_sales.groupBy({ by: ["city"] });

    console.log("==================================================");
    console.log("=== Franchise Intelligence Database Check ===");
    console.log("==================================================");
    console.log("Users               :", usersCount);
    console.log("Outlets             :", outletsCount);
    console.log("Retail Sales        :", retailSalesCount);
    console.log("Products            :", productsCount);
    console.log("Inventory Items     :", inventoryCount);
    console.log("Staff Members       :", staffCount);
    console.log("Swift Leaves        :", leavesCount);
    console.log("Audits              :", auditsCount);
    console.log("Audit Evidence      :", evidenceCount);
    console.log("Marketing Campaigns :", campaignsCount);
    console.log("Promotions          :", promotionsCount);
    console.log("Alerts              :", alertsCount);
    console.log("--------------------------------------------------");
    console.log("Retail Sales Summary:");
    console.log("Total Revenue       : ₹" + (salesSum._sum.total_amount || 0));
    console.log("Total Orders        :", retailSalesCount);
    console.log("Total Quantity      :", salesSum._sum.quantity || 0);
    console.log("Unique Cities       :", citiesGroup.length);
    console.log("==================================================\n");
  } catch (err) {
    console.error("Error in checkIntelligenceData:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkIntelligenceData();
