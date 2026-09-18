const {
  getAllAudits,
  getAuditSummary,
  getAllEvidence,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence
} = require("../services/auditServices");

exports.getAuditsHandler = async (req, res) => {
  try {
    const audits = await getAllAudits(req.query);
    res.status(200).json({
      success: true,
      message: "Audit records retrieved successfully",
      data: audits
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAuditSummaryHandler = async (req, res) => {
  try {
    const outletId = req.query.outlet_id || req.params.outletId;
    const summary = await getAuditSummary(outletId);
    res.status(200).json({
      success: true,
      message: "Audit risk summary retrieved successfully",
      data: summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getEvidenceListHandler = async (req, res) => {
  try {
    const evidence = await getAllEvidence(req.query);
    res.status(200).json({
      success: true,
      message: "Audit evidence records retrieved successfully",
      data: evidence
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.createEvidenceHandler = async (req, res) => {
  try {
    const newEvidence = await createEvidence(req.body);
    res.status(201).json({
      success: true,
      message: "Audit evidence record created successfully",
      data: newEvidence
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateEvidenceHandler = async (req, res) => {
  try {
    const updated = await updateEvidence(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Audit evidence record updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteEvidenceHandler = async (req, res) => {
  try {
    const deleted = await deleteEvidence(req.params.id);
    res.status(200).json({
      success: true,
      message: "Audit evidence record deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
