const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles, checkOutletAccess } = require("../middleware/rbacMiddleware");
const {
  getOutlets,
  getOutlet,
  createOutletHandler,
  updateOutletHandler,
  deleteOutletHandler
} = require("../controllers/outletController");

// All authenticated roles can list outlets
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getOutlets
);

// Get specific outlet details (with outlet level access check)
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  checkOutletAccess,
  getOutlet
);

// Create outlet (Admin & Regional Manager only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager"),
  createOutletHandler
);

// Update outlet (Admin, Regional Manager, or assigned Outlet Manager)
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  checkOutletAccess,
  updateOutletHandler
);

// Delete outlet (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin"),
  deleteOutletHandler
);

module.exports = router;
