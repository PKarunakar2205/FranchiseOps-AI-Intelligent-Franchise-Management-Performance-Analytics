const prisma = require("../config/prisma");

async function getAllInventory(filters = {}) {
  const where = {};

  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  const items = await prisma.inventory.findMany({
    where,
    orderBy: { inventory_id: "asc" }
  });

  return items;
}

async function getInventoryById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Inventory ID");
  }

  const item = await prisma.inventory.findUnique({
    where: { inventory_id: numericId }
  });

  return item;
}

async function createInventory(data) {
  if (!data.product_name) {
    throw new Error("Product name is required");
  }

  const currentStock = data.current_stock !== undefined ? parseInt(data.current_stock, 10) : (data.quantity !== undefined ? parseInt(data.quantity, 10) : 0);
  const reorderLevel = data.reorder_level !== undefined ? parseInt(data.reorder_level, 10) : 20;

  let status = data.status;
  if (!status) {
    if (currentStock === 0) {
      status = "Out of Stock";
    } else if (currentStock <= reorderLevel) {
      status = "Low Stock";
    } else {
      status = "Healthy";
    }
  }

  const newItem = await prisma.inventory.create({
    data: {
      outlet_id: data.outlet_id ? parseInt(data.outlet_id, 10) : null,
      product_id: data.product_id ? parseInt(data.product_id, 10) : null,
      product_name: data.product_name,
      category: data.category || "General",
      quantity: currentStock,
      unit_price: data.unit_price ? parseFloat(data.unit_price) : 0,
      current_stock: currentStock,
      reorder_level: reorderLevel,
      supplier_name: data.supplier_name || null,
      batch_no: data.batch_no || null,
      expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
      status: status
    }
  });

  return newItem;
}

async function updateInventory(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Inventory ID");
  }

  const existing = await prisma.inventory.findUnique({
    where: { inventory_id: numericId }
  });

  if (!existing) {
    throw new Error("Inventory item not found");
  }

  const updateData = {};
  if (data.product_name !== undefined) updateData.product_name = data.product_name;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.unit_price !== undefined) updateData.unit_price = parseFloat(data.unit_price);
  if (data.supplier_name !== undefined) updateData.supplier_name = data.supplier_name;
  if (data.batch_no !== undefined) updateData.batch_no = data.batch_no;
  if (data.expiry_date !== undefined) updateData.expiry_date = new Date(data.expiry_date);

  let newStock = existing.current_stock;
  if (data.current_stock !== undefined) {
    newStock = parseInt(data.current_stock, 10);
    updateData.current_stock = newStock;
    updateData.quantity = newStock;
  }

  let newReorder = existing.reorder_level;
  if (data.reorder_level !== undefined) {
    newReorder = parseInt(data.reorder_level, 10);
    updateData.reorder_level = newReorder;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  } else if (data.current_stock !== undefined || data.reorder_level !== undefined) {
    if (newStock === 0) {
      updateData.status = "Out of Stock";
    } else if (newStock <= newReorder) {
      updateData.status = "Low Stock";
    } else {
      updateData.status = "Healthy";
    }
  }

  updateData.last_updated = new Date();

  const updated = await prisma.inventory.update({
    where: { inventory_id: numericId },
    data: updateData
  });

  return updated;
}

async function deleteInventory(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Inventory ID");
  }

  const existing = await prisma.inventory.findUnique({
    where: { inventory_id: numericId }
  });

  if (!existing) {
    throw new Error("Inventory item not found");
  }

  const deleted = await prisma.inventory.delete({
    where: { inventory_id: numericId }
  });

  return deleted;
}

async function getLowStockItems(outletId) {
  const where = {};
  if (outletId) {
    where.outlet_id = parseInt(outletId, 10);
  }

  const items = await prisma.inventory.findMany({
    where,
    orderBy: { current_stock: "asc" }
  });

  const lowStock = items.filter(item => {
    const stock = item.current_stock || 0;
    const reorder = item.reorder_level || 20;
    return stock <= reorder || item.status === "Low Stock" || item.status === "Out of Stock";
  });

  return lowStock;
}

async function getInventorySummary(outletId) {
  const where = {};
  if (outletId) {
    where.outlet_id = parseInt(outletId, 10);
  }

  const items = await prisma.inventory.findMany({ where });

  let totalItems = items.length;
  let healthyCount = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  items.forEach(item => {
    const stock = item.current_stock || 0;
    const reorder = item.reorder_level || 20;
    if (stock === 0 || item.status === "Out of Stock") {
      outOfStockCount++;
    } else if (stock <= reorder || item.status === "Low Stock") {
      lowStockCount++;
    } else {
      healthyCount++;
    }
  });

  return {
    totalItems,
    healthyCount,
    lowStockCount,
    outOfStockCount
  };
}

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  getLowStockItems,
  getInventorySummary
};
