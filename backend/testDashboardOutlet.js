const assert = require("assert");
const prisma = require("./config/prisma");
const { getDashboardSummary, getSalesAnalytics } = require("./services/dashboardServices");
const {
  getAllOutlets,
  getOutletById,
  createOutlet,
  updateOutlet,
  deleteOutlet
} = require("./services/outletServices");

async function runDashboardOutletTests() {
  console.log("=== Running Outlet & Dashboard Backend Tests ===");
  let passedCount = 0;

  async function test(description, fn) {
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      passedCount++;
    } catch (err) {
      console.error(`[FAIL] ${description}:`, err.message);
      throw err;
    }
  }

  try {
    // 1. Test Dashboard Summary Service
    await test("DashboardService: getDashboardSummary aggregates retail_sales correctly", async () => {
      const summary = await getDashboardSummary();
      assert.ok(summary, "Summary object should exist");
      assert.ok(summary.overview, "Overview object should exist");
      assert.strictEqual(typeof summary.overview.totalRevenue, "number");
      assert.strictEqual(typeof summary.overview.totalOrders, "number");
      assert.ok(summary.overview.totalRevenue > 0, "Total revenue should be greater than 0");
      assert.ok(Array.isArray(summary.topCities), "Top cities should be an array");
      assert.ok(Array.isArray(summary.topCategories), "Top categories should be an array");
    });

    // 2. Test Sales Analytics Service
    await test("DashboardService: getSalesAnalytics groups by city, category, payment_method", async () => {
      const cityAnalytics = await getSalesAnalytics({ groupBy: "city" });
      assert.ok(Array.isArray(cityAnalytics), "City analytics should be an array");
      assert.ok(cityAnalytics.length > 0, "Should have city analytics entries");

      const categoryAnalytics = await getSalesAnalytics({ groupBy: "category" });
      assert.ok(Array.isArray(categoryAnalytics), "Category analytics should be an array");

      const paymentAnalytics = await getSalesAnalytics({ groupBy: "payment_method" });
      assert.ok(Array.isArray(paymentAnalytics), "Payment method analytics should be an array");
    });

    // 3. Test Outlet Services (CRUD)
    let createdId = null;

    await test("OutletService: createOutlet creates a new outlet record", async () => {
      const newOutletData = {
        outlet_name: "Test Flagship Outlet",
        owner_name: "John Doe",
        manager_name: "Jane Smith",
        city: "Test City",
        state: "Test State",
        region: "South",
        health: 90,
        revenue: 500000,
        profit: 150000,
        orders: 1200,
        growth: 10.5,
        rating: 4.8,
        status: "Healthy"
      };

      const created = await createOutlet(newOutletData);
      assert.ok(created.outlet_id, "Created outlet should have an outlet_id");
      assert.strictEqual(created.outlet_name, "Test Flagship Outlet");
      createdId = created.outlet_id;
    });

    await test("OutletService: getOutletById retrieves the created outlet", async () => {
      assert.ok(createdId, "Created ID should exist");
      const outlet = await getOutletById(createdId);
      assert.ok(outlet, "Outlet should be found");
      assert.strictEqual(outlet.outlet_id, createdId);
      assert.strictEqual(outlet.city, "Test City");
    });

    await test("OutletService: getAllOutlets returns outlets list", async () => {
      const outlets = await getAllOutlets();
      assert.ok(Array.isArray(outlets), "Outlets should be an array");
      assert.ok(outlets.some(o => o.outlet_id === createdId), "Created outlet should be present in list");
    });

    await test("OutletService: updateOutlet modifies outlet fields", async () => {
      assert.ok(createdId, "Created ID should exist");
      const updated = await updateOutlet(createdId, {
        outlet_name: "Updated Test Outlet",
        health: 95
      });
      assert.strictEqual(updated.outlet_name, "Updated Test Outlet");
      assert.strictEqual(updated.health, 95);
    });

    await test("OutletService: deleteOutlet removes test outlet cleanly", async () => {
      assert.ok(createdId, "Created ID should exist");
      const deleted = await deleteOutlet(createdId);
      assert.strictEqual(deleted.outlet_id, createdId);

      const fetchAfterDelete = await getOutletById(createdId);
      assert.strictEqual(fetchAfterDelete, null, "Deleted outlet should no longer exist");
    });

    console.log(`\nAll ${passedCount} Outlet & Dashboard tests passed successfully!`);
  } finally {
    await prisma.$disconnect();
  }
}

runDashboardOutletTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
