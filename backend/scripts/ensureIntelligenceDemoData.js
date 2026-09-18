const prisma = require("../config/prisma");

async function ensureDemoData() {
  console.log("==================================================");
  console.log("   FRANCHISE INTELLIGENCE DEMO DATA INITIALIZER   ");
  console.log("==================================================\n");

  try {
    // 1. Ensure Outlets (create ~8 realistic outlets if they do not exist)
    const existingOutletsCount = await prisma.outlet.count();
    console.log(`Current Outlets Count: ${existingOutletsCount}`);

    const demoOutletsData = [
      { outlet_name: "Anna Nagar Flagship", owner_name: "Ramesh Sundaram", manager_name: "Senthil Kumar", phone: "+91-9840112233", email: "annanagar@franchiseops.ai", address: "12th Main Road, Anna Nagar", city: "Chennai", state: "Tamil Nadu", region: "South", health: 92, revenue: 125000.00, profit: 43750.00, orders: 120, growth: 12.5, rating: 4.8, status: "Healthy" },
      { outlet_name: "Indiranagar Central", owner_name: "Anand Rao", manager_name: "Priya Sharma", phone: "+91-9880223344", email: "indiranagar@franchiseops.ai", address: "100 Feet Road, Indiranagar", city: "Bengaluru", state: "Karnataka", region: "South", health: 88, revenue: 145000.00, profit: 50750.00, orders: 140, growth: 15.2, rating: 4.7, status: "Healthy" },
      { outlet_name: "Bandra West Store", owner_name: "Vikram Mehta", manager_name: "Neha Kapoor", phone: "+91-9820334455", email: "bandra@franchiseops.ai", address: "Hill Road, Bandra West", city: "Mumbai", state: "Maharashtra", region: "West", health: 85, revenue: 160000.00, profit: 56000.00, orders: 150, growth: 10.8, rating: 4.6, status: "Healthy" },
      { outlet_name: "Connaught Place Hub", owner_name: "Rajesh Malhotra", manager_name: "Amit Verma", phone: "+91-9810445566", email: "cp@franchiseops.ai", address: "Block B, Connaught Place", city: "Delhi", state: "Delhi", region: "North", health: 58, revenue: 95000.00, profit: 33250.00, orders: 90, growth: -4.5, rating: 3.9, status: "Needs Attention" },
      { outlet_name: "Koramangala Store", owner_name: "Kiran Reddy", manager_name: "Sanjay Patil", phone: "+91-9880556677", email: "koramangala@franchiseops.ai", address: "80 Feet Road, Koramangala", city: "Bengaluru", state: "Karnataka", region: "South", health: 86, revenue: 110000.00, profit: 38500.00, orders: 110, growth: 8.4, rating: 4.5, status: "Healthy" },
      { outlet_name: "Salt Lake Sector V", owner_name: "Debashis Sen", manager_name: "Arijit Das", phone: "+91-9830667788", email: "saltlake@franchiseops.ai", address: "Block GP, Sector V, Salt Lake", city: "Kolkata", state: "West Bengal", region: "East", health: 82, revenue: 105000.00, profit: 36750.00, orders: 100, growth: 6.2, rating: 4.4, status: "Healthy" },
      { outlet_name: "Viman Nagar Store", owner_name: "Sachin Kulkarni", manager_name: "Pooja Joshi", phone: "+91-9820778899", email: "vimannagar@franchiseops.ai", address: "Phoenix Road, Viman Nagar", city: "Pune", state: "Maharashtra", region: "West", health: 79, revenue: 98000.00, profit: 34300.00, orders: 95, growth: 5.1, rating: 4.3, status: "Healthy" },
      { outlet_name: "SG Highway Outlet", owner_name: "Jatin Shah", manager_name: "Bhavin Patel", phone: "+91-9890889900", email: "sghighway@franchiseops.ai", address: "SG Highway, Thaltej", city: "Ahmedabad", state: "Gujarat", region: "West", health: 84, revenue: 115000.00, profit: 40250.00, orders: 105, growth: 9.0, rating: 4.5, status: "Healthy" },
    ];

    const outlets = [];
    for (const d of demoOutletsData) {
      const existing = await prisma.outlet.findFirst({ where: { outlet_name: d.outlet_name } });
      if (existing) {
        outlets.push(existing);
      } else {
        const created = await prisma.outlet.create({ data: d });
        outlets.push(created);
      }
    }
    console.log(`✓ Total Outlets Ready: ${outlets.length}`);

    // 2. Ensure Products & Inventory
    const existingProductsCount = await prisma.product.count();
    let products = await prisma.product.findMany();

    if (existingProductsCount === 0) {
      console.log("Seeding Products catalog...");
      const demoProducts = [
        { product_name: "Smart LED TV 43-inch", sku: "ELE-TV-43", category: "Electronics", price: 28000.00, cost_price: 21000.00, unit: "units", status: "Available" },
        { product_name: "Bluetooth Headphones", sku: "ELE-HP-01", category: "Electronics", price: 2500.00, cost_price: 1600.00, unit: "units", status: "Available" },
        { product_name: "Organic Basmati Rice 5kg", sku: "GRO-RICE-05", category: "Grocery", price: 650.00, cost_price: 450.00, unit: "packs", status: "Available" },
        { product_name: "Cold-Pressed Sunflower Oil 1L", sku: "GRO-OIL-01", category: "Grocery", price: 220.00, cost_price: 150.00, unit: "bottles", status: "Available" },
        { product_name: "Cotton Casual Shirt", sku: "CLO-SHIRT-M", category: "Clothing", price: 1800.00, cost_price: 1100.00, unit: "pieces", status: "Available" },
        { product_name: "Slim Fit Denim Jeans", sku: "CLO-JEANS-M", category: "Clothing", price: 2400.00, cost_price: 1500.00, unit: "pieces", status: "Available" },
        { product_name: "Executive Hardbound Journal", sku: "STA-NOTE-01", category: "Stationery", price: 350.00, cost_price: 180.00, unit: "units", status: "Available" },
        { product_name: "Ergonomic Gel Pens Set", sku: "STA-PEN-05", category: "Stationery", price: 150.00, cost_price: 80.00, unit: "packs", status: "Available" },
      ];
      for (const p of demoProducts) {
        const prod = await prisma.product.upsert({
          where: { sku: p.sku },
          update: {},
          create: p,
        });
        products.push(prod);
      }
    }

    const existingInventoryCount = await prisma.inventory.count();
    if (existingInventoryCount === 0 && outlets.length > 0 && products.length > 0) {
      console.log("Seeding Inventory items across outlets...");
      for (let i = 0; i < outlets.length; i++) {
        const outlet = outlets[i];
        for (let j = 0; j < products.length; j++) {
          const product = products[j];
          let current_stock = 45;
          let status = "Healthy";
          let reorder_level = 20;

          if (i === 3 && j % 2 === 0) { // Connaught Place low stock
            current_stock = 5;
            status = "Low Stock";
          } else if (i === 6 && j === 0) {
            current_stock = 0;
            status = "Out of Stock";
          }

          await prisma.inventory.create({
            data: {
              outlet_id: outlet.outlet_id,
              product_id: product.product_id,
              product_name: product.product_name,
              category: product.category,
              quantity: current_stock,
              unit_price: product.price,
              current_stock: current_stock,
              reorder_level: reorder_level,
              supplier_name: "Apex Retail Supplies Ltd",
              status: status,
            },
          });
        }
      }
      console.log(`✓ Inventory Items Seeded`);
    }

    // 3. Ensure Staff
    const existingStaffCount = await prisma.staff.count();
    let staffMembers = await prisma.staff.findMany();

    if (existingStaffCount === 0 && outlets.length > 0) {
      console.log("Seeding Staff members...");
      const demoStaff = [
        { staff_name: "Priya Sharma", first_name: "Priya", last_name: "Sharma", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 45000.00, phone: "+91-9876543210", email: "priya@franchiseops.ai", attendance: 98, leaves_taken: 2, status: "On Shift", outlet_id: outlets[1].outlet_id },
        { staff_name: "Rahul Verma", first_name: "Rahul", last_name: "Verma", role: "Assistant Manager", shift: "Evening (15:00-23:00)", salary: 35000.00, phone: "+91-9876543211", email: "rahul@franchiseops.ai", attendance: 94, leaves_taken: 4, status: "On Shift", outlet_id: outlets[1].outlet_id },
        { staff_name: "Amit Kumar", first_name: "Amit", last_name: "Kumar", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 42000.00, phone: "+91-9876543212", email: "amit@franchiseops.ai", attendance: 78, leaves_taken: 8, status: "On Shift", outlet_id: outlets[3].outlet_id },
        { staff_name: "Senthil Kumar", first_name: "Senthil", last_name: "Kumar", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 48000.00, phone: "+91-9876543213", email: "senthil@franchiseops.ai", attendance: 96, leaves_taken: 3, status: "On Shift", outlet_id: outlets[0].outlet_id },
        { staff_name: "Neha Kapoor", first_name: "Neha", last_name: "Kapoor", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 46000.00, phone: "+91-9876543214", email: "neha@franchiseops.ai", attendance: 91, leaves_taken: 5, status: "On Shift", outlet_id: outlets[2].outlet_id },
        { staff_name: "Sanjay Patil", first_name: "Sanjay", last_name: "Patil", role: "Sales Associate", shift: "Evening (15:00-23:00)", salary: 28000.00, phone: "+91-9876543215", email: "sanjay@franchiseops.ai", attendance: 88, leaves_taken: 6, status: "On Shift", outlet_id: outlets[4].outlet_id },
        { staff_name: "Arijit Das", first_name: "Arijit", last_name: "Das", role: "Store Manager", shift: "Morning (07:00-15:00)", salary: 40000.00, phone: "+91-9876543216", email: "arijit@franchiseops.ai", attendance: 92, leaves_taken: 4, status: "On Shift", outlet_id: outlets[5].outlet_id },
        { staff_name: "Pooja Joshi", first_name: "Pooja", last_name: "Joshi", role: "Sales Associate", shift: "Morning (07:00-15:00)", salary: 26000.00, phone: "+91-9876543217", email: "pooja@franchiseops.ai", attendance: 82, leaves_taken: 7, status: "On Shift", outlet_id: outlets[6].outlet_id },
        { staff_name: "Bhavin Patel", first_name: "Bhavin", last_name: "Patel", role: "Assistant Manager", shift: "Evening (15:00-23:00)", salary: 32000.00, phone: "+91-9876543218", email: "bhavin@franchiseops.ai", attendance: 95, leaves_taken: 3, status: "On Shift", outlet_id: outlets[7].outlet_id },
        { staff_name: "Karan Johar", first_name: "Karan", last_name: "Johar", role: "Inventory Specialist", shift: "Night (23:00-07:00)", salary: 30000.00, phone: "+91-9876543219", email: "karan@franchiseops.ai", attendance: 90, leaves_taken: 5, status: "On Shift", outlet_id: outlets[2].outlet_id },
      ];

      for (const s of demoStaff) {
        const createdStaff = await prisma.staff.create({ data: s });
        staffMembers.push(createdStaff);
      }
      console.log(`✓ Staff Members Seeded: ${staffMembers.length}`);
    }

    // 4. Ensure SwiftLeave Requests
    const existingLeavesCount = await prisma.swiftLeave.count();
    if (existingLeavesCount === 0 && staffMembers.length > 0 && outlets.length > 0) {
      console.log("Seeding SwiftLeave requests...");
      const demoLeaves = [
        { leave_code: "LV-1001", applicant_id: staffMembers[0].staff_id, outlet_id: staffMembers[0].outlet_id || outlets[1].outlet_id, leave_type: "Casual Leave", start_date: new Date(), end_date: new Date(), total_days: 1, reason: "Family Function", status: "Approved", priority: "Normal", replacement_suggested: "Rahul Verma" },
        { leave_code: "LV-1002", applicant_id: staffMembers[2].staff_id, outlet_id: staffMembers[2].outlet_id || outlets[3].outlet_id, leave_type: "Medical Leave", start_date: new Date(), end_date: new Date(), total_days: 3, reason: "Fever & Recovery", status: "Pending AI Approval", priority: "High", ai_conflict: "High store order volume expected", replacement_suggested: "Amit Kumar" },
      ];
      for (const l of demoLeaves) {
        await prisma.swiftLeave.upsert({
          where: { leave_code: l.leave_code },
          update: {},
          create: l,
        });
      }
      console.log("✓ SwiftLeave Requests Seeded");
    }

    // 5. Ensure Audits & AuditEvidence
    const existingAuditsCount = await prisma.audit.count();
    if (existingAuditsCount === 0 && outlets.length > 0) {
      console.log("Seeding Audits...");
      const demoAudits = [
        { outlet_id: outlets[1].outlet_id, audit_date: new Date(), audit_type: "Hygiene & Operational", auditor_name: "Dr. K. Swaminathan", score: 94, remarks: "Excellent hygiene compliance and pest control protocols." },
        { outlet_id: outlets[2].outlet_id, audit_date: new Date(), audit_type: "Financial & Inventory", auditor_name: "R. Vasudevan", score: 88, remarks: "Minor inventory reconciliation discrepancy noted." },
        { outlet_id: outlets[3].outlet_id, audit_date: new Date(), audit_type: "Safety & Compliance", auditor_name: "S. Mukherjee", score: 58, remarks: "FAILED safety inspection. Fire extinguisher expired and emergency exit blocked." },
        { outlet_id: outlets[0].outlet_id, audit_date: new Date(), audit_type: "Operational Excellence", auditor_name: "Dr. K. Swaminathan", score: 91, remarks: "High customer satisfaction rating and clean billing desk." },
      ];
      for (const a of demoAudits) {
        await prisma.audit.create({ data: a });
      }
      console.log("✓ Audits Seeded");
    }

    const existingEvidenceCount = await prisma.auditEvidence.count();
    if (existingEvidenceCount === 0 && outlets.length > 0) {
      console.log("Seeding Audit Evidence...");
      const demoEvidence = [
        { evidence_code: "EV-9001", name: "Fire Safety Certificate 2025", type: "Safety Certificate", outlet_id: outlets[1].outlet_id, status: "Verified", ai_score: 95, details: "Valid up to Dec 2026." },
        { evidence_code: "EV-9002", name: "Pest Control Monthly Audit", type: "Hygiene Inspection Report", outlet_id: outlets[3].outlet_id, status: "Needs Review", ai_score: 55, details: "Requires updated compliance stamp." },
      ];
      for (const e of demoEvidence) {
        await prisma.auditEvidence.upsert({
          where: { evidence_code: e.evidence_code },
          update: {},
          create: e,
        });
      }
      console.log("✓ Audit Evidence Seeded");
    }

    // 6. Ensure MarketingCampaigns & Promotions
    const existingCampaignsCount = await prisma.marketingCampaign.count();
    if (existingCampaignsCount === 0 && outlets.length > 0) {
      console.log("Seeding Marketing Campaigns...");
      const demoCampaigns = [
        { campaign_name: "Festive Electronics Bash", outlet_id: outlets[1].outlet_id, campaign_type: "Digital Ad", platform: "Google Ads", start_date: new Date(), end_date: new Date(), budget: 50000.00, spent: 38000.00, impressions: 120000, clicks: 8500, conversions: 420, roas: 3.8, status: "Active" },
        { campaign_name: "New Year Fashion Blitz", outlet_id: outlets[2].outlet_id, campaign_type: "Social Media", platform: "Meta Ads", start_date: new Date(), end_date: new Date(), budget: 40000.00, spent: 32000.00, impressions: 95000, clicks: 6200, conversions: 310, roas: 3.2, status: "Active" },
        { campaign_name: "South India Loyalty Rewards", outlet_id: outlets[0].outlet_id, campaign_type: "SMS & Email", platform: "Local Outreach", start_date: new Date(), end_date: new Date(), budget: 25000.00, spent: 18000.00, impressions: 45000, clicks: 4100, conversions: 280, roas: 4.1, status: "Active" },
        { campaign_name: "Winter Grocery Savings", outlet_id: outlets[3].outlet_id, campaign_type: "Print & Banner", platform: "Local Newspaper", start_date: new Date(), end_date: new Date(), budget: 30000.00, spent: 28000.00, impressions: 30000, clicks: 1200, conversions: 90, roas: 1.4, status: "Active" },
      ];
      for (const c of demoCampaigns) {
        await prisma.marketingCampaign.create({ data: c });
      }
      console.log("✓ Marketing Campaigns Seeded");
    }

    const existingPromosCount = await prisma.promotion.count();
    if (existingPromosCount === 0) {
      console.log("Seeding Promotions...");
      const demoPromos = [
        { promo_code: "SUMMER20", title: "Summer Retail Savings 20%", discount_pct: 20.00, status: "Active", usage_count: 145 },
        { promo_code: "FESTIVE15", title: "Festive Season Discount 15%", discount_pct: 15.00, status: "Active", usage_count: 98 },
        { promo_code: "GROCERY25", title: "Grocery Essentials 25% Off", discount_pct: 25.00, status: "Active", usage_count: 210 },
      ];
      for (const pr of demoPromos) {
        await prisma.promotion.upsert({
          where: { promo_code: pr.promo_code },
          update: {},
          create: pr,
        });
      }
      console.log("✓ Promotions Seeded");
    }

    // 7. Ensure Operational Alerts
    const existingAlertsCount = await prisma.alerts.count();
    if (existingAlertsCount === 0 && outlets.length > 0) {
      console.log("Seeding Operational Alerts...");
      const demoAlerts = [
        { outlet_id: outlets[3].outlet_id, alert_type: "Audit", priority: "CRITICAL", message: "Connaught Place Hub failed safety audit inspection (Score: 58). Emergency response required.", status: "Active" },
        { outlet_id: outlets[3].outlet_id, alert_type: "Staff", priority: "HIGH", message: "Connaught Place Hub reports low staff attendance (78%). Coverage risk detected.", status: "Active" },
        { outlet_id: outlets[1].outlet_id, alert_type: "Inventory", priority: "MEDIUM", message: "Indiranagar Central reorder threshold reached for Smart LED TVs.", status: "Active" },
      ];
      for (const al of demoAlerts) {
        await prisma.alerts.create({ data: al });
      }
      console.log("✓ Operational Alerts Seeded");
    }

    console.log("\n==================================================");
    console.log("✓ DEMO DATA INITIALIZATION COMPLETED SAFELY!");
    console.log("==================================================\n");

  } catch (err) {
    console.error("Error in ensureDemoData initializer:", err);
  } finally {
    await prisma.$disconnect();
  }
}

ensureDemoData();
