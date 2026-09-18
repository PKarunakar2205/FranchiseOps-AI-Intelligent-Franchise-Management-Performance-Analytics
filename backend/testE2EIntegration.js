const http = require("http");
const assert = require("assert");
const app = require("./server");
const prisma = require("./config/prisma");

const TEST_PORT = 5055;
let serverInstance = null;

function makeRequest(path, method = "GET", headers = {}, bodyData = null) {
  return new Promise((resolve, reject) => {
    const payload = bodyData ? JSON.stringify(bodyData) : null;
    const reqHeaders = {
      "Content-Type": "application/json",
      ...headers
    };
    if (payload) {
      reqHeaders["Content-Length"] = Buffer.byteLength(payload);
    }

    const req = http.request(
      {
        hostname: "localhost",
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res.on("end", () => {
          let parsedData = null;
          try {
            parsedData = JSON.parse(rawData);
          } catch (e) {
            parsedData = rawData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        });
      }
    );

    req.on("error", (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runE2EIntegrationVerification() {
  console.log("=================================================");
  console.log("   END-TO-END FRONTEND <-> BACKEND VERIFICATION   ");
  console.log("=================================================\n");

  let totalPassed = 0;
  const testUserEmail = `e2e.test.${Date.now()}@franchiseops.ai`;
  const testPassword = "testPassword123!";
  let authToken = null;

  async function testStep(moduleName, description, fn) {
    try {
      await fn();
      console.log(`[PASS] [${moduleName}] ${description}`);
      totalPassed++;
    } catch (err) {
      console.error(`[FAIL] [${moduleName}] ${description}:`, err.message);
      throw err;
    }
  }

  // 1. Start Server
  await new Promise((resolve) => {
    serverInstance = app.listen(TEST_PORT, () => {
      console.log(`✓ Test Express server listening on http://localhost:${TEST_PORT}\n`);
      resolve();
    });
  });

  try {
    // MODULE 1: AUTHENTICATION
    await testStep("Auth", "POST /api/auth/signup - Register new user", async () => {
      const res = await makeRequest("/api/auth/signup", "POST", {}, {
        full_name: "E2E Integration Tester",
        email: testUserEmail,
        password: testPassword,
        role: "Admin",
        phone: "9998887770"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.user_id);
    });

    await testStep("Auth", "POST /api/auth/login - Login user and obtain JWT token", async () => {
      const res = await makeRequest("/api/auth/login", "POST", {}, {
        email: testUserEmail,
        password: testPassword
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.token, "JWT token should be returned");
      authToken = res.data.token;
    });

    const authHeader = { Authorization: `Bearer ${authToken}` };

    // MODULE 2: DASHBOARD & OUTLET
    await testStep("Dashboard", "GET /api/dashboard/summary - Retrieve metrics overview", async () => {
      const res = await makeRequest("/api/dashboard/summary", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.overview);
    });

    await testStep("Dashboard", "GET /api/dashboard/analytics - Retrieve sales trends by city", async () => {
      const res = await makeRequest("/api/dashboard/analytics?groupBy=city", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data));
    });

    await testStep("Executive Decision Center", "GET /api/dashboard/executive-decision-center - Retrieve decision telemetry & risk matrix", async () => {
      const res = await makeRequest("/api/dashboard/executive-decision-center", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.kpiSummary, "KPI Summary should be present");
      assert.ok(Array.isArray(res.data.data.revenueTrend), "Revenue Trend should be an array");
      assert.ok(Array.isArray(res.data.data.scatterAnalysis), "Scatter Analysis should be an array");
      assert.ok(res.data.data.riskMatrix, "Risk Matrix should be present");
      assert.ok(Array.isArray(res.data.data.aiRecommendations), "AI Recommendations should be an array");
    });

    let e2eOutletId = null;
    await testStep("Outlet", "POST /api/outlets - Create outlet record", async () => {
      const res = await makeRequest("/api/outlets", "POST", authHeader, {
        outlet_name: "E2E Test Flagship Outlet",
        city: "E2E City",
        state: "E2E State",
        region: "South",
        health: 88,
        revenue: 250000,
        profit: 80000,
        orders: 1500,
        status: "Healthy"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.data.outlet_id);
      e2eOutletId = res.data.data.outlet_id;
    });

    await testStep("Outlet", "GET /api/outlets/:id - Get outlet details", async () => {
      const res = await makeRequest(`/api/outlets/${e2eOutletId}`, "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.outlet_id, e2eOutletId);
    });

    await testStep("Outlet", "PUT /api/outlets/:id - Update outlet details", async () => {
      const res = await makeRequest(`/api/outlets/${e2eOutletId}`, "PUT", authHeader, {
        health: 95,
        status: "Healthy"
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.health, 95);
    });

    // MODULE 3: INVENTORY
    let e2eInventoryId = null;
    await testStep("Inventory", "POST /api/inventory - Create inventory item", async () => {
      const res = await makeRequest("/api/inventory", "POST", authHeader, {
        outlet_id: e2eOutletId,
        product_name: "E2E Mozzarella Cheese 1kg",
        category: "Dairy & Cheese",
        unit_price: 450,
        current_stock: 30,
        reorder_level: 15,
        status: "Healthy"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2eInventoryId = res.data.data.inventory_id;
    });

    await testStep("Inventory", "GET /api/inventory/summary - Retrieve inventory KPIs", async () => {
      const res = await makeRequest("/api/inventory/summary", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(typeof res.data.data.totalItems, "number");
    });

    await testStep("Inventory", "PUT /api/inventory/:id - Update inventory stock", async () => {
      const res = await makeRequest(`/api/inventory/${e2eInventoryId}`, "PUT", authHeader, {
        current_stock: 50
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.current_stock, 50);
    });

    // MODULE 4: STAFF & LEAVE
    let e2eStaffId = null;
    await testStep("Staff", "POST /api/staff - Create staff member", async () => {
      const res = await makeRequest("/api/staff", "POST", authHeader, {
        outlet_id: e2eOutletId,
        staff_name: "E2E Staff Member",
        role: "Shift Lead",
        shift: "Morning (07:00-15:00)",
        salary: 30000,
        status: "On Shift"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2eStaffId = res.data.data.staff_id;
    });

    await testStep("Staff", "GET /api/staff/summary - Retrieve staff metrics", async () => {
      const res = await makeRequest("/api/staff/summary", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
    });

    let e2eLeaveId = null;
    await testStep("Staff", "POST /api/staff/leaves - Submit SwiftLeave request", async () => {
      const res = await makeRequest("/api/staff/leaves", "POST", authHeader, {
        applicant_id: e2eStaffId,
        outlet_id: e2eOutletId,
        leave_type: "Casual Leave",
        start_date: "2026-08-25",
        end_date: "2026-08-26",
        total_days: 1,
        reason: "E2E integration test leave"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2eLeaveId = res.data.data.leave_id;
    });

    await testStep("Staff", "PUT /api/staff/leaves/:id - Approve leave request", async () => {
      const res = await makeRequest(`/api/staff/leaves/${e2eLeaveId}`, "PUT", authHeader, {
        status: "Approved"
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.status, "Approved");
    });

    // MODULE 5: AUDIT & EVIDENCE
    await testStep("Audit", "GET /api/audit/summary - Retrieve audit risk summary", async () => {
      const res = await makeRequest("/api/audit/summary", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
      assert.ok(Array.isArray(res.data.data.riskBreakdown));
    });

    let e2eEvidenceId = null;
    await testStep("Audit", "POST /api/audit/evidence - Upload evidence document", async () => {
      const res = await makeRequest("/api/audit/evidence", "POST", authHeader, {
        name: "E2E Test Evidence Invoice",
        type: "Financial",
        outlet_id: e2eOutletId,
        status: "Needs Review",
        ai_score: 85
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2eEvidenceId = res.data.data.evidence_id;
    });

    await testStep("Audit", "PUT /api/audit/evidence/:id - Update evidence status", async () => {
      const res = await makeRequest(`/api/audit/evidence/${e2eEvidenceId}`, "PUT", authHeader, {
        status: "Verified",
        ai_score: 95
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.data.status, "Verified");
    });

    // MODULE 6: MARKETING & PROMOTIONS
    let e2eCampaignId = null;
    await testStep("Marketing", "POST /api/marketing/campaigns - Create campaign", async () => {
      const res = await makeRequest("/api/marketing/campaigns", "POST", authHeader, {
        campaign_name: "E2E Monsoon Campaign",
        outlet_id: e2eOutletId,
        campaign_type: "Social",
        platform: "Google Ads",
        budget: 40000,
        spent: 10000,
        status: "Active"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2eCampaignId = res.data.data.campaign_id;
    });

    let e2ePromotionId = null;
    await testStep("Marketing", "POST /api/marketing/promotions - Create promotion", async () => {
      const res = await makeRequest("/api/marketing/promotions", "POST", authHeader, {
        promo_code: `E2EDEAL-${Date.now()}`,
        title: "E2E 20% Off Promo",
        discount_pct: 20.0,
        status: "Active"
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.data.success, true);
      e2ePromotionId = res.data.data.promotion_id;
    });

    await testStep("Marketing", "GET /api/marketing/summary - Retrieve marketing KPIs", async () => {
      const res = await makeRequest("/api/marketing/summary", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
    });

    // CLEANUP TEMPORARY E2E TEST DATA
    console.log("\n--- Cleaning up E2E temporary test records ---");

    if (e2ePromotionId) await prisma.promotion.delete({ where: { promotion_id: e2ePromotionId } });
    if (e2eCampaignId) await prisma.marketingCampaign.delete({ where: { campaign_id: e2eCampaignId } });
    if (e2eEvidenceId) await prisma.auditEvidence.delete({ where: { evidence_id: e2eEvidenceId } });
    if (e2eLeaveId) await prisma.swiftLeave.delete({ where: { leave_id: e2eLeaveId } });
    if (e2eStaffId) await prisma.staff.delete({ where: { staff_id: e2eStaffId } });
    if (e2eInventoryId) await prisma.inventory.delete({ where: { inventory_id: e2eInventoryId } });
    if (e2eOutletId) await prisma.outlet.delete({ where: { outlet_id: e2eOutletId } });
    await prisma.user.delete({ where: { email: testUserEmail } });

    console.log("✓ All temporary E2E test data cleaned up cleanly.\n");

    console.log(`=================================================`);
    console.log(`  SUMMARY: ALL ${totalPassed} E2E API VERIFICATIONS PASSED!  `);
    console.log(`=================================================\n`);

  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await prisma.$disconnect();
  }
}

runE2EIntegrationVerification().catch((err) => {
  console.error("E2E Integration Verification failed:", err);
  if (serverInstance) serverInstance.close();
  process.exit(1);
});
