const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/rbacMiddleware");
const { getSummary, getAnalytics, getExecutiveDecisionCenter } = require("../controllers/dashboardController");

// Get dashboard summary overview
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getSummary
);

router.get(
  "/summary",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getSummary
);

// Get sales analytics
router.get(
  "/analytics",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getAnalytics
);

// Get Executive Decision Center data
router.get(
  "/executive-decision-center",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getExecutiveDecisionCenter
);

module.exports = router;
