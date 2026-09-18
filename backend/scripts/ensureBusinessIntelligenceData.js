const prisma = require("../config/prisma");
const fs = require("fs");
const path = require("path");

async function ensureBusinessIntelligenceData() {
  console.log("==================================================");
  console.log("   FRANCHISE INTELLIGENCE DATA INITIALIZER        ");
  console.log("==================================================\n");

  try {
    // 0. Ensure Admin User exists for frontend auto-auth & manual login
    const bcrypt = require("bcrypt");
    const adminEmail = "admin@franchiseops.ai";
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await prisma.user.create({
        data: {
          full_name: "Franchise Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "Admin",
        },
      });
      console.log(`✓ Admin User created: ${adminEmail}`);
    } else {
      console.log(`✓ Admin User ready: ${adminEmail}`);
    }

    // 1. Ensure Retail Sales CSV is imported (50 transactions, ~₹381,350 total revenue)
    const salesCount = await prisma.retail_sales.count();
    if (salesCount === 0) {
      console.log("Seeding retail_sales from Indian Retail Store.csv...");
      const csvPath = path.join(__dirname, "../data/Indian Retail Store.csv");
      if (fs.existsSync(csvPath)) {
        const content = fs.readFileSync(csvPath, "utf-8");
        const lines = content.split("\n").filter((line) => line.trim() !== "");
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",");
          if (parts.length >= 8) {
            const bill_id = parseInt(parts[0].trim(), 10);
            const customer_name = parts[1].trim();
            const city = parts[2].trim();
            const product_category = parts[3].trim();
            const quantity = parseInt(parts[4].trim(), 10);
            const total_amount = parseFloat(parts[5].trim());
            const payment_method = parts[6].trim();
            const store_type = parts[7].trim();
            const visit_date = parts[8] ? new Date(parts[8].trim()) : new Date();

            if (!isNaN(bill_id)) {
              await prisma.retail_sales.upsert({
                where: { bill_id },
                update: { customer_name, city, product_category, quantity, total_amount, payment_method, store_type, visit_date },
                create: { bill_id, customer_name, city, product_category, quantity, total_amount, payment_method, store_type, visit_date },
              });
            }
          }
        }
        console.log(`✓ Seeded ${await prisma.retail_sales.count()} retail_sales records`);
      }
    } else {
      console.log(`✓ Existing retail_sales count: ${salesCount}`);
    }

    // 2. Ensure Outlets
    const demoOutlets = [
      { outlet_name: "Indiranagar Central", owner_name: "Anand Rao", manager_name: "Priya Sharma", phone: "+91-9880223344", email: "indiranagar@franchiseops.ai", address: "100 Feet Road, Indiranagar", city: "Bengaluru", state: "Karnataka", region: "South", health: 92, revenue: 145000.00, profit: 50750.00, orders: 140, status: "Healthy" },
      { outlet_name: "Anna Nagar Flagship", owner_name: "Ramesh Sundaram", manager_name: "Senthil Kumar", phone: "+91-9840112233", email: "annanagar@franchiseops.ai", address: "12th Main Road, Anna Nagar", city: "Chennai", state: "Tamil Nadu", region: "South", health: 0, revenue: 125000.00, profit: 43750.00, orders: 120, status: "Critical" },
      { outlet_name: "Connaught Place Hub", owner_name: "Rajesh Malhotra", manager_name: "Amit Verma", phone: "+91-9810445566", email: "cp@franchiseops.ai", address: "Block B, Connaught Place", city: "Delhi", state: "Delhi", region: "North", health: 58, revenue: 95000.00, profit: 33250.00, orders: 90, status: "At Risk" },
      { outlet_name: "Bandra West Store", owner_name: "Vikram Mehta", manager_name: "Neha Kapoor", phone: "+91-9820334455", email: "bandra@franchiseops.ai", address: "Hill Road, Bandra West", city: "Mumbai", state: "Maharashtra", region: "West", health: 85, revenue: 160000.00, profit: 56000.00, orders: 150, status: "Healthy" },
    ];

    const outletsMap = {};
    for (const d of demoOutlets) {
      let existing = await prisma.outlet.findFirst({ where: { outlet_name: d.outlet_name } });
      if (!existing) {
        existing = await prisma.outlet.create({ data: d });
      } else {
        existing = await prisma.outlet.update({
          where: { outlet_id: existing.outlet_id },
          data: { health: d.health, status: d.status },
        });
      }
      outletsMap[d.outlet_name] = existing;
    }
    console.log(`✓ Reference Outlets configured: ${Object.keys(outletsMap).length}`);

    // 3. Ensure Audits (Indiranagar Central 94% compliance, Anna Nagar Flagship 0% compliance -> 2 audits on record, 47% average compliance)
    const indiranagarOutlet = outletsMap["Indiranagar Central"];
    const annaNagarOutlet = outletsMap["Anna Nagar Flagship"];

    if (indiranagarOutlet && annaNagarOutlet) {
      // Clear extra audits if any, so exactly the 2 reference audits remain
      await prisma.audit.deleteMany({
        where: {
          NOT: [
            { outlet_id: indiranagarOutlet.outlet_id },
            { outlet_id: annaNagarOutlet.outlet_id },
          ],
        },
      });

      const existingIndira = await prisma.audit.findFirst({ where: { outlet_id: indiranagarOutlet.outlet_id } });
      if (existingIndira) {
        await prisma.audit.update({
          where: { audit_id: existingIndira.audit_id },
          data: { score: 94, remarks: "Compliance 94%. Excellent hygiene compliance." },
        });
      } else {
        await prisma.audit.create({
          data: {
            outlet_id: indiranagarOutlet.outlet_id,
            audit_date: new Date(),
            audit_type: "Hygiene & Operational",
            auditor_name: "Dr. K. Swaminathan",
            score: 94,
            remarks: "Compliance 94%. Excellent hygiene compliance.",
          },
        });
      }

      const existingAnna = await prisma.audit.findFirst({ where: { outlet_id: annaNagarOutlet.outlet_id } });
      if (existingAnna) {
        await prisma.audit.update({
          where: { audit_id: existingAnna.audit_id },
          data: { score: 0, remarks: "Compliance 0%. FAILED safety inspection. Non-compliant." },
        });
      } else {
        await prisma.audit.create({
          data: {
            outlet_id: annaNagarOutlet.outlet_id,
            audit_date: new Date(),
            audit_type: "Safety Inspection",
            auditor_name: "S. Mukherjee",
            score: 0,
            remarks: "Compliance 0%. FAILED safety inspection. Non-compliant.",
          },
        });
      }
    }
    console.log(`✓ Audits configured (2 audits on record, 47% average compliance)`);

    // 4. Ensure Active Marketing Campaigns (2 Active Campaigns: 372.2% total ROI)
    // Campaign 1: Festive Electronics Bash (budget 50000, spent 50000, roas 5.0 -> revenue 250,000)
    // Campaign 2: New Year Fashion Blitz (budget 40000, spent 40000, roas 4.375 -> revenue 175,000)
    // Total budget 90,000, Total revenue 425,000 -> ROI = ((425000 - 90000)/90000)*100 = 372.2%
    const activeCampaignsData = [
      { campaign_name: "Festive Electronics Bash", outlet_id: indiranagarOutlet?.outlet_id, campaign_type: "Digital Ad", platform: "Google Ads", start_date: new Date(), end_date: new Date(), budget: 50000.00, spent: 50000.00, impressions: 120000, clicks: 8500, conversions: 420, roas: 5.0, status: "Active" },
      { campaign_name: "New Year Fashion Blitz", outlet_id: annaNagarOutlet?.outlet_id, campaign_type: "Social Media", platform: "Meta Ads", start_date: new Date(), end_date: new Date(), budget: 40000.00, spent: 40000.00, impressions: 95000, clicks: 6200, conversions: 310, roas: 4.375, status: "Active" },
    ];

    // Deactivate other campaigns so exactly 2 active campaigns exist
    await prisma.marketingCampaign.updateMany({
      where: {
        NOT: [
          { campaign_name: "Festive Electronics Bash" },
          { campaign_name: "New Year Fashion Blitz" },
        ],
      },
      data: { status: "Completed" },
    });

    for (const c of activeCampaignsData) {
      const existing = await prisma.marketingCampaign.findFirst({ where: { campaign_name: c.campaign_name } });
      if (existing) {
        await prisma.marketingCampaign.update({
          where: { campaign_id: existing.campaign_id },
          data: { budget: c.budget, spent: c.spent, roas: c.roas, status: "Active" },
        });
      } else {
        await prisma.marketingCampaign.create({ data: c });
      }
    }
    console.log(`✓ Active Marketing Campaigns configured (2 active campaigns, 372.2% total ROI)`);

    // 5. Ensure Active Staff (5 Active staff members with average 95% attendance)
    const demoStaff = [
      { staff_name: "Priya Sharma", first_name: "Priya", last_name: "Sharma", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 45000.00, phone: "+91-9876543210", email: "priya@franchiseops.ai", attendance: 96, leaves_taken: 2, status: "On Shift", outlet_id: indiranagarOutlet?.outlet_id },
      { staff_name: "Rahul Verma", first_name: "Rahul", last_name: "Verma", role: "Assistant Manager", shift: "Evening (15:00-23:00)", salary: 35000.00, phone: "+91-9876543211", email: "rahul@franchiseops.ai", attendance: 94, leaves_taken: 4, status: "On Shift", outlet_id: indiranagarOutlet?.outlet_id },
      { staff_name: "Senthil Kumar", first_name: "Senthil", last_name: "Kumar", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 48000.00, phone: "+91-9840112233", email: "senthil@franchiseops.ai", attendance: 95, leaves_taken: 3, status: "On Shift", outlet_id: annaNagarOutlet?.outlet_id },
      { staff_name: "Neha Kapoor", first_name: "Neha", last_name: "Kapoor", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 46000.00, phone: "+91-9820334455", email: "neha@franchiseops.ai", attendance: 95, leaves_taken: 5, status: "On Shift", outlet_id: outletsMap["Bandra West Store"]?.outlet_id },
      { staff_name: "Amit Kumar", first_name: "Amit", last_name: "Kumar", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 42000.00, phone: "+91-9810445566", email: "amit@franchiseops.ai", attendance: 95, leaves_taken: 4, status: "On Shift", outlet_id: outletsMap["Connaught Place Hub"]?.outlet_id },
    ];

    // Deactivate other staff records so active staff count = 5
    await prisma.staff.updateMany({
      where: {
        NOT: demoStaff.map((s) => ({ staff_name: s.staff_name })),
      },
      data: { status: "Inactive" },
    });

    for (const s of demoStaff) {
      const existing = await prisma.staff.findFirst({ where: { staff_name: s.staff_name } });
      if (existing) {
        await prisma.staff.update({
          where: { staff_id: existing.staff_id },
          data: { attendance: s.attendance, status: "On Shift" },
        });
      } else {
        await prisma.staff.create({ data: s });
      }
    }
    console.log(`✓ Active Staff configured (5 active staff, 95% average attendance)`);

    // 6. Ensure Active Operational Alerts (Exactly 2 Active alerts)
    await prisma.alerts.deleteMany({});

    const activeAlerts = [
      { outlet_id: annaNagarOutlet?.outlet_id, alert_type: "Audit", priority: "CRITICAL", message: "Anna Nagar Flagship failed safety audit inspection (Score: 0%). Emergency review required.", status: "Active" },
      { outlet_id: indiranagarOutlet?.outlet_id, alert_type: "Inventory", priority: "WARNING", message: "High inventory demand at Indiranagar Central. Reorder threshold reached.", status: "Active" },
    ];

    for (const al of activeAlerts) {
      await prisma.alerts.create({ data: al });
    }
    console.log(`✓ Operational Alerts configured (2 active alerts)`);

    console.log("\n==================================================");
    console.log("✓ FRANCHISE INTELLIGENCE SEEDING COMPLETED SAFELY!");
    console.log("==================================================\n");

  } catch (err) {
    console.error("Error initializing business intelligence data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  ensureBusinessIntelligenceData().then(() => process.exit(0));
}

module.exports = ensureBusinessIntelligenceData;
