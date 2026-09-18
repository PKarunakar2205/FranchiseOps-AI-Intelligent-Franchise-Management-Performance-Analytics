const {
  getAllOutlets,
  getOutletById,
  createOutlet,
  updateOutlet,
  deleteOutlet
} = require("../services/outletServices");

exports.getOutlets = async (req, res) => {
  try {
    const outlets = await getAllOutlets(req.query);
    res.status(200).json({
      success: true,
      message: "Outlets retrieved successfully",
      data: outlets
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getOutlet = async (req, res) => {
  try {
    const outlet = await getOutletById(req.params.id);
    if (!outlet) {
      return res.status(404).json({
        success: false,
        message: `Outlet with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Outlet details retrieved successfully",
      data: outlet
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.createOutletHandler = async (req, res) => {
  try {
    const newOutlet = await createOutlet(req.body);
    res.status(201).json({
      success: true,
      message: "Outlet created successfully",
      data: newOutlet
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateOutletHandler = async (req, res) => {
  try {
    const updated = await updateOutlet(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Outlet updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteOutletHandler = async (req, res) => {
  try {
    const deleted = await deleteOutlet(req.params.id);
    res.status(200).json({
      success: true,
      message: "Outlet deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
