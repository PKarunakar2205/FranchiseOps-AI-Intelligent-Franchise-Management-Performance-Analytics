// FranchiseOps AI - Enterprise Marketing Agent Mock Dataset

export const MARKETING_KPIS = [
  {
    id: "total_campaigns",
    title: "Total Campaigns",
    value: "148",
    trend: "+12.5%",
    isPositive: true,
    category: "Campaigns",
    description: "Total marketing campaigns executed across all franchise outlets this fiscal year.",
    sparkline: [20, 25, 30, 28, 35, 42, 48, 55, 60, 68, 75, 84],
    target: "150 Target"
  },
  {
    id: "active_campaigns",
    title: "Active Campaigns",
    value: "32",
    trend: "+4.2%",
    isPositive: true,
    category: "Campaigns",
    description: "Currently running multi-channel marketing campaigns.",
    sparkline: [18, 22, 25, 24, 28, 26, 29, 31, 30, 32, 33, 32],
    target: "30-35 Optimal"
  },
  {
    id: "completed_campaigns",
    title: "Completed Campaigns",
    value: "104",
    trend: "+18.1%",
    isPositive: true,
    category: "Campaigns",
    description: "Successfully concluded campaigns with full ROI audit.",
    sparkline: [40, 45, 52, 60, 68, 74, 80, 88, 92, 98, 101, 104],
    target: "100 Milestone"
  },
  {
    id: "campaign_roi",
    title: "Campaign ROI",
    value: "4.85x",
    trend: "+0.65x",
    isPositive: true,
    category: "Financials",
    description: "Average return on investment generated per marketing dollar spent.",
    sparkline: [3.2, 3.5, 3.8, 4.0, 4.1, 4.3, 4.4, 4.6, 4.7, 4.8, 4.82, 4.85],
    target: "4.5x Benchmark"
  },
  {
    id: "marketing_spend",
    title: "Marketing Spend",
    value: "₹42,85,000",
    trend: "+8.4%",
    isPositive: false,
    category: "Financials",
    description: "Total ad spend, promotional budget, and influencer payouts.",
    sparkline: [28, 30, 32, 31, 35, 34, 37, 39, 40, 41, 42, 42.85],
    target: "₹45L Budget Cap"
  },
  {
    id: "revenue_generated",
    title: "Revenue Generated",
    value: "₹2,07,82,250",
    trend: "+24.8%",
    isPositive: true,
    category: "Financials",
    description: "Direct gross revenue attributed to marketing campaigns.",
    sparkline: [95, 110, 125, 140, 155, 168, 175, 185, 192, 198, 202, 207.8],
    target: "₹2.0Cr Target"
  },
  {
    id: "cpa",
    title: "Cost Per Acquisition (CPA)",
    value: "₹342",
    trend: "-12.4%",
    isPositive: true, // lower CPA is good
    category: "Conversion",
    description: "Average cost incurred to acquire a paying franchise customer.",
    sparkline: [420, 410, 395, 380, 370, 365, 355, 350, 348, 345, 344, 342],
    target: "₹350 Max Cap"
  },
  {
    id: "clv",
    title: "Customer Lifetime Value (CLV)",
    value: "₹14,500",
    trend: "+15.2%",
    isPositive: true,
    category: "Growth",
    description: "Predicted net value attributed to the entire future relationship with a customer.",
    sparkline: [110, 115, 120, 122, 128, 130, 134, 138, 140, 142, 144, 145],
    target: "₹13,500 Goal"
  },
  {
    id: "conversion_rate",
    title: "Conversion Rate",
    value: "4.82%",
    trend: "+0.94%",
    isPositive: true,
    category: "Conversion",
    description: "Percentage of total traffic/leads converting into paying orders.",
    sparkline: [3.1, 3.3, 3.5, 3.8, 4.0, 4.1, 4.3, 4.5, 4.6, 4.7, 4.8, 4.82],
    target: "4.0% Target"
  },
  {
    id: "customer_acquisition",
    title: "New Customer Acquisition",
    value: "12,530",
    trend: "+21.3%",
    isPositive: true,
    category: "Growth",
    description: "First-time buyers acquired through active campaigns.",
    sparkline: [7500, 8100, 8800, 9200, 9900, 10400, 11000, 11500, 11900, 12200, 12400, 12530],
    target: "12,000 Milestone"
  },
  {
    id: "repeat_customers",
    title: "Repeat Customer Rate",
    value: "41.6%",
    trend: "+5.4%",
    isPositive: true,
    category: "Growth",
    description: "Ratio of customers making more than one purchase within 60 days.",
    sparkline: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 41.2, 41.6],
    target: "40.0% Goal"
  },
  {
    id: "health_score",
    title: "Marketing Health Score",
    value: "94.2/100",
    trend: "+3.8",
    isPositive: true,
    category: "AI Score",
    description: "Composite AI score based on ROI, CPA efficiency, brand reach, and engagement.",
    sparkline: [82, 84, 85, 86, 88, 89, 90, 91, 92, 93, 94, 94.2],
    target: "90+ Excellent"
  },
  {
    id: "social_reach",
    title: "Social Media Reach",
    value: "2.85M",
    trend: "+34.2%",
    isPositive: true,
    category: "Engagement",
    description: "Unique audience impressions across Instagram, Facebook, LinkedIn, Twitter, and YouTube.",
    sparkline: [1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5, 2.6, 2.7, 2.8, 2.85],
    target: "2.5M Target"
  },
  {
    id: "website_visitors",
    title: "Website Visitors",
    value: "485.2K",
    trend: "+19.8%",
    isPositive: true,
    category: "Engagement",
    description: "Unique website & store locator visitors across mobile app & web portals.",
    sparkline: [310, 330, 350, 380, 400, 420, 440, 455, 465, 475, 480, 485.2],
    target: "450K Goal"
  },
  {
    id: "email_open_rate",
    title: "Email Open Rate",
    value: "28.4%",
    trend: "+4.1%",
    isPositive: true,
    category: "Engagement",
    description: "Average open percentage across automated drip and promotional campaigns.",
    sparkline: [21, 22, 23, 24, 25, 25.5, 26, 27, 27.5, 28, 28.2, 28.4],
    target: "25.0% Industry Avg"
  },
  {
    id: "ai_confidence",
    title: "AI Confidence Score",
    value: "98.5%",
    trend: "+1.2%",
    isPositive: true,
    category: "AI Score",
    description: "Real-time accuracy score of AI attribution models & budget recommendations.",
    sparkline: [92, 93, 94, 95, 96, 96.5, 97, 97.5, 98, 98.2, 98.4, 98.5],
    target: "95% Minimum"
  }
];

export const CAMPAIGN_TYPES = [
  "Social Media Ad",
  "Influencer Marketing",
  "Email Campaign",
  "Search Engine Ad (PPC)",
  "Local Billboard & Print",
  "Festival Promotion",
  "Loyalty Referral"
];

export const REGIONS = [
  "All Regions",
  "South India (Chennai, BLR, HYD)",
  "West India (Mumbai, Pune, ADM)",
  "North India (Delhi NCR, CHD, LKO)",
  "East India (Kolkata, GAU)"
];

export const OUTLETS = [
  "All Outlets",
  "Chennai - T. Nagar Flagship",
  "Bengaluru - Indiranagar Hub",
  "Hyderabad - Jubilee Hills",
  "Mumbai - Bandra West",
  "Pune - Viman Nagar",
  "Delhi - Connaught Place",
  "Kolkata - Park Street"
];

export const CAMPAIGN_DATA = [
  {
    id: "CMP-901",
    name: "Summer Chill Cooler Offer",
    type: "Social Media Ad",
    budget: 450000,
    spent: 420000,
    revenue: 2450000,
    roi: 5.83,
    status: "Running",
    startDate: "2026-06-01",
    endDate: "2026-08-15",
    targetAudience: "Age 18–35, Tech-savvy Urban",
    leadsGenerated: 18450,
    conversions: 2450,
    cpl: 22.7,
    manager: "Aarav Sharma",
    region: "South India (Chennai, BLR, HYD)",
    outlet: "Chennai - T. Nagar Flagship"
  },
  {
    id: "CMP-902",
    name: "Monsoon Festive BOGO Blitz",
    type: "Festival Promotion",
    budget: 600000,
    spent: 580000,
    revenue: 3120000,
    roi: 5.38,
    status: "Running",
    startDate: "2026-07-10",
    endDate: "2026-08-25",
    targetAudience: "Families, Working Professionals",
    leadsGenerated: 24100,
    conversions: 3820,
    cpl: 24.0,
    manager: "Priya Nair",
    region: "West India (Mumbai, Pune, ADM)",
    outlet: "Mumbai - Bandra West"
  },
  {
    id: "CMP-903",
    name: "BLR Tech Park Lunch Combo",
    type: "Search Engine Ad (PPC)",
    budget: 300000,
    spent: 295000,
    revenue: 1680000,
    roi: 5.69,
    status: "Running",
    startDate: "2026-05-15",
    endDate: "2026-08-30",
    targetAudience: "IT Corporate Employees",
    leadsGenerated: 12800,
    conversions: 1940,
    cpl: 23.0,
    manager: "Karthik Raja",
    region: "South India (Chennai, BLR, HYD)",
    outlet: "Bengaluru - Indiranagar Hub"
  },
  {
    id: "CMP-904",
    name: "VIP Gourmet Coffee Launch",
    type: "Influencer Marketing",
    budget: 500000,
    spent: 500000,
    revenue: 2950000,
    roi: 5.90,
    status: "Completed",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetAudience: "Coffee Enthusiasts, Gen Z",
    leadsGenerated: 21500,
    conversions: 3200,
    cpl: 23.2,
    manager: "Sneha Reddy",
    region: "South India (Chennai, BLR, HYD)",
    outlet: "Hyderabad - Jubilee Hills"
  },
  {
    id: "CMP-905",
    name: "Delhi NCR Weekend Breakfast Delight",
    type: "Local Billboard & Print",
    budget: 350000,
    spent: 350000,
    revenue: 1250000,
    roi: 3.57,
    status: "Paused",
    startDate: "2026-03-01",
    endDate: "2026-05-31",
    targetAudience: "Early Birds & Morning Walkers",
    leadsGenerated: 8900,
    conversions: 1120,
    cpl: 39.3,
    manager: "Rohan Verma",
    region: "North India (Delhi NCR, CHD, LKO)",
    outlet: "Delhi - Connaught Place"
  },
  {
    id: "CMP-906",
    name: "Monsoon Hot Beverages Email Drip",
    type: "Email Campaign",
    budget: 120000,
    spent: 98000,
    revenue: 840000,
    roi: 8.57,
    status: "Running",
    startDate: "2026-07-01",
    endDate: "2026-09-01",
    targetAudience: "Existing Loyalty Members",
    leadsGenerated: 9400,
    conversions: 1850,
    cpl: 10.4,
    manager: "Priya Nair",
    region: "West India (Mumbai, Pune, ADM)",
    outlet: "Pune - Viman Nagar"
  },
  {
    id: "CMP-907",
    name: "College Campus Youth Pass",
    type: "Loyalty Referral",
    budget: 200000,
    spent: 180000,
    revenue: 1150000,
    roi: 6.39,
    status: "Running",
    startDate: "2026-06-15",
    endDate: "2026-09-15",
    targetAudience: "University Students",
    leadsGenerated: 15600,
    conversions: 2600,
    cpl: 11.5,
    manager: "Aarav Sharma",
    region: "East India (Kolkata, GAU)",
    outlet: "Kolkata - Park Street"
  },
  {
    id: "CMP-908",
    name: "Diwali Early Bird Catering Ads",
    type: "Search Engine Ad (PPC)",
    budget: 750000,
    spent: 0,
    revenue: 0,
    roi: 0,
    status: "Draft",
    startDate: "2026-09-01",
    endDate: "2026-11-15",
    targetAudience: "Corporate & Event Planners",
    leadsGenerated: 0,
    conversions: 0,
    cpl: 0,
    manager: "Karthik Raja",
    region: "North India (Delhi NCR, CHD, LKO)",
    outlet: "Delhi - Connaught Place"
  }
];

export const REVENUE_BY_CAMPAIGN = [
  { campaign: "Summer Chill", revenue: 24.5, spend: 4.2, roi: 5.8 },
  { campaign: "Monsoon BOGO", revenue: 31.2, spend: 5.8, roi: 5.4 },
  { campaign: "BLR Tech Lunch", revenue: 16.8, spend: 2.9, roi: 5.7 },
  { campaign: "Gourmet Coffee", revenue: 29.5, spend: 5.0, roi: 5.9 },
  { campaign: "Hot Bev Email", revenue: 8.4, spend: 0.98, roi: 8.6 },
  { campaign: "Youth Pass", revenue: 11.5, spend: 1.8, roi: 6.4 },
  { campaign: "Delhi Breakfast", revenue: 12.5, spend: 3.5, roi: 3.6 }
];

export const MONTHLY_SPEND_VS_REVENUE = [
  { month: "Jan", spend: 2.8, revenue: 12.4, roi: 4.4 },
  { month: "Feb", spend: 3.0, revenue: 14.1, roi: 4.7 },
  { month: "Mar", spend: 3.5, revenue: 16.8, roi: 4.8 },
  { month: "Apr", spend: 3.8, revenue: 18.2, roi: 4.78 },
  { month: "May", spend: 4.0, revenue: 19.5, roi: 4.87 },
  { month: "Jun", spend: 4.1, revenue: 20.1, roi: 4.9 },
  { month: "Jul", spend: 4.28, revenue: 20.78, roi: 4.85 }
];

export const CONVERSION_FUNNEL_DATA = [
  { stage: "Impressions", count: 2850000, percentage: "100%", fill: "#6366f1" },
  { stage: "Ad Clicks / Visits", count: 485200, percentage: "17.0%", fill: "#3b82f6" },
  { stage: "Leads Captured", count: 102750, percentage: "21.1%", fill: "#06b6d4" },
  { stage: "Cart Additions", count: 32400, percentage: "31.5%", fill: "#10b981" },
  { stage: "Final Orders", count: 23395, percentage: "72.2%", fill: "#22c55e" }
];

export const CUSTOMER_SEGMENTS = [
  {
    name: "Premium VIP",
    count: 4820,
    percentage: 18.2,
    revenue: "₹72,40,000",
    avgSpend: "₹15,020",
    retentionScore: 94.5,
    aiSuggestion: "Offer exclusive tasting invites & personal concierge rewards to maintain top retention.",
    color: "#8b5cf6"
  },
  {
    name: "Regular Loyalists",
    count: 12450,
    percentage: 47.0,
    revenue: "₹99,60,000",
    avgSpend: "₹8,000",
    retentionScore: 86.2,
    aiSuggestion: "Enroll in cross-category tier progression to boost average basket size by 15%.",
    color: "#3b82f6"
  },
  {
    name: "New Explorers",
    count: 5800,
    percentage: 21.9,
    revenue: "₹23,20,000",
    avgSpend: "₹4,000",
    retentionScore: 68.0,
    aiSuggestion: "Send 7-day onboarding discount code via WhatsApp & SMS to trigger second order.",
    color: "#10b981"
  },
  {
    name: "Dormant (30-60d)",
    count: 2100,
    percentage: 7.9,
    revenue: "₹8,40,000",
    avgSpend: "₹4,000",
    retentionScore: 42.0,
    aiSuggestion: "Launch re-engagement 'We Miss You' 25% OFF push notification series.",
    color: "#f59e0b"
  },
  {
    name: "High Risk Churn",
    count: 1320,
    percentage: 5.0,
    revenue: "₹4,22,250",
    avgSpend: "₹3,198",
    retentionScore: 21.5,
    aiSuggestion: "Trigger instant CSAT inquiry call & high-value cashback offer.",
    color: "#ef4444"
  }
];

export const AI_RECOMMENDATIONS = [
  {
    id: "REC-101",
    title: "Launch Discount Campaign in Chennai",
    priority: "High",
    confidence: "96.4%",
    impact: "High Revenue Opportunity",
    estRevenue: "₹8,50,000",
    expectedRoi: "6.2x",
    category: "Geo Targeting",
    description: "Chennai T. Nagar store shows 42% spike in weekend footfall demand. Launching a targeted Meta Ad campaign can boost gross sales by ₹8.5L with minimal spend.",
    actionText: "Launch Chennai Campaign Now"
  },
  {
    id: "REC-102",
    title: "Double Facebook Ads Budget for BOGO Blitz",
    priority: "Critical",
    confidence: "98.1%",
    impact: "Top ROI Channel",
    estRevenue: "₹12,40,000",
    expectedRoi: "7.1x",
    category: "Budget Optimization",
    description: "Facebook Ads are generating 5.38x ROI with CAC of ₹220. Increasing daily ad spend by ₹50,000 will scale conversions without diminishing returns.",
    actionText: "Scale FB Ads Budget"
  },
  {
    id: "REC-103",
    title: "Email Drip CTR Increased by 15%",
    priority: "Medium",
    confidence: "92.0%",
    impact: "Retention Boost",
    estRevenue: "₹3,80,000",
    expectedRoi: "8.5x",
    category: "Email Marketing",
    description: "Subject lines featuring 'Weekend Chef Special' have a 34% open rate. Expand this line to Bangalore & Hyderabad subscriber bases.",
    actionText: "Apply Winning Email Templates"
  },
  {
    id: "REC-104",
    title: "Pause Delhi Breakfast Billboard Campaign",
    priority: "Critical",
    confidence: "95.2%",
    impact: "Cost Reduction",
    estRevenue: "Cost Saved: ₹1,50,000",
    expectedRoi: "Reallocate to PPC",
    category: "Ad Pruning",
    description: "CPL on Delhi Outdoor Print is ₹39.3 (65% above benchmark). Reallocate remaining budget to hyper-local Google Search Ads.",
    actionText: "Pause Underperforming Ads"
  },
  {
    id: "REC-105",
    title: "Target Age Group 18–30 on Instagram Reels",
    priority: "High",
    confidence: "94.8%",
    impact: "Youth Market Grab",
    estRevenue: "₹6,20,000",
    expectedRoi: "5.5x",
    category: "Audience Expansion",
    description: "Reels featuring quick recipe assembly generate 4x higher share rates among 18-24 demographics in urban hubs.",
    actionText: "Deploy Reels Campaign"
  },
  {
    id: "REC-106",
    title: "Festival Offer Opportunity Detected for Independence Day",
    priority: "High",
    confidence: "97.5%",
    impact: "Seasonal Spike",
    estRevenue: "₹15,00,000",
    expectedRoi: "6.8x",
    category: "Seasonal Promo",
    description: "Predictive AI models project a 35% surge in group orders for mid-August holiday weekend. Pre-launch coupon codes today.",
    actionText: "Create Freedom Festival Promo"
  }
];

export const SOCIAL_MEDIA_METRICS = {
  instagram: {
    followers: "128.4K",
    reach: "1.12M",
    engagement: "4.82%",
    likes: "84.2K",
    comments: "6.4K",
    shares: "12.8K",
    ctr: "3.45%",
    bestPostingTime: "7:00 PM - 9:30 PM",
    topPosts: [
      { title: "Summer Cooler Mojito Reel", impressions: "240K", likes: "18.5K", engagements: "8.4%" },
      { title: "Indiranagar Chef Special Behind The Scenes", impressions: "185K", likes: "14.2K", engagements: "7.1%" },
      { title: "BOGO Monsoon Deal Flash Story", impressions: "142K", likes: "11.0K", engagements: "6.8%" }
    ]
  },
  facebook: {
    followers: "245.0K",
    reach: "980.0K",
    engagement: "3.65%",
    likes: "52.1K",
    comments: "4.1K",
    shares: "8.9K",
    ctr: "4.12%",
    bestPostingTime: "12:30 PM - 2:00 PM",
    topPosts: [
      { title: "Family Sunday Combo Discount Video", impressions: "310K", likes: "22.1K", engagements: "6.2%" },
      { title: "Franchise Expansion Announcement", impressions: "210K", likes: "16.4K", engagements: "5.5%" }
    ]
  },
  linkedin: {
    followers: "42.5K",
    reach: "215.0K",
    engagement: "5.10%",
    likes: "18.4K",
    comments: "2.1K",
    shares: "3.4K",
    ctr: "2.95%",
    bestPostingTime: "9:00 AM - 11:00 AM",
    topPosts: [
      { title: "FranchiseOps AI Growth Story & Tech Innovation", impressions: "95K", likes: "8.2K", engagements: "8.9%" }
    ]
  },
  twitter: {
    followers: "68.2K",
    reach: "410.0K",
    engagement: "2.90%",
    likes: "21.0K",
    comments: "3.8K",
    shares: "6.1K",
    ctr: "2.10%",
    bestPostingTime: "6:00 PM - 8:00 PM",
    topPosts: [
      { title: "Quick Poll: Cold Coffee vs Hot Filter Coffee?", impressions: "115K", likes: "9.1K", engagements: "5.8%" }
    ]
  },
  youtube: {
    subscribers: "94.8K",
    views: "1.45M",
    watchTimeHours: "48.2K",
    ctr: "5.84%",
    bestPostingTime: "4:00 PM - 6:00 PM",
    topVideos: [
      { title: "How We Brew 10,000 Cups a Day - Documentary", views: "480K", likes: "32K", duration: "8m 42s" }
    ]
  }
};

export const EMAIL_ANALYTICS = {
  sent: "350,000",
  delivered: "344,750",
  deliveryRate: "98.5%",
  opened: "97,909",
  openRate: "28.4%",
  clicked: "22,525",
  clickRate: "6.53%",
  ctr: "23.0%",
  bounced: "5,250",
  unsubscribed: "840",
  spamReports: "120",
  heatmap: [
    { hour: "6 AM", openPct: 12 },
    { hour: "9 AM", openPct: 34 },
    { hour: "12 PM", openPct: 48 },
    { hour: "3 PM", openPct: 29 },
    { hour: "6 PM", openPct: 56 },
    { hour: "9 PM", openPct: 68 },
    { hour: "12 AM", openPct: 18 }
  ]
};

export const MARKETING_BUDGET = {
  totalBudget: 5000000,
  spentBudget: 4285000,
  remainingBudget: 715000,
  utilizationPct: 85.7,
  departments: [
    { name: "Digital Meta & Google Ads", allocated: 2200000, spent: 1980000, roi: 5.4 },
    { name: "Influencer & Creator Collaborations", allocated: 1000000, spent: 920000, roi: 5.9 },
    { name: "Email & SMS CRM Automation", allocated: 400000, spent: 310000, roi: 8.5 },
    { name: "Local Outdoor & Print Ads", allocated: 800000, spent: 680000, roi: 3.6 },
    { name: "Promotions & Discount Cashback", allocated: 600000, spent: 395000, roi: 6.2 }
  ]
};

export const PROMOTIONS_DATA = {
  active: [
    { id: "PRM-01", title: "MONSOON50", discount: "50% OFF up to ₹150", code: "MONSOON50", validTill: "2026-08-31", claims: 4820, limit: 10000, type: "Flash Sale" },
    { id: "PRM-02", title: "SUMMERCOOL", discount: "Flat ₹100 Cashback on Drinks", code: "COOL100", validTill: "2026-08-15", claims: 8910, limit: 10000, type: "Limited Offer" },
    { id: "PRM-03", title: "VIPLUNCH", discount: "20% OFF Corporate Lunch", code: "VIPTECH20", validTill: "2026-09-30", claims: 1420, limit: 5000, type: "Category Offer" }
  ],
  upcoming: [
    { id: "PRM-04", title: "FREEDOM79", discount: "Independence Special ₹79 Combos", code: "INDIA79", startDate: "2026-08-14", validTill: "2026-08-18", estReach: "250K Users", type: "Festival Offer" },
    { id: "PRM-05", title: "FESTIVEBOGO", discount: "Buy 1 Get 1 Free Feast", code: "FESTBOGO", startDate: "2026-09-01", validTill: "2026-09-10", estReach: "500K Users", type: "Festival Offer" }
  ],
  expired: [
    { id: "PRM-06", title: "IPLFEVER", discount: "25% OFF Match Specials", code: "IPLMATCH", expiredDate: "2026-05-31", claims: 15400, totalRevenue: "₹38.5L" }
  ]
};

export const COMPETITOR_INSIGHTS = {
  marketShare: [
    { name: "FranchiseOps AI Brands", share: 34.5, color: "#6366f1" },
    { name: "Competitor Alpha (Cafe Co)", share: 24.0, color: "#ec4899" },
    { name: "Competitor Beta (QuickBites)", share: 18.5, color: "#f59e0b" },
    { name: "Competitor Gamma (Urban Eat)", share: 12.0, color: "#10b981" },
    { name: "Others / Independent Stores", share: 11.0, color: "#64748b" }
  ],
  swot: {
    strengths: ["Highest ROI per ad dollar (4.85x)", "Hyper-local AI targeting", "98.5% email deliverability rate"],
    weaknesses: ["Underperforming outdoor print ads in North region", "Slower customer onboarding in tier-2 cities"],
    opportunities: ["Expand Instagram Reels influencer partnerships", "Pre-launch Independence Day & Diwali regional packages"],
    threats: ["Aggressive aggressive pricing by Competitor Alpha in Mumbai", "Rising PPC cost per click in Google Ads"]
  }
};

export const ALERTS_DATA = [
  { id: "ALT-01", severity: "Critical", title: "Campaign Budget Exceeded", message: "Delhi NCR Weekend Breakfast campaign has exceeded daily target spend by 18%.", time: "10 mins ago", action: "Pause Campaign" },
  { id: "ALT-02", severity: "High", title: "High Email Bounce Rate", message: "Batch 4 of Newsletter Drip hit 3.8% bounce rate due to stale contacts.", time: "45 mins ago", action: "Clean Contact List" },
  { id: "ALT-03", severity: "Medium", title: "Low Social Media Reach", message: "Twitter impressions dipped by 14% this week. Refresh hashtag strategy.", time: "2 hours ago", action: "Review Social Strategy" },
  { id: "ALT-04", severity: "Low", title: "Campaign Ending Soon", message: "Summer Chill Cooler Offer ends in 5 days with ₹30,000 unspent budget.", time: "5 hours ago", action: "Extend Campaign" }
];
