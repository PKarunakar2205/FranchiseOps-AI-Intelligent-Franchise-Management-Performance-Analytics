const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles, checkOutletAccess } = require("../middleware/rbacMiddleware");
const {
  getStaffList,
  getStaffMember,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  getStaffMetrics,
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequestStatus
} = require("../controllers/staffController");

// Get staff summary metrics
router.get(
  "/summary",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getStaffMetrics
);

// SwiftLeave routes
router.get(
  "/leaves",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getLeaveRequests
);

router.post(
  "/leaves",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  createLeaveRequest
);

router.put(
  "/leaves/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  updateLeaveRequestStatus
);

// Staff roster routes
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getStaffList
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  checkOutletAccess,
  getStaffMember
);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  createStaffMember
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  checkOutletAccess,
  updateStaffMember
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager"),
  checkOutletAccess,
  deleteStaffMember
);

module.exports = router;
