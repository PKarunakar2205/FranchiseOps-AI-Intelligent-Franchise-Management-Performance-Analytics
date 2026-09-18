const prisma = require("../config/prisma");

// --- CAMPAIGNS ---

async function getAllCampaigns(filters = {}) {
  const where = {};
  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.platform) {
    where.platform = filters.platform;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  const campaigns = await prisma.marketingCampaign.findMany({
    where,
    orderBy: { campaign_id: "desc" }
  });

  return campaigns;
}

async function getCampaignById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Campaign ID");
  }

  const campaign = await prisma.marketingCampaign.findUnique({
    where: { campaign_id: numericId }
  });

  return campaign;
}

async function createCampaign(data) {
  if (!data.campaign_name) {
    throw new Error("Campaign name is required");
  }

  const newCampaign = await prisma.marketingCampaign.create({
    data: {
      campaign_name: data.campaign_name,
      outlet_id: data.outlet_id ? parseInt(data.outlet_id, 10) : null,
      campaign_type: data.campaign_type || "Social",
      platform: data.platform || "Google Ads",
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
      budget: data.budget !== undefined ? parseFloat(data.budget) : 0,
      spent: data.spent !== undefined ? parseFloat(data.spent) : 0,
      impressions: data.impressions !== undefined ? parseInt(data.impressions, 10) : 0,
      clicks: data.clicks !== undefined ? parseInt(data.clicks, 10) : 0,
      conversions: data.conversions !== undefined ? parseInt(data.conversions, 10) : 0,
      expected_reach: data.expected_reach !== undefined ? parseInt(data.expected_reach, 10) : null,
      roas: data.roas !== undefined ? parseFloat(data.roas) : 0.0,
      status: data.status || "Active"
    }
  });

  return newCampaign;
}

async function updateCampaign(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Campaign ID");
  }

  const existing = await prisma.marketingCampaign.findUnique({
    where: { campaign_id: numericId }
  });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  const updateData = {};
  if (data.campaign_name !== undefined) updateData.campaign_name = data.campaign_name;
  if (data.campaign_type !== undefined) updateData.campaign_type = data.campaign_type;
  if (data.platform !== undefined) updateData.platform = data.platform;
  if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
  if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
  if (data.budget !== undefined) updateData.budget = parseFloat(data.budget);
  if (data.spent !== undefined) updateData.spent = parseFloat(data.spent);
  if (data.impressions !== undefined) updateData.impressions = parseInt(data.impressions, 10);
  if (data.clicks !== undefined) updateData.clicks = parseInt(data.clicks, 10);
  if (data.conversions !== undefined) updateData.conversions = parseInt(data.conversions, 10);
  if (data.expected_reach !== undefined) updateData.expected_reach = parseInt(data.expected_reach, 10);
  if (data.roas !== undefined) updateData.roas = parseFloat(data.roas);
  if (data.status !== undefined) updateData.status = data.status;

  const updated = await prisma.marketingCampaign.update({
    where: { campaign_id: numericId },
    data: updateData
  });

  return updated;
}

async function deleteCampaign(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Campaign ID");
  }

  const existing = await prisma.marketingCampaign.findUnique({
    where: { campaign_id: numericId }
  });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  const deleted = await prisma.marketingCampaign.delete({
    where: { campaign_id: numericId }
  });

  return deleted;
}

// --- PROMOTIONS ---

async function getAllPromotions(filters = {}) {
  const where = {};
  if (filters.status) {
    where.status = filters.status;
  }

  const promotions = await prisma.promotion.findMany({
    where,
    orderBy: { promotion_id: "desc" }
  });

  return promotions;
}

async function getPromotionById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Promotion ID");
  }

  const promotion = await prisma.promotion.findUnique({
    where: { promotion_id: numericId }
  });

  return promotion;
}

async function createPromotion(data) {
  if (!data.promo_code || !data.title || data.discount_pct === undefined) {
    throw new Error("Missing required parameters (promo_code, title, discount_pct)");
  }

  const newPromotion = await prisma.promotion.create({
    data: {
      promo_code: data.promo_code,
      title: data.title,
      discount_pct: parseFloat(data.discount_pct),
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
      status: data.status || "Active",
      usage_count: data.usage_count ? parseInt(data.usage_count, 10) : 0
    }
  });

  return newPromotion;
}

async function updatePromotion(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Promotion ID");
  }

  const existing = await prisma.promotion.findUnique({
    where: { promotion_id: numericId }
  });

  if (!existing) {
    throw new Error("Promotion not found");
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.discount_pct !== undefined) updateData.discount_pct = parseFloat(data.discount_pct);
  if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
  if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.usage_count !== undefined) updateData.usage_count = parseInt(data.usage_count, 10);

  const updated = await prisma.promotion.update({
    where: { promotion_id: numericId },
    data: updateData
  });

  return updated;
}

// --- SUMMARY ---

async function getMarketingSummary(outletId) {
  const where = {};
  if (outletId) {
    where.outlet_id = parseInt(outletId, 10);
  }

  const campaigns = await prisma.marketingCampaign.findMany({ where });

  const totalCampaigns = campaigns.length;
  let activeCampaigns = 0;
  let totalBudget = 0;
  let totalSpent = 0;
  let totalImpressions = 0;
  let totalConversions = 0;
  let roasSum = 0;

  campaigns.forEach(c => {
    if (c.status === "Active") activeCampaigns++;
    totalBudget += Number(c.budget || 0);
    totalSpent += Number(c.spent || 0);
    totalImpressions += Number(c.impressions || 0);
    totalConversions += Number(c.conversions || 0);
    roasSum += Number(c.roas || 0);
  });

  const avgRoas = totalCampaigns > 0 ? parseFloat((roasSum / totalCampaigns).toFixed(2)) : 0.0;

  return {
    totalCampaigns,
    activeCampaigns,
    totalBudget,
    totalSpent,
    totalImpressions,
    totalConversions,
    avgRoas
  };
}

module.exports = {
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
};
