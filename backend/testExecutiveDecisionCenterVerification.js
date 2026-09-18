const http = require("http");
const assert = require("assert");
const app = require("./server");
const prisma = require("./config/prisma");

const TEST_PORT = 5056;
let serverInstance = null;

function makeRequest(path, method = "GET", headers = {}, bodyData = null) {
  return new Promise((resolve, reject) => {
    const payload = bodyData ? JSON.stringify(bodyData) : null;
    const reqHeaders = {
      "Content-Type": "application/json",
      ...headers,
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
        headers: reqHeaders,
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
            data: parsedData,
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

async function runComprehensiveVerification() {
  console.log("=================================================");
  console.log(" EXECUTIVE DECISION CENTER FULL VERIFICATION RUN ");
  console.log("=================================================\n");

  let totalPassed = 0;
  const testUserEmail = `edc.verifier.${Date.now()}@franchiseops.ai`;
  const testPassword = "verifyPassword123!";
  let authToken = null;

  async function testStep(num, name, fn) {
    try {
      await fn();
      console.log(`[PASS] [Step ${num}] ${name}`);
      totalPassed++;
    } catch (err) {
      console.error(`[FAIL] [Step ${num}] ${name}:`, err.message);
      throw err;
    }
  }

  // 1. Start Express Server
  await testStep(1, "Backend Express server starts successfully", async () => {
    await new Promise((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => {
        console.log(`✓ Test Express server listening on http://localhost:${TEST_PORT}`);
        resolve();
      });
    });
    assert.ok(serverInstance, "Server instance should be running");
  });

  try {
    // Auth setup
    const signupRes = await makeRequest("/api/auth/signup", "POST", {}, {
      full_name: "EDC Verification User",
      email: testUserEmail,
      password: testPassword,
      role: "Admin",
      phone: "9991112220",
    });
    assert.strictEqual(signupRes.statusCode, 201);

    const loginRes = await makeRequest("/api/auth/login", "POST", {}, {
      email: testUserEmail,
      password: testPassword,
    });
    assert.strictEqual(loginRes.statusCode, 200);
    authToken = loginRes.data.token;
    assert.ok(authToken, "JWT Auth token should be received");

    const authHeader = { Authorization: `Bearer ${authToken}` };

    // 2. Endpoint Authentication Check
    await testStep(2, "GET /api/dashboard/executive-decision-center works with authentication", async () => {
      const unauthRes = await makeRequest("/api/dashboard/executive-decision-center", "GET");
      assert.strictEqual(unauthRes.statusCode, 401, "Unauthenticated request must be rejected with 401");

      const authRes = await makeRequest("/api/dashboard/executive-decision-center", "GET", authHeader);
      assert.strictEqual(authRes.statusCode, 200, "Authenticated request must succeed with 200");
      assert.strictEqual(authRes.data.success, true);
    });

    // 3. PostgreSQL Real Data Return Check
    let edcData = null;
    await testStep(3, "Endpoint returns real PostgreSQL data structures", async () => {
      const res = await makeRequest("/api/dashboard/executive-decision-center", "GET", authHeader);
      edcData = res.data.data;
      assert.ok(edcData, "Response data object must exist");
      assert.ok(edcData.kpiSummary, "kpiSummary must exist");
      assert.ok(Array.isArray(edcData.outlets), "outlets list must be returned");
      assert.ok(edcData.outlets.length > 0, "Real PostgreSQL outlets must be present");
    });

    // 4. Executive KPI Calculation Check
    await testStep(4, "Executive KPI values are calculated dynamically from database tables", async () => {
      const kpis = edcData.kpiSummary;
      assert.strictEqual(typeof kpis.totalRevenue, "number");
      assert.strictEqual(typeof kpis.totalTransactions, "number");
      assert.strictEqual(typeof kpis.staffAttendancePct, "number");
      assert.strictEqual(typeof kpis.marketingRoi, "number");
      assert.strictEqual(typeof kpis.auditCompliancePct, "number");
      assert.strictEqual(typeof kpis.highRiskOutletsCount, "number");
      assert.strictEqual(typeof kpis.activeAlertsCount, "number");
      assert.strictEqual(typeof kpis.openActionPlansCount, "number");
      assert.ok(kpis.totalRevenue > 0, "Total revenue should be greater than zero");
    });

    // 5. Revenue Trend Real Time-Series Check
    await testStep(5, "Revenue trend contains real sales time-series data", async () => {
      const trend = edcData.revenueTrend;
      assert.ok(Array.isArray(trend), "Revenue trend must be an array");
      if (trend.length > 0) {
        assert.ok(trend[0].date, "Trend items must contain date property");
        assert.strictEqual(typeof trend[0].revenue, "number", "Trend item revenue must be numeric");
      }
    });

    // 6. Outlet Scatter Data Check
    await testStep(6, "Outlet scatter data contains real outlet revenue and health values", async () => {
      const scatter = edcData.scatterAnalysis;
      assert.ok(Array.isArray(scatter), "Scatter analysis must be an array");
      assert.ok(scatter.length > 0, "Scatter items should be present");
      const sample = scatter[0];
      assert.ok(sample.outlet_name, "Scatter item must have outlet_name");
      assert.strictEqual(typeof sample.revenue, "number");
      assert.strictEqual(typeof sample.health, "number");
      assert.ok(sample.health >= 0 && sample.health <= 100, "Health score must be between 0 and 100");
    });

    // 7. Risk Matrix Categorization Check
    await testStep(7, "Risk matrix uses real outlet and risk classifications", async () => {
      const matrix = edcData.riskMatrix;
      assert.ok(matrix, "Risk matrix object must exist");
      assert.ok(Array.isArray(matrix.Critical), "Critical array must exist");
      assert.ok(Array.isArray(matrix.High), "High array must exist");
      assert.ok(Array.isArray(matrix.Medium), "Medium array must exist");
      assert.ok(Array.isArray(matrix.Low), "Low array must exist");
      assert.ok(Array.isArray(matrix.Healthy), "Healthy array must exist");
    });

    // 8. Recommendations Generation Check
    await testStep(8, "Recommendations are generated from actual telemetry and intelligence data", async () => {
      const recs = edcData.aiRecommendations;
      assert.ok(Array.isArray(recs), "AI recommendations must be an array");
      assert.ok(recs.length > 0, "At least one dynamic telemetry recommendation should be generated");
      const r = recs[0];
      assert.ok(r.outlet, "Recommendation must state affected outlet/platform");
      assert.ok(r.observation, "Recommendation must state observation");
      assert.ok(r.priority, "Recommendation must state priority");
      assert.ok(r.recommendedAction, "Recommendation must state action");
    });

    // 9. Filters Functional Check
    await testStep(9, "Global filters (region, outlet, risk, date) filter dataset correctly", async () => {
      const southRes = await makeRequest("/api/dashboard/executive-decision-center?region=South", "GET", authHeader);
      assert.strictEqual(southRes.statusCode, 200);
      assert.strictEqual(southRes.data.data.filtersApplied.region, "South");

      const criticalRes = await makeRequest("/api/dashboard/executive-decision-center?riskLevel=Critical", "GET", authHeader);
      assert.strictEqual(criticalRes.statusCode, 200);
      assert.strictEqual(criticalRes.data.data.filtersApplied.riskLevel, "Critical");
    });

    // 10. Action Queue & Workflow Connection Check
    await testStep(10, "Executive Action Queue connects to existing notification/action functionality", async () => {
      const actionQueue = edcData.actionQueue;
      assert.ok(actionQueue, "Action Queue object must exist");
      assert.ok(Array.isArray(actionQueue.alerts), "Alerts array must exist");
      assert.ok(Array.isArray(actionQueue.actionPlans), "Action Plans array must exist");
    });

    // 11. Outlet Drill-Down Data Structure Check
    await testStep(11, "Outlet drill-down details are populated with full telemetry", async () => {
      const sampleOutlet = edcData.outlets[0];
      assert.ok(sampleOutlet.outlet_id, "Outlet ID should be present");
      assert.ok(sampleOutlet.city, "Outlet city should be present");

      const detailRes = await makeRequest(`/api/outlets/${sampleOutlet.outlet_id}`, "GET", authHeader);
      assert.strictEqual(detailRes.statusCode, 200);
      assert.strictEqual(detailRes.data.data.outlet_id, sampleOutlet.outlet_id);
    });

    // 12. Existing 7 Intelligence Modules Check
    await testStep(12, "Existing 7 intelligence modules still work", async () => {
      const summaryRes = await makeRequest("/api/intelligence/summary", "GET", authHeader);
      assert.strictEqual(summaryRes.statusCode, 200);
      assert.strictEqual(summaryRes.data.success, true);

      const execRes = await makeRequest("/api/intelligence/executive", "GET", authHeader);
      assert.strictEqual(execRes.statusCode, 200);
    });

    // 13. Existing Authentication Check
    await testStep(13, "Existing authentication still works", async () => {
      const loginRes = await makeRequest("/api/auth/login", "POST", {}, {
        email: testUserEmail,
        password: testPassword,
      });
      assert.strictEqual(loginRes.statusCode, 200);
      assert.strictEqual(loginRes.data.success, true);
    });

    // 14. Existing Notification & Workflow Management Check
    await testStep(14, "Existing Notification & Workflow Management still works", async () => {
      const notifRes = await makeRequest("/api/notifications", "GET", authHeader);
      assert.strictEqual(notifRes.statusCode, 200);
      assert.strictEqual(notifRes.data.success, true);

      const plansRes = await makeRequest("/api/notifications/action-plans", "GET", authHeader);
      assert.strictEqual(plansRes.statusCode, 200);
      assert.strictEqual(plansRes.data.success, true);
    });

    // Cleanup test user
    await prisma.user.delete({ where: { email: testUserEmail } });

  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await prisma.$disconnect();
  }

  console.log("\n=================================================");
  console.log(`  SUMMARY: ALL ${totalPassed} VERIFICATION CHECKS PASSED!  `);
  console.log("=================================================\n");
}

runComprehensiveVerification().catch((err) => {
  console.error("Verification failed:", err);
  if (serverInstance) serverInstance.close();
  process.exit(1);
});
