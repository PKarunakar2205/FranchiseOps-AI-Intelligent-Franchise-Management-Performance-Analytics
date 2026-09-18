const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles, checkOutletAccess } = require("../middleware/rbacMiddleware");
const {
  getInventoryList,
  getInventoryItem,
  createItem,
  updateItem,
  deleteItem,
  getLowStock,
  getSummary
} = require("../controllers/inventoryController");

// Get full inventory list
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getInventoryList
);

// Get inventory summary stats
router.get(
  "/summary",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getSummary
);

// Get low stock alert items
router.get(
  "/low-stock",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getLowStock
);

// Get single inventory item by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  checkOutletAccess,
  getInventoryItem
);

// Create new inventory item
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  createItem
);

// Update inventory item
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  checkOutletAccess,
  updateItem
);

// Delete inventory item
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager"),
  checkOutletAccess,
  deleteItem
);

module.exports = router;
