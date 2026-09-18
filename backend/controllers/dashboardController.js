const {
  getDashboardSummary,
  getSalesAnalytics,
  getExecutiveDecisionCenterData
} = require("../services/dashboardServices");

exports.getSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.query);
    res.status(200).json({
      success: true,
      message: "Welcome to FranchiseOpsAI Dashboard",
      loggedInUser: req.user,
      data: summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getSalesAnalytics(req.query);
    res.status(200).json({
      success: true,
      message: "Sales analytics retrieved successfully",
      data: analytics
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getExecutiveDecisionCenter = async (req, res) => {
  try {
    const data = await getExecutiveDecisionCenterData(req.query);
    res.status(200).json({
      success: true,
      message: "Executive Decision Center data retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

