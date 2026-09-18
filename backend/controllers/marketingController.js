const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  getMarketingSummary
} = require("../services/marketingServices");

exports.getCampaignsHandler = async (req, res) => {
  try {
    const campaigns = await getAllCampaigns(req.query);
    res.status(200).json({
      success: true,
      message: "Marketing campaigns retrieved successfully",
      data: campaigns
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getCampaignByIdHandler = async (req, res) => {
  try {
    const campaign = await getCampaignById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: `Campaign with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign details retrieved successfully",
      data: campaign
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.createCampaignHandler = async (req, res) => {
  try {
    const newCampaign = await createCampaign(req.body);
    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: newCampaign
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateCampaignHandler = async (req, res) => {
  try {
    const updated = await updateCampaign(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteCampaignHandler = async (req, res) => {
  try {
    const deleted = await deleteCampaign(req.params.id);
    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getPromotionsHandler = async (req, res) => {
  try {
    const promotions = await getAllPromotions(req.query);
    res.status(200).json({
      success: true,
      message: "Promotions retrieved successfully",
      data: promotions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.createPromotionHandler = async (req, res) => {
  try {
    const newPromotion = await createPromotion(req.body);
    res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      data: newPromotion
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updatePromotionHandler = async (req, res) => {
  try {
    const updated = await updatePromotion(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Promotion updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMarketingSummaryHandler = async (req, res) => {
  try {
    const outletId = req.query.outlet_id || req.params.outletId;
    const summary = await getMarketingSummary(outletId);
    res.status(200).json({
      success: true,
      message: "Marketing summary retrieved successfully",
      data: summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
