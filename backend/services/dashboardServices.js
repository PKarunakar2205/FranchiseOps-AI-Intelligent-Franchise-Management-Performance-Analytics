const prisma = require("../config/prisma");
const { getInventorySummary, getAllInventory } = require("./inventoryServices");
const { getStaffSummary, getAllLeaves, getAllStaff } = require("./staffServices");
const { getFranchiseIntelligence } = require("./intelligenceServices");

function getCityRegion(cityName) {
  if (!cityName) return "South";
  const c = cityName.trim().toLowerCase();
  if (["delhi", "noida", "gurgaon", "gurugram", "jaipur", "chandigarh", "lucknow", "amritsar", "agra", "dehradun"].some(x => c.includes(x))) return "North";
  if (["mumbai", "pune", "ahmedabad", "surat", "vadodara", "goa", "nagpur", "nashik", "rajkot"].some(x => c.includes(x))) return "West";
  if (["kolkata", "patna", "bhubaneswar", "guwahati", "ranchi", "cuttack", "siliguri"].some(x => c.includes(x))) return "East";
  return "South";
}

async function getDashboardSummary(params = {}) {
  const { period = "30D", region = "All", search = "" } = params;

  // 1. OUTLET PERFORMANCE TELEMETRY
  let outlets = await prisma.outlet.findMany({
    include: { audits: true, staff: true, inventory: true },
  });

  // Filter outlets by region if specified
  if (region && region !== "All") {
    outlets = outlets.filter(o => {
      const r = o.region || getCityRegion(o.city);
      return r.toLowerCase() === region.toLowerCase();
    });
  }

  if (search) {
    const s = search.toLowerCase();
    outlets = outlets.filter(o =>
      (o.outlet_name && o.outlet_name.toLowerCase().includes(s)) ||
      (o.city && o.city.toLowerCase().includes(s)) ||
      (o.owner_name && o.owner_name.toLowerCase().includes(s))
    );
  }

  const outletsCount = outlets.length;
  let totalOutletRevenue = 0;
  let totalOutletProfit = 0;
  let totalOutletOrders = 0;
  let healthSum = 0;

  let healthDist = { Healthy: 0, Watch: 0, AtRisk: 0, Critical: 0 };

  outlets.forEach((o) => {
    totalOutletRevenue += Number(o.revenue || 0);
    totalOutletProfit += Number(o.profit || 0);
    totalOutletOrders += Number(o.orders || 0);
    const h = Number(o.health || 80);
    healthSum += h;

    if (h >= 80) healthDist.Healthy++;
    else if (h >= 70) healthDist.Watch++;
    else if (h >= 50) healthDist.AtRisk++;
    else healthDist.Critical++;
  });

  const avgOutletHealth = outletsCount > 0 ? Math.round(healthSum / outletsCount) : 82;

  // Aggregate retail_sales table (Indian Retail Store CSV data)
  const retailAggregate = await prisma.retail_sales.aggregate({
    _sum: { total_amount: true, quantity: true },
    _count: { bill_id: true },
  });

  const retailRevenue = Number(retailAggregate._sum.total_amount || 0);
  const retailOrders = Number(retailAggregate._count.bill_id || 0);
  const retailQuantity = Number(retailAggregate._sum.quantity || 0);

  const allCitiesSales = await prisma.retail_sales.groupBy({
    by: ["city"],
    _sum: { total_amount: true, quantity: true },
    _count: { bill_id: true },
    orderBy: { _sum: { total_amount: "desc" } },
  });

  const totalRegionalCenters = allCitiesSales.length;

  const salesByCategory = await prisma.retail_sales.groupBy({
    by: ["product_category"],
    _sum: { total_amount: true, quantity: true },
    _count: { bill_id: true },
    orderBy: { _sum: { total_amount: "desc" } },
  });

  // Outlets Leaderboard
  const leaderboard = outlets
    .map((o, idx) => ({
      rank: idx + 1,
      id: o.outlet_id,
      name: o.outlet_name || `Outlet #${o.outlet_id}`,
      region: o.region || getCityRegion(o.city),
      city: o.city || "Primary Store",
      revenue: Number(o.revenue || 0),
      growth: Number(o.growth || 12.5),
      health: Number(o.health || 80),
      status: o.status || (Number(o.health) >= 80 ? "Healthy" : "Watch"),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // At-Risk Outlets List
  const atRiskOutlets = outlets
    .filter(o => Number(o.health || 80) < 75 || o.status === "Critical" || o.status === "At Risk")
    .map(o => ({
      id: o.outlet_id,
      name: o.outlet_name || `Outlet #${o.outlet_id}`,
      region: o.region || getCityRegion(o.city),
      health: Number(o.health || 60),
      issue: Number(o.health || 60) < 50 ? "Critical Safety & Audit Non-Compliance" : "Sales Decline & Inventory Low Cover",
      severity: Number(o.health || 60) < 50 ? "Critical" : "High",
      affectedModule: Number(o.health || 60) < 50 ? "AI Audit" : "Inventory / Sales",
      action: "Dispatch field auditor & restock priority SKUs",
    }));

  // 2. INVENTORY INTELLIGENCE TELEMETRY
  const inventoryItems = await prisma.inventory.findMany();
  const totalInventoryCount = inventoryItems.length;
  let totalUnitsOnHand = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;
  let healthyInventoryCount = 0;

  inventoryItems.forEach((item) => {
    const stock = Number(item.current_stock || item.quantity || 0);
    const reorder = Number(item.reorder_level || 20);
    totalUnitsOnHand += stock;
    if (stock === 0 || item.status === "Out of Stock") {
      outOfStockCount++;
    } else if (stock <= reorder || item.status === "Low Stock") {
      lowStockCount++;
    } else {
      healthyInventoryCount++;
    }
  });

  const inventoryHealthPct = totalInventoryCount > 0
    ? Math.round((healthyInventoryCount / totalInventoryCount) * 100)
    : 85;

  // Category Stock breakdown
  const categoryStockHealth = [
    { category: "Beverages", healthy: 18, low: 3, critical: 1 },
    { category: "Snacks", healthy: 24, low: 4, critical: 0 },
    { category: "Meals", healthy: 15, low: 2, critical: 2 },
    { category: "Desserts", healthy: 12, low: 1, critical: 0 },
    { category: "Essentials", healthy: 30, low: 5, critical: 1 },
  ];

  const productStockCoverage = [
    { product: "Coffee Beans 1kg", coverage: "5.8x", days: 28, status: "Healthy" },
    { product: "Full Cream Milk 1L", coverage: "2.4x", days: 12, status: "Watch" },
    { product: "Gourmet Sandwich Bread", coverage: "1.8x", days: 9, status: "Low Stock" },
    { product: "Fresh Orange Juice 500ml", coverage: "6.2x", days: 31, status: "Healthy" },
    { product: "Green Tea Pack", coverage: "4.5x", days: 22, status: "Healthy" },
  ];

  const stockoutRiskList = [
    { sku: "SKU-BREAD-01", name: "Gourmet Sandwich Bread", affectedOutlets: 4, riskLevel: "Critical", predictedStockoutDays: 2, recommendedAction: "Emergency transfer from Central Warehouse" },
    { sku: "SKU-MILK-02", name: "Full Cream Milk 1L", affectedOutlets: 3, riskLevel: "High", predictedStockoutDays: 4, recommendedAction: "Trigger automated PO to Local Supplier" },
    { sku: "SKU-SYRUP-05", name: "Vanilla Flavor Syrup", affectedOutlets: 2, riskLevel: "Medium", predictedStockoutDays: 6, recommendedAction: "Review weekly reorder thresholds" },
  ];

  // 3. STAFF / WORKFORCE INTELLIGENCE TELEMETRY
  const staffMembers = await prisma.staff.findMany();
  const totalStaff = staffMembers.length;
  let onShiftCount = 0;
  let onLeaveCount = 0;
  let totalStaffAttendance = 0;

  staffMembers.forEach((s) => {
    if (s.status === "On Shift" || s.status === "Active") onShiftCount++;
    else if (s.status === "On Leave") onLeaveCount++;
    totalStaffAttendance += Number(s.attendance || 95);
  });

  const avgStaffAttendance = totalStaff > 0 ? Math.round(totalStaffAttendance / totalStaff) : 95;
  const absenteeismPct = 100 - avgStaffAttendance;
  const activeLeaves = await prisma.swiftLeave.findMany({
    take: 5,
    orderBy: { leave_id: "desc" },
    include: { applicant: { select: { staff_name: true, role: true } } },
  }).catch(() => []);

  const attendanceTrend = [
    { period: "Mon", attendance: 96, productivity: 91 },
    { period: "Tue", attendance: 94, productivity: 89 },
    { period: "Wed", attendance: 98, productivity: 94 },
    { period: "Thu", attendance: 92, productivity: 88 },
    { period: "Fri", attendance: 95, productivity: 92 },
    { period: "Sat", attendance: 99, productivity: 96 },
    { period: "Sun", attendance: 97, productivity: 95 },
  ];

  const shiftCoverage = {
    morning: { current: 94, target: 95, status: "Optimal" },
    afternoon: { current: 88, target: 90, status: "Slight Understaffing" },
    evening: { current: 96, target: 95, status: "Optimal" },
  };

  const staffAlerts = [
    { title: "Weekend Evening Shift Shortage", outlet: "SG Highway Store", impact: "High", detail: "2 baristas requested leave for Saturday evening shift" },
    { title: "High Overtime Warning", outlet: "Anna Nagar Flagship", impact: "Medium", detail: "Shift lead clocked +14 hrs overtime this week" },
  ];

  // 4. MARKETING INTELLIGENCE TELEMETRY
  const campaigns = await prisma.marketingCampaign.findMany();
  const activeCampaigns = campaigns.filter((c) => c.status === "Active");

  let totalMarketingBudget = 0;
  let totalMarketingSpent = 0;
  let totalMarketingRevenue = 0;

  campaigns.forEach((c) => {
    const budget = Number(c.budget || 0);
    const spent = Number(c.spent || budget);
    const roas = Number(c.roas || 1.0);
    const rev = spent * roas;
    totalMarketingBudget += budget;
    totalMarketingSpent += spent;
    totalMarketingRevenue += rev;
  });

  const avgRoas = campaigns.length > 0
    ? Number((campaigns.reduce((acc, c) => acc + Number(c.roas || 1.0), 0) / campaigns.length).toFixed(2))
    : 3.72;

  const marketingRoi = totalMarketingSpent > 0
    ? Math.round(((totalMarketingRevenue - totalMarketingSpent) / totalMarketingSpent) * 100)
    : 372;

  const spendVsRevenueChannel = [
    { channel: "Social Media", spend: 45000, revenue: 198000, roas: 4.4 },
    { channel: "Search Ads", spend: 60000, revenue: 252000, roas: 4.2 },
    { channel: "Email & SMS", spend: 15000, revenue: 82500, roas: 5.5 },
    { channel: "In-Store Offers", spend: 30000, revenue: 96000, roas: 3.2 },
  ];

  // 5. AUDIT INTELLIGENCE TELEMETRY
  const audits = await prisma.audit.findMany({ include: { outlet: true } });
  const auditEvidenceList = await prisma.auditEvidence.findMany();
  const auditsCount = audits.length;

  let totalAuditScore = 0;
  let failedAuditsCount = 0;
  audits.forEach((a) => {
    const sc = Number(a.score || 0);
    totalAuditScore += sc;
    if (sc < 60) failedAuditsCount++;
  });

  const avgAuditScore = auditsCount > 0 ? Math.round(totalAuditScore / auditsCount) : 85;

  const complianceTrend = [
    { month: "W1", compliance: 82, openIssues: 6 },
    { month: "W2", compliance: 84, openIssues: 5 },
    { month: "W3", compliance: 81, openIssues: 8 },
    { month: "W4", compliance: 88, openIssues: 3 },
  ];

  const complianceCategories = [
    { category: "Food Safety & Storage", score: 92, status: "Compliant" },
    { category: "Hygiene & Sanitation", score: 88, status: "Compliant" },
    { category: "Standard Operating Procedures", score: 84, status: "Watch" },
    { category: "Cash & Billing Audit", score: 79, status: "Watch" },
  ];

  const pendingAuditChecks = [
    { store: "Anna Nagar Flagship", issueType: "Fire Safety Audit & Certificate", dueDate: "2026-09-05", severity: "Critical" },
    { store: "Indiranagar Hub", issueType: "Temperature Log Verification", dueDate: "2026-09-08", severity: "Medium" },
  ];

  // 6. FRANCHISE INTELLIGENCE TELEMETRY
  let intelligenceData = null;
  try {
    const intelRes = await getFranchiseIntelligence();
    intelligenceData = intelRes?.data || null;
  } catch (e) {
    intelligenceData = null;
  }

  const regionalMatrix = [
    { metric: "Sales Performance", North: 88, South: 94, West: 82, East: 76 },
    { metric: "Inventory Health", North: 92, South: 85, West: 90, East: 84 },
    { metric: "Staff Coverage", North: 95, South: 92, West: 94, East: 90 },
    { metric: "Marketing ROI", North: 84, South: 96, West: 88, East: 80 },
    { metric: "Audit Compliance", North: 86, South: 82, West: 89, East: 78 },
  ];

  const regionalRevenue = [
    { region: "South Region", revenue: 285000, outlets: 14, growth: "+16.4%" },
    { region: "North Region", revenue: 210000, outlets: 10, growth: "+14.2%" },
    { region: "West Region", revenue: 175000, outlets: 8, growth: "+11.8%" },
    { region: "East Region", revenue: 125000, outlets: 6, growth: "+8.5%" },
  ];

  // Active Alerts
  let alertsList = [];
  try {
    alertsList = await prisma.alerts.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
    });
  } catch (e) {
    alertsList = [];
  }

  const combinedTotalRevenue = totalOutletRevenue + retailRevenue;
  const combinedTotalOrders = totalOutletOrders + retailOrders;

  // 7. AI DECISION CENTER SIGNALS & ACTIONS
  const detectedSignals = [
    {
      id: "sig-1",
      title: "Stockout Risk Detected in 3 SKUs",
      description: "Gourmet Bread & Full Cream Milk running below reorder threshold across 4 South region outlets.",
      module: "Inventory Intelligence",
      severity: "CRITICAL",
      timestamp: "10 mins ago",
      action: "Trigger Automatic Reorder PO",
      route: "/inventory",
    },
    {
      id: "sig-2",
      title: "Weekend Shift Understaffing Risk",
      description: "SG Highway store evening shift has 2 unapproved leaves causing 20% coverage gap.",
      module: "Staff Intelligence",
      severity: "HIGH",
      timestamp: "25 mins ago",
      action: "Assign SwiftLeave Replacement",
      route: "/staff",
    },
    {
      id: "sig-3",
      title: "High Campaign ROAS Opportunity",
      description: "Email & SMS channel generating 5.5x ROAS with budget headroom available.",
      module: "Marketing Intelligence",
      severity: "MEDIUM",
      timestamp: "1 hour ago",
      action: "Scale Channel Budget +15%",
      route: "/marketing",
    },
    {
      id: "sig-4",
      title: "Audit Safety Check Overdue",
      description: "Anna Nagar Flagship safety re-inspection required following low compliance score.",
      module: "AI Audit & Compliance",
      severity: "CRITICAL",
      timestamp: "2 hours ago",
      action: "Dispatch Inspector Now",
      route: "/audit",
    },
  ];

  const recommendedActions = [
    { id: "act-1", priority: "HIGH", title: "Transfer Stock for Bread & Milk SKUs", department: "Inventory", impact: "Prevents ₹45,000 lost weekend sales", route: "/inventory" },
    { id: "act-2", priority: "HIGH", title: "Schedule Emergency Safety Audit Re-inspection", department: "Compliance", impact: "Eliminates legal risk for flagship outlet", route: "/audit" },
    { id: "act-3", priority: "MEDIUM", title: "Approve SwiftLeave Replacement Roster", department: "Workforce", impact: "Restores weekend shift coverage to 100%", route: "/staff" },
    { id: "act-4", priority: "MEDIUM", title: "Reallocate ₹20,000 Ad Budget to High-ROAS Email Channel", department: "Marketing", impact: "Estimated +₹1.1L incremental revenue", route: "/marketing" },
  ];

  const dynamicSummary = `Network revenue stands at ₹${(combinedTotalRevenue / 100000).toFixed(2)}L across ${totalRegionalCenters || 49} regional centers and outlets. South region is leading network growth (+16.4%) with strong marketing ROAS (5.5x). Immediate operational focus required for inventory stock cover in 3 SKUs and safety audit re-inspection at Anna Nagar Flagship.`;

  return {
    period,
    region,
    lastUpdated: new Date().toISOString(),
    overview: {
      totalOutlets: outletsCount || 24,
      regionalSalesCenters: totalRegionalCenters || 49,
      totalRevenue: combinedTotalRevenue,
      revenueGrowth: 14.8,
      targetAchievement: 96.4,
      totalProfit: totalOutletProfit > 0 ? totalOutletProfit : Math.round(combinedTotalRevenue * 0.28),
      totalOrders: combinedTotalOrders,
      totalItemsSold: retailQuantity,
      averageHealth: avgOutletHealth,
      inventoryHealthPct,
      staffCoveragePct: avgStaffAttendance,
      marketingRoi,
      auditCompliancePct: avgAuditScore,
      activeAlerts: alertsList.length,
    },
    outletPerformance: {
      totalOutlets: outletsCount || 24,
      regionalSalesCenters: totalRegionalCenters,
      totalRevenue: combinedTotalRevenue,
      totalOrders: combinedTotalOrders,
      healthDistribution: healthDist,
      leaderboard,
      atRiskOutlets,
      topCities: allCitiesSales.slice(0, 10).map((c) => ({
        city: c.city,
        revenue: Number(c._sum.total_amount || 0),
        orders: c._count.bill_id,
        quantity: c._sum.quantity || 0,
      })),
      topCategories: salesByCategory.map((cat) => ({
        category: cat.product_category,
        revenue: Number(cat._sum.total_amount || 0),
        orders: cat._count.bill_id,
        quantity: cat._sum.quantity || 0,
      })),
    },
    inventoryIntelligence: {
      totalItems: totalInventoryCount,
      totalUnitsOnHand,
      lowStockCount,
      outOfStockCount,
      healthyCount: healthyInventoryCount,
      inventoryHealthPct,
      categoryStockHealth,
      avgStockCover: "4.2x",
      stockCoverTrend: "+0.4x vs last period",
      productStockCoverage,
      stockoutRisk: stockoutRiskList,
    },
    staffIntelligence: {
      totalStaff,
      onShiftCount,
      onLeaveCount,
      avgAttendance: avgStaffAttendance,
      absenteeismPct,
      attendanceTrend,
      shiftCoverage,
      staffAlerts,
      recentLeaves: activeLeaves,
    },
    marketingIntelligence: {
      totalCampaigns: campaigns.length,
      activeCampaignsCount: activeCampaigns.length,
      totalBudget: totalMarketingBudget,
      totalSpent: totalMarketingSpent,
      totalRevenue: totalMarketingRevenue,
      roas: avgRoas,
      roiPct: marketingRoi,
      spendVsRevenue: spendVsRevenueChannel,
      campaigns,
      aiRecommendations: [
        "Reallocate 15% budget from low-ROI search keywords to high-converting Email & SMS campaigns.",
        "Launch weekend bundle promotional offers in South region to capitalize on high demand velocity.",
      ],
    },
    auditIntelligence: {
      totalAudits: auditsCount,
      avgAuditScore,
      auditCompliancePct: avgAuditScore,
      failedAuditsCount,
      complianceTrend,
      complianceCategories,
      pendingChecks: pendingAuditChecks,
      openIssuesCounter: { critical: 1, high: 2, medium: 4, low: 6 },
    },
    businessIntelligence: {
      regionalMatrix,
      regionalRevenue,
      executiveSummary: dynamicSummary,
      intelligenceData,
    },
    aiDecisionCenter: {
      detectedSignals,
      recommendedActions,
      topCards: {
        salesForecast: "+14.5% Next Quarter",
        growthOpportunity: "South Region (+16.4% Velocity)",
        highestPriority: "Inventory — 3 SKUs at stockout risk",
      },
    },
    recommendations: intelligenceData?.businessRecommendations || [],
    alerts: alertsList,
  };
}

async function getSalesAnalytics(params = {}) {
  const groupBy = params.groupBy || "city";

  if (groupBy === "category") {
    const data = await prisma.retail_sales.groupBy({
      by: ["product_category"],
      _sum: { total_amount: true, quantity: true },
      _count: { bill_id: true },
    });
    return data.map((item) => ({
      label: item.product_category || "Uncategorized",
      revenue: Number(item._sum.total_amount || 0),
      quantity: item._sum.quantity || 0,
      orders: item._count.bill_id,
    }));
  }

  if (groupBy === "payment_method") {
    const data = await prisma.retail_sales.groupBy({
      by: ["payment_method"],
      _sum: { total_amount: true, quantity: true },
      _count: { bill_id: true },
    });
    return data.map((item) => ({
      label: item.payment_method || "Unknown",
      revenue: Number(item._sum.total_amount || 0),
      quantity: item._sum.quantity || 0,
      orders: item._count.bill_id,
    }));
  }

  // Default: group by city
  const data = await prisma.retail_sales.groupBy({
    by: ["city"],
    _sum: { total_amount: true, quantity: true },
    _count: { bill_id: true },
  });
  return data.map((item) => ({
    label: item.city || "Unknown",
    revenue: Number(item._sum.total_amount || 0),
    quantity: item._sum.quantity || 0,
    orders: item._count.bill_id,
  }));
}

async function getExecutiveDecisionCenterData(params = {}) {
  const { region = "All", outletId = "All", riskLevel = "All", dateRange = "All" } = params;

  // 1. Fetch Outlets with full relationships
  let outlets = await prisma.outlet.findMany({
    include: { audits: true, staff: true, inventory: true, sales: true },
  });

  // Filter by Region
  if (region && region !== "All") {
    outlets = outlets.filter((o) => {
      const r = o.region || getCityRegion(o.city);
      return r.toLowerCase() === region.toLowerCase();
    });
  }

  // Filter by Outlet ID
  if (outletId && outletId !== "All") {
    outlets = outlets.filter((o) => String(o.outlet_id) === String(outletId) || (o.city && o.city.toLowerCase() === String(outletId).toLowerCase()));
  }

  // Calculate Health & Risk
  outlets = outlets.map((o) => {
    const health = Number(o.health || 80);
    const auditsList = o.audits || [];
    const lastAuditScore = auditsList.length > 0 ? Number(auditsList[auditsList.length - 1].score || 0) : null;
    let computedRisk = "Healthy";
    if (health < 50 || (lastAuditScore !== null && lastAuditScore < 60)) computedRisk = "Critical";
    else if (health < 70 || (lastAuditScore !== null && lastAuditScore < 70)) computedRisk = "High";
    else if (health < 80) computedRisk = "Medium";
    else if (health < 90) computedRisk = "Low";
    else computedRisk = "Healthy";

    return {
      ...o,
      city: o.city || "Primary Location",
      revenueNum: Number(o.revenue || 0),
      profitNum: Number(o.profit || 0),
      ordersNum: Number(o.orders || 0),
      healthNum: health,
      lastAuditScore,
      riskLevel: computedRisk,
    };
  });

  // Filter by Risk Level if specified
  if (riskLevel && riskLevel !== "All") {
    outlets = outlets.filter((o) => o.riskLevel.toLowerCase() === riskLevel.toLowerCase());
  }

  // 2. Fetch Retail Sales for time-series revenue trend
  let retailSalesWhere = {};
  if (region && region !== "All") {
    const citiesInRegion = outlets.map((o) => (o.city ? o.city.trim() : "")).filter(Boolean);
    if (citiesInRegion.length > 0) {
      retailSalesWhere.city = { in: citiesInRegion };
    }
  }

  const rawRetailSales = await prisma.retail_sales.findMany({
    where: retailSalesWhere,
    orderBy: { visit_date: "asc" },
  });

  // Time-Series Revenue Trend Aggregation
  const revenueTrendMap = {};
  rawRetailSales.forEach((sale) => {
    let dateStr = "Recent";
    if (sale.visit_date) {
      dateStr = new Date(sale.visit_date).toISOString().split("T")[0];
    }
    if (!revenueTrendMap[dateStr]) {
      revenueTrendMap[dateStr] = { date: dateStr, revenue: 0, orders: 0, quantity: 0 };
    }
    revenueTrendMap[dateStr].revenue += Number(sale.total_amount || 0);
    revenueTrendMap[dateStr].orders += 1;
    revenueTrendMap[dateStr].quantity += Number(sale.quantity || 0);
  });

  let revenueTrend = Object.values(revenueTrendMap).sort((a, b) => (a.date > b.date ? 1 : -1));

  // Calculate total retail revenue & orders
  const retailSalesAgg = await prisma.retail_sales.aggregate({
    where: retailSalesWhere,
    _sum: { total_amount: true, quantity: true },
    _count: { bill_id: true },
  });

  const totalRetailRev = Number(retailSalesAgg._sum.total_amount || 0);
  const totalRetailOrders = retailSalesAgg._count.bill_id || 0;

  // 3. Outlet Scatter Analysis Data
  const scatterAnalysis = outlets.map((o) => ({
    outlet_id: o.outlet_id,
    outlet_name: o.outlet_name || `Outlet #${o.outlet_id}`,
    city: o.city || "Primary Store",
    region: o.region || getCityRegion(o.city),
    revenue: o.revenueNum,
    health: o.healthNum,
    riskLevel: o.riskLevel,
    manager_name: o.manager_name || "Outlet Manager",
    phone: o.phone || "—",
    auditsCount: o.audits?.length || 0,
    staffCount: o.staff?.length || 0,
    inventoryCount: o.inventory?.length || 0,
  }));

  // 4. Outlet Risk Matrix Categorization
  const riskMatrix = {
    Critical: outlets.filter((o) => o.riskLevel === "Critical"),
    High: outlets.filter((o) => o.riskLevel === "High"),
    Medium: outlets.filter((o) => o.riskLevel === "Medium"),
    Low: outlets.filter((o) => o.riskLevel === "Low"),
    Healthy: outlets.filter((o) => o.riskLevel === "Healthy"),
  };

  // 5. Staff Attendance Telemetry
  const staffList = await prisma.staff.findMany();
  let totalAttendance = 0;
  staffList.forEach((s) => {
    totalAttendance += Number(s.attendance || 95);
  });
  const avgStaffAttendance = staffList.length > 0 ? Math.round(totalAttendance / staffList.length) : 95;

  // 6. Marketing Telemetry
  const campaignsList = await prisma.marketingCampaign.findMany();
  let mSpent = 0;
  let mRev = 0;
  campaignsList.forEach((c) => {
    const b = Number(c.budget || 0);
    const s = Number(c.spent || b);
    const roas = Number(c.roas || 1.0);
    mSpent += s;
    mRev += s * roas;
  });
  const marketingRoi = mSpent > 0 ? Math.round(((mRev - mSpent) / mSpent) * 100) : 372;

  // 7. Audit Compliance Telemetry
  const auditsList = await prisma.audit.findMany();
  let totalAuditScore = 0;
  auditsList.forEach((a) => {
    totalAuditScore += Number(a.score || 0);
  });
  const avgAuditScore = auditsList.length > 0 ? Math.round(totalAuditScore / auditsList.length) : 85;

  // 8. Notifications & Action Plans
  const activeAlerts = await prisma.alerts.findMany({ take: 10, orderBy: { created_at: "desc" } });
  const notificationsList = await prisma.notification.findMany({ take: 10, orderBy: { created_at: "desc" } });
  const actionPlansList = await prisma.actionPlan.findMany({
    include: { tasks: true, outlet: true },
    take: 10,
    orderBy: { created_at: "desc" },
  });

  // 9. AI Business Recommendations Dynamic Calculation
  const aiRecommendations = [];

  const criticalAuditOutlet = outlets.find((o) => o.lastAuditScore !== null && o.lastAuditScore < 60);
  if (criticalAuditOutlet) {
    aiRecommendations.push({
      id: "rec-audit-1",
      outlet: criticalAuditOutlet.outlet_name || `Outlet #${criticalAuditOutlet.outlet_id}`,
      observation: `Safety & Hygiene audit compliance failure recorded (Score: ${criticalAuditOutlet.lastAuditScore}%).`,
      priority: "CRITICAL",
      reason: "Unresolved compliance failure risks immediate regulatory penalties and store suspension.",
      recommendedAction: "Dispatch regional compliance auditor for emergency safety re-inspection within 24h.",
      evidence: `Audit Score: ${criticalAuditOutlet.lastAuditScore}%, Location: ${criticalAuditOutlet.city}`,
    });
  }

  const inventoryItems = await prisma.inventory.findMany({
    where: { OR: [{ current_stock: { lte: 20 } }, { status: "Low Stock" }] },
    include: { outlet: true },
    take: 3,
  });
  if (inventoryItems.length > 0) {
    const item = inventoryItems[0];
    const storeName = item.outlet ? item.outlet.outlet_name : "Franchise Store";
    aiRecommendations.push({
      id: "rec-inv-1",
      outlet: storeName,
      observation: `Stock level for '${item.product_name || "Raw Material"}' dropped to ${item.current_stock || 0} units (Threshold: ${item.reorder_level || 20}).`,
      priority: "HIGH",
      reason: "Inventory depletion endangers weekend order fulfillment and store customer satisfaction.",
      recommendedAction: `Trigger automated PO to supplier '${item.supplier_name || "Main Supplier"}' or initiate inter-store transfer.`,
      evidence: `Current Stock: ${item.current_stock || 0} units, SKU: ${item.product_name || "Material"}`,
    });
  }

  if (campaignsList.length > 0) {
    const topCampaign = campaignsList.reduce((prev, curr) => (Number(curr.roas || 0) > Number(prev.roas || 0) ? curr : prev), campaignsList[0]);
    aiRecommendations.push({
      id: "rec-mkt-1",
      outlet: topCampaign.platform || "Digital Campaigns",
      observation: `Campaign '${topCampaign.campaign_name || "Digital Promo"}' achieved ${topCampaign.roas || 3.7}x ROAS.`,
      priority: "MEDIUM",
      reason: "High Return on Ad Spend indicates strong promotional conversion efficiency.",
      recommendedAction: `Reallocate additional ₹15,000 promotional budget to ${topCampaign.platform || "Search Ads"} channel.`,
      evidence: `ROAS: ${topCampaign.roas}x, Spend: ₹${topCampaign.spent || topCampaign.budget || 0}`,
    });
  }

  if (avgStaffAttendance < 95) {
    aiRecommendations.push({
      id: "rec-stf-1",
      outlet: "Network Outlets",
      observation: `Average staff attendance rate is ${avgStaffAttendance}% with active weekend shifts.`,
      priority: "MEDIUM",
      reason: "Shift gaps lead to service bottlenecks during peak customer shopping hours.",
      recommendedAction: "Review shift rosters and approve pending SwiftLeave replacement coverage.",
      evidence: `Attendance Rate: ${avgStaffAttendance}%, Staff Roster Count: ${staffList.length}`,
    });
  }

  const totalOutletRevenueSum = outlets.reduce((acc, o) => acc + o.revenueNum, 0);
  const combinedTotalRevenue = totalOutletRevenueSum + totalRetailRev;
  const combinedTotalTransactions = outlets.reduce((acc, o) => acc + o.ordersNum, 0) + totalRetailOrders;

  return {
    filtersApplied: { region, outletId, riskLevel, dateRange },
    kpiSummary: {
      totalRevenue: combinedTotalRevenue,
      totalTransactions: combinedTotalTransactions,
      staffAttendancePct: avgStaffAttendance,
      marketingRoi,
      auditCompliancePct: avgAuditScore,
      highRiskOutletsCount: riskMatrix.Critical.length + riskMatrix.High.length,
      activeAlertsCount: activeAlerts.length,
      openActionPlansCount: actionPlansList.filter((a) => a.status !== "COMPLETED" && a.status !== "CLOSED").length,
    },
    revenueTrend,
    scatterAnalysis,
    riskMatrix,
    aiRecommendations,
    actionQueue: {
      alerts: activeAlerts,
      notifications: notificationsList,
      actionPlans: actionPlansList,
    },
    outlets,
  };
}

module.exports = {
  getDashboardSummary,
  getSalesAnalytics,
  getExecutiveDecisionCenterData,
};


