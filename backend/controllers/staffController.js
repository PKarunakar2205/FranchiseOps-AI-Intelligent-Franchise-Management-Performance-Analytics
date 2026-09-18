const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffSummary,
  getAllLeaves,
  applyLeave,
  updateLeaveStatus
} = require("../services/staffServices");

exports.getStaffList = async (req, res) => {
  try {
    const staffMembers = await getAllStaff(req.query);
    res.status(200).json({
      success: true,
      message: "Staff members retrieved successfully",
      data: staffMembers
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getStaffMember = async (req, res) => {
  try {
    const member = await getStaffById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Staff member with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Staff member details retrieved successfully",
      data: member
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.createStaffMember = async (req, res) => {
  try {
    const newStaff = await createStaff(req.body);
    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      data: newStaff
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateStaffMember = async (req, res) => {
  try {
    const updated = await updateStaff(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Staff member updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteStaffMember = async (req, res) => {
  try {
    const deleted = await deleteStaff(req.params.id);
    res.status(200).json({
      success: true,
      message: "Staff member deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getStaffMetrics = async (req, res) => {
  try {
    const outletId = req.query.outlet_id || req.params.outletId;
    const summary = await getStaffSummary(outletId);
    res.status(200).json({
      success: true,
      message: "Staff metrics retrieved successfully",
      data: summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    const leaves = await getAllLeaves(req.query);
    res.status(200).json({
      success: true,
      message: "Leave requests retrieved successfully",
      data: leaves
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.createLeaveRequest = async (req, res) => {
  try {
    const newLeave = await applyLeave(req.body);
    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: newLeave
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateLeaveRequestStatus = async (req, res) => {
  try {
    const updated = await updateLeaveStatus(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Leave request updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
