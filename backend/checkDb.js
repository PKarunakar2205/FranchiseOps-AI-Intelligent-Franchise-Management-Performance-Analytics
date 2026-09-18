const prisma = require("./config/prisma");

async function verifyDatabase() {
  try {
    const salesCount = await prisma.retail_sales.count();
    const sumResult = await prisma.retail_sales.aggregate({
      _sum: {
        total_amount: true,
        quantity: true,
      },
    });
    const citiesGroup = await prisma.retail_sales.groupBy({
      by: ["city"],
    });

    const outletsCount = await prisma.outlet.count();
    const inventoryCount = await prisma.inventory.count();
    const staffCount = await prisma.staff.count();
    const leavesCount = await prisma.swiftLeave.count();
    const auditsCount = await prisma.audit.count();
    const evidenceCount = await prisma.auditEvidence.count();
    const campaignsCount = await prisma.marketingCampaign.count();
    const promotionsCount = await prisma.promotion.count();

    console.log("==================================================");
    console.log("      POSTGRESQL DATABASE RECORD COUNTS REPORT    ");
    console.log("==================================================");
    console.log("retail_sales Count          :", salesCount);
    console.log("Distinct Cities Count       :", citiesGroup.length);
    console.log("Sum Total Amount            : ₹" + (sumResult._sum.total_amount || 0));
    console.log("Sum Quantity                :", sumResult._sum.quantity || 0);
    console.log("--------------------------------------------------");
    console.log("outlets Count               :", outletsCount);
    console.log("inventory Count             :", inventoryCount);
    console.log("staff Count                 :", staffCount);
    console.log("swift_leaves Count          :", leavesCount);
    console.log("audits Count                :", auditsCount);
    console.log("audit_evidence Count        :", evidenceCount);
    console.log("marketing_campaigns Count   :", campaignsCount);
    console.log("promotions Count            :", promotionsCount);
    console.log("==================================================\n");

    if (salesCount === 0) {
      console.log("⚠️ retail_sales is empty! Running existing importRetailSales.js...");
      require("./scripts/importRetailSales");
    }
  } catch (err) {
    console.error("Error verifying database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
