const {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getLowStockItems,
  getInventorySummary
} = require("../services/inventoryServices");

exports.getInventoryList = async (req, res) => {
  try {
    const items = await getAllInventory(req.query);
    res.status(200).json({
      success: true,
      message: "Inventory items retrieved successfully",
      data: items
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getInventoryItem = async (req, res) => {
  try {
    const item = await getInventoryById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Inventory item with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item retrieved successfully",
      data: item
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = await createInventory(req.body);
    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      data: newItem
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updated = await updateInventory(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deleted = await deleteInventory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
      data: deleted
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const outletId = req.query.outlet_id || req.params.outletId;
    const lowStock = await getLowStockItems(outletId);
    res.status(200).json({
      success: true,
      message: "Low stock items retrieved successfully",
      data: lowStock
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const outletId = req.query.outlet_id || req.params.outletId;
    const summary = await getInventorySummary(outletId);
    res.status(200).json({
      success: true,
      message: "Inventory summary retrieved successfully",
      data: summary
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
