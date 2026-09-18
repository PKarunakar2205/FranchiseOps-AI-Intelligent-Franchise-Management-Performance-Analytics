const http = require("http");
const app = require("./server");
const prisma = require("./config/prisma");

const PORT = 5099;

async function testModule7ExecutiveDashboard() {
  const server = app.listen(PORT, async () => {
    console.log(`Test Server running on http://localhost:${PORT}`);

    try {
      // 1. Create temporary admin user
      const email = `admin.test7.${Date.now()}@franchiseops.ai`;
      const password = "AdminPassword123!";

      const user = await prisma.user.create({
        data: {
          full_name: "Module 7 Test Admin",
          email,
          password: await require("bcrypt").hash(password, 10),
          role: "Admin",
        },
      });

      // 2. Login to get JWT
      const loginPayload = JSON.stringify({ email, password });
      const token = await new Promise((resolve) => {
        const req = http.request(
          {
            hostname: "localhost",
            port: PORT,
            path: "/api/auth/login",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(loginPayload),
            },
          },
          (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => {
              const json = JSON.parse(data);
              resolve(json.token);
            });
          }
        );
        req.write(loginPayload);
        req.end();
      });

      console.log("✓ Login successful, JWT token acquired.");

      // 3. Test GET /api/dashboard/summary
      const summaryResponse = await new Promise((resolve) => {
        const req = http.request(
          {
            hostname: "localhost",
            port: PORT,
            path: "/api/dashboard/summary",
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          (res) => {
            let data = "";
            res.on("data", (c) => (data += c));
            res.on("end", () => {
              resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
            });
          }
        );
        req.end();
      });

      console.log("\n==================================================");
      console.log("    MODULE 7 EXECUTIVE DASHBOARD API TEST REPORT  ");
      console.log("==================================================");
      console.log(`HTTP Status                    : ${summaryResponse.statusCode}`);
      const data = summaryResponse.body.data || {};
      
      console.log("\n--- 1. EXECUTIVE OVERVIEW ---");
      console.log("Total Revenue                  : ₹" + data.executiveSummary?.totalRevenue);
      console.log("Total Orders/Transactions      : " + data.executiveSummary?.totalOrders);
      console.log("Inventory Health               : " + data.executiveSummary?.inventoryHealthPct + "%");
      console.log("Staff Attendance               : " + data.executiveSummary?.staffAttendancePct + "%");
      console.log("Marketing ROI                  : " + data.executiveSummary?.marketingRoiPct + "%");
      console.log("Audit Compliance               : " + data.executiveSummary?.auditCompliancePct + "%");
      console.log("Executive Health Score         : " + data.executiveSummary?.healthScore + "/100");

      console.log("\n--- 2. OUTLET PERFORMANCE ---");
      console.log("Outlets Count                  : " + data.outletPerformance?.totalOutlets);
      console.log("Regional Cities Count          : " + data.outletPerformance?.regionalSalesCenters);

      console.log("\n--- 3. INVENTORY INTELLIGENCE ---");
      console.log("Total Inventory Items          : " + data.inventoryIntelligence?.totalItems);
      console.log("Units on Hand                  : " + data.inventoryIntelligence?.totalUnitsOnHand);
      console.log("Low Stock Items Count          : " + data.inventoryIntelligence?.lowStockCount);

      console.log("\n--- 4. STAFF INTELLIGENCE ---");
      console.log("Total Staff                    : " + data.staffIntelligence?.totalStaff);
      console.log("On Shift / Active Staff        : " + data.staffIntelligence?.onShiftCount);
      console.log("Avg Staff Attendance           : " + data.staffIntelligence?.avgAttendance + "%");

      console.log("\n--- 5. MARKETING INTELLIGENCE ---");
      console.log("Total Campaigns                : " + data.marketingIntelligence?.totalCampaigns);
      console.log("Active Campaigns               : " + data.marketingIntelligence?.activeCampaignsCount);
      console.log("Average ROAS                   : " + data.marketingIntelligence?.roas);

      console.log("\n--- 6. AUDIT INTELLIGENCE ---");
      console.log("Total Audits                   : " + data.auditIntelligence?.totalAudits);
      console.log("Avg Audit Score                : " + data.auditIntelligence?.avgAuditScore + "%");

      console.log("\n--- 7. RECOMMENDATIONS & ALERTS ---");
      console.log("Recommendations Count          : " + (data.recommendations?.length || 0));
      console.log("Alerts Count                   : " + (data.alerts?.length || 0));
      console.log("==================================================\n");

      // Cleanup user
      await prisma.user.delete({ where: { user_id: user.user_id } });
      console.log("✓ Cleanup finished.");

    } catch (err) {
      console.error("Test failed with error:", err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

testModule7ExecutiveDashboard();
