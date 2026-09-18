const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles, checkOutletAccess } = require("../middleware/rbacMiddleware");
const {
  getAuditsHandler,
  getAuditSummaryHandler,
  getEvidenceListHandler,
  createEvidenceHandler,
  updateEvidenceHandler,
  deleteEvidenceHandler
} = require("../controllers/auditController");

// Get audit risk overview summary
router.get(
  "/summary",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getAuditSummaryHandler
);

// Audit evidence endpoints
router.get(
  "/evidence",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getEvidenceListHandler
);

router.post(
  "/evidence",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  createEvidenceHandler
);

router.put(
  "/evidence/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  checkOutletAccess,
  updateEvidenceHandler
);

router.delete(
  "/evidence/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager"),
  checkOutletAccess,
  deleteEvidenceHandler
);

// Get audit logs & records
router.get(
  "/",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getAuditsHandler
);

module.exports = router;
