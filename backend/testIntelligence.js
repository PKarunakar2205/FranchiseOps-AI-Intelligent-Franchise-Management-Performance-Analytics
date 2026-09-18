const http = require("http");
const assert = require("assert");
const app = require("./server");
const prisma = require("./config/prisma");

const TEST_PORT = 5063;
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
        path: encodeURI(path),
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

async function runIntelligenceModuleTests() {
  console.log("=================================================");
  console.log("    FRANCHISE INTELLIGENCE VERIFICATION SUITE   ");
  console.log("=================================================\n");

  let totalPassed = 0;
  const testUserEmail = `intel.test.${Date.now()}@franchiseops.ai`;
  const testPassword = "testPassword123!";
  let authToken = null;

  async function testStep(description, fn) {
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      totalPassed++;
    } catch (err) {
      console.error(`[FAIL] ${description}:`, err.message);
      throw err;
    }
  }

  // Start Express Server
  await new Promise((resolve) => {
    serverInstance = app.listen(TEST_PORT, () => {
      console.log(`✓ Test Express server listening on http://localhost:${TEST_PORT}\n`);
      resolve();
    });
  });

  try {
    // 1. Intelligence endpoint & Authentication
    await testStep("1. Authentication - POST /api/auth/signup & login", async () => {
      const signupRes = await makeRequest("/api/auth/signup", "POST", {}, {
        full_name: "Intelligence Tester",
        email: testUserEmail,
        password: testPassword,
        role: "Admin",
      });
      assert.strictEqual(signupRes.statusCode, 201);

      const loginRes = await makeRequest("/api/auth/login", "POST", {}, {
        email: testUserEmail,
        password: testPassword,
      });
      assert.strictEqual(loginRes.statusCode, 200);
      assert.ok(loginRes.data.token);
      authToken = loginRes.data.token;
    });

    const authHeader = { Authorization: `Bearer ${authToken}` };

    // 2. Intelligence Endpoint Response
    await testStep("2. GET /api/intelligence - Response check", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.data.success, true);
    });

    // 3. Total Revenue Check
    await testStep("3. Total Revenue Check (≈ ₹381,350)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const rev = res.data.data.totalRevenue;
      assert.ok(rev > 300000, `Expected revenue > 300,000 (got ${rev})`);
    });

    // 4. Transaction Count Check
    await testStep("4. Transaction Count Check (50 transactions)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const orders = res.data.data.totalOrders;
      assert.strictEqual(orders, 50);
    });

    // 5. Marketing ROI Check
    await testStep("5. Marketing ROI Check (≈ 372.2%)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const roi = res.data.data.businessPulse.marketingRoi;
      assert.ok(roi !== null && roi > 300, `Expected Marketing ROI > 300% (got ${roi})`);
    });

    // 6. Staff Attendance Check
    await testStep("6. Staff Attendance Check (95%)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const att = res.data.data.businessPulse.staffAttendance;
      assert.strictEqual(att, 95);
    });

    // 7. Audit Compliance Check
    await testStep("7. Audit Compliance Check (47%)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const comp = res.data.data.businessPulse.auditCompliance;
      assert.strictEqual(comp, 47);
    });

    // 8. High-Risk Outlet Count Check
    await testStep("8. High-Risk Outlet Count Check (1)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const highRisk = res.data.data.businessPulse.highRiskOutlets;
      assert.strictEqual(highRisk, 1);
    });

    // 9. Active Alert Count Check
    await testStep("9. Active Alert Count Check (2)", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const activeAlerts = res.data.data.businessPulse.activeAlerts;
      assert.strictEqual(activeAlerts, 2);
    });

    // 10. Outlet Matrix Grid Check
    await testStep("10. Outlet Health Matrix Grid (≥ 50 locations)", async () => {
      const res = await makeRequest("/api/intelligence/outlets", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.data.data));
      assert.ok(res.data.data.length >= 50);
    });

    // 11. Regional Sales Cities Verification
    await testStep("11. Regional Sales Cities in Matrix", async () => {
      const res = await makeRequest("/api/intelligence/outlets", "GET", authHeader);
      const matrix = res.data.data;
      const delhi = matrix.find((o) => o.city && o.city.toLowerCase() === "delhi");
      assert.ok(delhi, "Delhi regional sales city should be present in matrix");
    });

    // 12. No Data Classification Check
    await testStep("12. 'No Data' Classification for sales-only cities", async () => {
      const res = await makeRequest("/api/intelligence/outlets", "GET", authHeader);
      const matrix = res.data.data;
      const noDataLocation = matrix.find((o) => o.classification === "No Data");
      assert.ok(noDataLocation, "Matrix should contain 'No Data' classification for sales-only cities");
      assert.strictEqual(noDataLocation.lastAuditScore, "N/A");
    });

    // 13. Critical Classification Check
    await testStep("13. 'Critical' Classification (Anna Nagar Flagship)", async () => {
      const res = await makeRequest("/api/intelligence/outlets", "GET", authHeader);
      const matrix = res.data.data;
      const annaNagar = matrix.find((o) => o.outlet_name === "Anna Nagar Flagship");
      assert.ok(annaNagar, "Anna Nagar Flagship should be present");
      assert.strictEqual(annaNagar.classification, "Critical");
    });

    // 14. Healthy Classification Check
    await testStep("14. 'Healthy' Classification (Indiranagar Central)", async () => {
      const res = await makeRequest("/api/intelligence/outlets", "GET", authHeader);
      const matrix = res.data.data;
      const indiranagar = matrix.find((o) => o.outlet_name === "Indiranagar Central");
      assert.ok(indiranagar, "Indiranagar Central should be present");
      assert.strictEqual(indiranagar.classification, "Healthy");
    });

    // 15. Business Recommendations Check
    await testStep("15. Business Recommendations Check", async () => {
      const res = await makeRequest("/api/intelligence", "GET", authHeader);
      const recs = res.data.data.businessRecommendations;
      assert.ok(Array.isArray(recs) && recs.length > 0);
      assert.ok(recs[0].priority && recs[0].action && recs[0].reason);
    });

    // 16. Smart Alerts Trigger Check
    await testStep("16. POST /api/intelligence/generate-alerts - Smart Alerts", async () => {
      const res = await makeRequest("/api/intelligence/generate-alerts", "POST", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.data.data));
    });

    // 17. Outlet Profile Detail Check
    await testStep("17. GET /api/intelligence/outlets/:id - Outlet Profile", async () => {
      const res = await makeRequest("/api/intelligence/outlets/Indiranagar Central", "GET", authHeader);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.data.data.outlet_name || res.data.data.city);
    });

    // CLEANUP TEST USER
    if (testUserEmail) {
      await prisma.user.delete({ where: { email: testUserEmail } });
    }

    console.log(`\n=================================================`);
    console.log(`  ALL ${totalPassed} INTELLIGENCE VERIFICATION TESTS PASSED! `);
    console.log(`=================================================\n`);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
    await prisma.$disconnect();
  }
}

runIntelligenceModuleTests().catch((err) => {
  console.error("Intelligence Test Suite Failed:", err);
  if (serverInstance) serverInstance.close();
  process.exit(1);
});
