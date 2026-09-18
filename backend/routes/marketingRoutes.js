const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles, checkOutletAccess } = require("../middleware/rbacMiddleware");
const {
  getCampaignsHandler,
  getCampaignByIdHandler,
  createCampaignHandler,
  updateCampaignHandler,
  deleteCampaignHandler,
  getPromotionsHandler,
  createPromotionHandler,
  updatePromotionHandler,
  getMarketingSummaryHandler
} = require("../controllers/marketingController");

// Get marketing summary
router.get(
  "/summary",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getMarketingSummaryHandler
);

// Campaigns routes
router.get(
  "/campaigns",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getCampaignsHandler
);

router.post(
  "/campaigns",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  createCampaignHandler
);

router.get(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  checkOutletAccess,
  getCampaignByIdHandler
);

router.put(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  checkOutletAccess,
  updateCampaignHandler
);

router.delete(
  "/campaigns/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager"),
  checkOutletAccess,
  deleteCampaignHandler
);

// Promotions routes
router.get(
  "/promotions",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager", "Staff"),
  getPromotionsHandler
);

router.post(
  "/promotions",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  createPromotionHandler
);

router.put(
  "/promotions/:id",
  authMiddleware,
  authorizeRoles("Admin", "Regional Manager", "Outlet Manager"),
  updatePromotionHandler
);

module.exports = router;
