const prisma = require("../config/prisma");

async function getAllOutlets(filters = {}) {
  const where = {};
  if (filters.region) {
    where.region = filters.region;
  }
  if (filters.city) {
    where.city = filters.city;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  const outlets = await prisma.outlet.findMany({
    where,
    orderBy: { outlet_id: "asc" }
  });

  return outlets;
}

async function getOutletById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Outlet ID");
  }

  const outlet = await prisma.outlet.findUnique({
    where: { outlet_id: numericId },
    include: {
      users: {
        select: {
          user_id: true,
          full_name: true,
          email: true,
          role: true
        }
      }
    }
  });

  return outlet;
}

async function createOutlet(data) {
  if (!data.outlet_name) {
    throw new Error("Outlet name is required");
  }

  const newOutlet = await prisma.outlet.create({
    data: {
      outlet_name: data.outlet_name,
      owner_name: data.owner_name || null,
      manager_name: data.manager_name || null,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      region: data.region || "South",
      franchise_id: data.franchise_id ? parseInt(data.franchise_id, 10) : null,
      health: data.health !== undefined ? parseInt(data.health, 10) : 80,
      revenue: data.revenue !== undefined ? parseFloat(data.revenue) : 0,
      profit: data.profit !== undefined ? parseFloat(data.profit) : 0,
      orders: data.orders !== undefined ? parseInt(data.orders, 10) : 0,
      growth: data.growth !== undefined ? parseFloat(data.growth) : 0,
      rating: data.rating !== undefined ? parseFloat(data.rating) : 4.0,
      status: data.status || "Healthy",
      opening_date: data.opening_date ? new Date(data.opening_date) : null
    }
  });

  return newOutlet;
}

async function updateOutlet(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Outlet ID");
  }

  const existing = await prisma.outlet.findUnique({
    where: { outlet_id: numericId }
  });

  if (!existing) {
    throw new Error("Outlet not found");
  }

  const updateData = {};
  if (data.outlet_name !== undefined) updateData.outlet_name = data.outlet_name;
  if (data.owner_name !== undefined) updateData.owner_name = data.owner_name;
  if (data.manager_name !== undefined) updateData.manager_name = data.manager_name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.state !== undefined) updateData.state = data.state;
  if (data.region !== undefined) updateData.region = data.region;
  if (data.health !== undefined) updateData.health = parseInt(data.health, 10);
  if (data.revenue !== undefined) updateData.revenue = parseFloat(data.revenue);
  if (data.profit !== undefined) updateData.profit = parseFloat(data.profit);
  if (data.orders !== undefined) updateData.orders = parseInt(data.orders, 10);
  if (data.growth !== undefined) updateData.growth = parseFloat(data.growth);
  if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
  if (data.status !== undefined) updateData.status = data.status;

  const updated = await prisma.outlet.update({
    where: { outlet_id: numericId },
    data: updateData
  });

  return updated;
}

async function deleteOutlet(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Outlet ID");
  }

  const existing = await prisma.outlet.findUnique({
    where: { outlet_id: numericId }
  });

  if (!existing) {
    throw new Error("Outlet not found");
  }

  const deleted = await prisma.outlet.delete({
    where: { outlet_id: numericId }
  });

  return deleted;
}

module.exports = {
  getAllOutlets,
  getOutletById,
  createOutlet,
  updateOutlet,
  deleteOutlet
};
