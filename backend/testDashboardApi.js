const http = require("http");
const app = require("./server");
const prisma = require("./config/prisma");

const PORT = 5098;

async function debugDashboardApi() {
  const server = app.listen(PORT, async () => {
    console.log(`Server listening on http://localhost:${PORT}`);

    try {
      // 1. Create temporary admin user
      const email = `admin.debug.${Date.now()}@franchiseops.ai`;
      const password = "AdminPassword123!";

      const user = await prisma.user.create({
        data: {
          full_name: "Debug Admin",
          email,
          password: await require("bcrypt").hash(password, 10),
          role: "Admin",
        },
      });

      // 2. Login to get JWT
      const loginPayload = JSON.stringify({ email, password });
      const token = await new Promise((resolve, reject) => {
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

      console.log("✓ Login successful, token received.");

      // 3. Test GET /api/intelligence/dashboard
      const intelResponse = await new Promise((resolve, reject) => {
        const req = http.request(
          {
            hostname: "localhost",
            port: PORT,
            path: "/api/intelligence/dashboard",
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
      console.log("      GET /api/intelligence/dashboard REPORT     ");
      console.log("==================================================");
      console.log(`HTTP Status              : ${intelResponse.statusCode}`);
      const data = intelResponse.body.data || {};
      console.log(`Health Score             : ${data.healthScore?.score} (${data.healthScore?.status})`);
      console.log(`Total Outlets            : ${data.totalOutlets}`);
      console.log(`Total Revenue            : ₹${data.totalRevenue}`);
      console.log(`Total Profit             : ₹${data.totalProfit}`);
      console.log(`Total Orders             : ${data.totalOrders}`);
      console.log(`Outlet Matrix Length     : ${data.outletMatrix?.length}`);
      console.log(`Recommendations Length  : ${data.recommendations?.length}`);
      console.log(`Cross-Module Findings    : ${data.crossModuleFindings?.length}`);
      console.log(`Smart Alerts Length      : ${data.alerts?.length}`);
      console.log("==================================================\n");

      // Cleanup user
      await prisma.user.delete({ where: { user_id: user.user_id } });
      console.log("✓ Test debug user cleaned up.");
    } catch (err) {
      console.error("Error in debug script:", err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

debugDashboardApi();
