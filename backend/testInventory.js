const assert = require("assert");
const prisma = require("./config/prisma");
const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getLowStockItems,
  getInventorySummary
} = require("./services/inventoryServices");

async function runInventoryTests() {
  console.log("=== Running Inventory Backend Tests ===");
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
    let createdId = null;

    // 1. Create Inventory Item
    await test("InventoryService: createInventory creates a new inventory item", async () => {
      const itemData = {
        product_name: "Test Paneer Pack 1kg",
        category: "Dairy & Cheese",
        unit_price: 350.0,
        current_stock: 5,
        reorder_level: 20,
        supplier_name: "FreshDairy Co",
        batch_no: "B-2026-TEST",
        status: "Low Stock"
      };

      const item = await createInventory(itemData);
      assert.ok(item.inventory_id, "Created inventory should have inventory_id");
      assert.strictEqual(item.product_name, "Test Paneer Pack 1kg");
      assert.strictEqual(item.status, "Low Stock");
      createdId = item.inventory_id;
    });

    // 2. Get Inventory By ID
    await test("InventoryService: getInventoryById retrieves the created item", async () => {
      assert.ok(createdId, "Created ID should exist");
      const item = await getInventoryById(createdId);
      assert.ok(item, "Item should be found");
      assert.strictEqual(item.inventory_id, createdId);
      assert.strictEqual(item.supplier_name, "FreshDairy Co");
    });

    // 3. Get All Inventory
    await test("InventoryService: getAllInventory returns list containing created item", async () => {
      const items = await getAllInventory();
      assert.ok(Array.isArray(items), "Items should be an array");
      assert.ok(items.some(i => i.inventory_id === createdId), "Created item should be present in list");
    });

    // 4. Get Low Stock Items
    await test("InventoryService: getLowStockItems returns low stock item", async () => {
      const lowStock = await getLowStockItems();
      assert.ok(Array.isArray(lowStock), "Low stock items should be an array");
      assert.ok(lowStock.some(i => i.inventory_id === createdId), "Low stock list should contain test item");
    });

    // 5. Get Inventory Summary
    await test("InventoryService: getInventorySummary calculates item totals", async () => {
      const summary = await getInventorySummary();
      assert.ok(summary, "Summary object should exist");
      assert.strictEqual(typeof summary.totalItems, "number");
      assert.ok(summary.totalItems > 0, "Total items should be greater than 0");
    });

    // 6. Update Inventory Item
    await test("InventoryService: updateInventory updates stock and status", async () => {
      assert.ok(createdId, "Created ID should exist");
      const updated = await updateInventory(createdId, {
        current_stock: 50,
        reorder_level: 20
      });
      assert.strictEqual(updated.current_stock, 50);
      assert.strictEqual(updated.status, "Healthy");
    });

    // 7. Delete Inventory Item
    await test("InventoryService: deleteInventory cleans up test item", async () => {
      assert.ok(createdId, "Created ID should exist");
      const deleted = await deleteInventory(createdId);
      assert.strictEqual(deleted.inventory_id, createdId);

      const fetchAfterDelete = await getInventoryById(createdId);
      assert.strictEqual(fetchAfterDelete, null, "Deleted item should no longer exist");
    });

    console.log(`\nAll ${passedCount} Inventory tests passed successfully!`);
  } finally {
    await prisma.$disconnect();
  }
}

runInventoryTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
