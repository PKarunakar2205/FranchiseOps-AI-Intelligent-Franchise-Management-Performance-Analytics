const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/rbacMiddleware");

const {
  getFranchiseIntelligenceHandler,
  getExecutiveInsightsHandler,
  getOutletIntelligenceHandler,
  getAuditIntelligenceHandler,
  getInventoryIntelligenceHandler,
  getStaffIntelligenceHandler,
  getMarketingIntelligenceHandler,
  getSalesIntelligenceHandler,
  getCrossModuleIntelligenceHandler,
  getOperationalAlertsHandler,
  generateSmartAlertsHandler,
  queryAiAssistantHandler,
  markAlertAsReadHandler,
  markAllAlertsAsReadHandler,
  deleteAlertHandler,
} = require("../controllers/intelligenceController");

const ALLOWED_ROLES = ["Admin", "Regional Manager", "Outlet Manager", "Staff"];

// 1. Overall Intelligence Summary & Dashboard
router.get(
  "/",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getFranchiseIntelligenceHandler
);

router.get(
  "/summary",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getFranchiseIntelligenceHandler
);

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getFranchiseIntelligenceHandler
);

router.get(
  "/recommendations",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getFranchiseIntelligenceHandler
);

router.get(
  "/findings",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getCrossModuleIntelligenceHandler
);

// 2. Executive Insights
router.get(
  "/executive",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getExecutiveInsightsHandler
);

// 3. Outlet Intelligence (All outlets or specific outlet/city)
router.get(
  "/outlets",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getOutletIntelligenceHandler
);

router.get(
  "/outlets/:id",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getOutletIntelligenceHandler
);

// 4. Audit Intelligence
router.get(
  "/audit",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getAuditIntelligenceHandler
);

// 5. Inventory Intelligence
router.get(
  "/inventory",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getInventoryIntelligenceHandler
);

// 6. Staff Intelligence
router.get(
  "/staff",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getStaffIntelligenceHandler
);

// 7. Marketing Intelligence
router.get(
  "/marketing",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getMarketingIntelligenceHandler
);

// 8. Sales Intelligence
router.get(
  "/sales",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getSalesIntelligenceHandler
);

// 9. Cross-Module Intelligence
router.get(
  "/cross-module",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getCrossModuleIntelligenceHandler
);

// 10. Operational Alerts & Smart Alerts Generation
router.get(
  "/alerts",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  getOperationalAlertsHandler
);

router.post(
  "/generate-alerts",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  generateSmartAlertsHandler
);

router.put(
  "/alerts/read-all",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  markAllAlertsAsReadHandler
);

router.put(
  "/alerts/:id/read",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  markAlertAsReadHandler
);

router.delete(
  "/alerts/:id",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  deleteAlertHandler
);

// 11. AI Assistant Query
router.post(
  "/assistant",
  authMiddleware,
  authorizeRoles(...ALLOWED_ROLES),
  queryAiAssistantHandler
);

module.exports = router;
