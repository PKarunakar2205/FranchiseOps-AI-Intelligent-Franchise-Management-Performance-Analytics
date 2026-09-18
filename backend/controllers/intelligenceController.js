const {
  getFranchiseIntelligence,
  getExecutiveInsights,
  getOutletIntelligence,
  getAuditIntelligence,
  getInventoryIntelligence,
  getStaffIntelligence,
  getMarketingIntelligence,
  getSalesIntelligence,
  getCrossModuleIntelligence,
  generateSmartAlerts,
  queryAiAssistant,
  markAlertAsRead,
  markAllAlertsAsRead,
  deleteAlert,
} = require("../services/intelligenceServices");

async function getFranchiseIntelligenceHandler(req, res) {
  try {
    const result = await getFranchiseIntelligence();
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in getFranchiseIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getExecutiveInsightsHandler(req, res) {
  try {
    const data = await getExecutiveInsights();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getExecutiveInsightsHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getOutletIntelligenceHandler(req, res) {
  try {
    const outletId = req.params.id || req.query.outlet_id || null;
    const data = await getOutletIntelligence(outletId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getOutletIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAuditIntelligenceHandler(req, res) {
  try {
    const data = await getAuditIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getAuditIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getInventoryIntelligenceHandler(req, res) {
  try {
    const data = await getInventoryIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getInventoryIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getStaffIntelligenceHandler(req, res) {
  try {
    const data = await getStaffIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getStaffIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getMarketingIntelligenceHandler(req, res) {
  try {
    const data = await getMarketingIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getMarketingIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getSalesIntelligenceHandler(req, res) {
  try {
    const data = await getSalesIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getSalesIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getCrossModuleIntelligenceHandler(req, res) {
  try {
    const data = await getCrossModuleIntelligence();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getCrossModuleIntelligenceHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getOperationalAlertsHandler(req, res) {
  try {
    const summaryRes = await getFranchiseIntelligence();
    const alerts = summaryRes.data?.alerts || [];
    return res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    console.error("Error in getOperationalAlertsHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function generateSmartAlertsHandler(req, res) {
  try {
    const alerts = await generateSmartAlerts();
    return res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    console.error("Error in generateSmartAlertsHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function queryAiAssistantHandler(req, res) {
  try {
    const { prompt } = req.body || {};
    const result = await queryAiAssistant(prompt || "");
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("Error in queryAiAssistantHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function markAlertAsReadHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await markAlertAsRead(id);
    return res.status(200).json({ success: true, message: "Alert marked as read", data: result });
  } catch (err) {
    console.error("Error in markAlertAsReadHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function markAllAlertsAsReadHandler(req, res) {
  try {
    const result = await markAllAlertsAsRead();
    return res.status(200).json({ success: true, message: "All alerts marked as read", data: result });
  } catch (err) {
    console.error("Error in markAllAlertsAsReadHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteAlertHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await deleteAlert(id);
    return res.status(200).json({ success: true, message: "Alert deleted", data: result });
  } catch (err) {
    console.error("Error in deleteAlertHandler:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
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
};
