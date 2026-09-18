const assert = require("assert");
const prisma = require("./config/prisma");
const {
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
} = require("./services/marketingServices");

async function runMarketingTests() {
  console.log("=== Running Marketing & Promotions Backend Tests ===");
  let passedCount = 0;

  async function test(description, fn) {
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      passedCount++;
    } catch (err) {
      console.error(`[FAIL] ${description}:`, err.message);
      throw err;
    }
  }

  try {
    let createdCampaignId = null;
    let createdPromotionId = null;

    // 1. Create Campaign
    await test("MarketingService: createCampaign creates a new campaign", async () => {
      const campaignData = {
        campaign_name: "Test Summer Monsoon Campaign",
        campaign_type: "Social Media",
        platform: "Instagram Ads",
        budget: 50000.0,
        spent: 15000.0,
        impressions: 45000,
        clicks: 3200,
        conversions: 240,
        roas: 3.8,
        status: "Active"
      };

      const campaign = await createCampaign(campaignData);
      assert.ok(campaign.campaign_id, "Created campaign should have campaign_id");
      assert.strictEqual(campaign.campaign_name, "Test Summer Monsoon Campaign");
      assert.strictEqual(campaign.platform, "Instagram Ads");
      createdCampaignId = campaign.campaign_id;
    });

    // 2. Get Campaign By ID
    await test("MarketingService: getCampaignById retrieves the created campaign", async () => {
      assert.ok(createdCampaignId, "Created campaign ID should exist");
      const campaign = await getCampaignById(createdCampaignId);
      assert.ok(campaign, "Campaign should be found");
      assert.strictEqual(campaign.campaign_id, createdCampaignId);
      assert.strictEqual(Number(campaign.budget), 50000);
    });

    // 3. Campaign List
    await test("MarketingService: getAllCampaigns returns campaign list containing created item", async () => {
      const campaigns = await getAllCampaigns();
      assert.ok(Array.isArray(campaigns), "Campaigns should be an array");
      assert.ok(campaigns.some(c => c.campaign_id === createdCampaignId), "List should contain created campaign");
    });

    // 4. Update Campaign
    await test("MarketingService: updateCampaign updates spent and conversions", async () => {
      assert.ok(createdCampaignId, "Created campaign ID should exist");
      const updated = await updateCampaign(createdCampaignId, {
        spent: 20000.0,
        conversions: 310,
        roas: 4.2
      });
      assert.strictEqual(Number(updated.spent), 20000);
      assert.strictEqual(updated.conversions, 310);
    });

    // 5. Create Promotion
    await test("MarketingService: createPromotion creates a new promo code", async () => {
      const promoData = {
        promo_code: `TESTPROMO-${Date.now()}`,
        title: "Test 25% Off Summer Deal",
        discount_pct: 25.0,
        status: "Active"
      };

      const promo = await createPromotion(promoData);
      assert.ok(promo.promotion_id, "Created promotion should have promotion_id");
      assert.strictEqual(promo.title, "Test 25% Off Summer Deal");
      assert.strictEqual(Number(promo.discount_pct), 25);
      createdPromotionId = promo.promotion_id;
    });

    // 6. Promotion List
    await test("MarketingService: getAllPromotions returns promotions list", async () => {
      const promotions = await getAllPromotions();
      assert.ok(Array.isArray(promotions), "Promotions should be an array");
      assert.ok(promotions.some(p => p.promotion_id === createdPromotionId), "List should contain created promotion");
    });

    // 7. Update Promotion
    await test("MarketingService: updatePromotion updates usage_count and status", async () => {
      assert.ok(createdPromotionId, "Created promotion ID should exist");
      const updated = await updatePromotion(createdPromotionId, {
        usage_count: 50,
        status: "Active"
      });
      assert.strictEqual(updated.usage_count, 50);
    });

    // 8. Marketing Summary
    await test("MarketingService: getMarketingSummary computes overall campaign stats", async () => {
      const summary = await getMarketingSummary();
      assert.ok(summary, "Summary object should exist");
      assert.strictEqual(typeof summary.totalCampaigns, "number");
      assert.ok(summary.totalCampaigns > 0, "Total campaigns should be greater than 0");
    });

    // 9. Error Handling / Validation
    await test("MarketingService: createCampaign throws error on missing campaign_name", async () => {
      await assert.rejects(
        async () => {
          await createCampaign({});
        },
        /Campaign name is required/
      );
    });

    await test("MarketingService: createPromotion throws error on missing fields", async () => {
      await assert.rejects(
        async () => {
          await createPromotion({ promo_code: "TEST" });
        },
        /Missing required parameters/
      );
    });

    // 10. Delete Campaign & Cleanup
    await test("MarketingService: deleteCampaign removes test campaign cleanly", async () => {
      assert.ok(createdCampaignId, "Created campaign ID should exist");
      const deleted = await deleteCampaign(createdCampaignId);
      assert.strictEqual(deleted.campaign_id, createdCampaignId);

      const check = await getCampaignById(createdCampaignId);
      assert.strictEqual(check, null, "Deleted campaign should no longer exist");
    });

    // Clean up test promotion
    if (createdPromotionId) {
      await prisma.promotion.delete({ where: { promotion_id: createdPromotionId } });
    }

    console.log(`\nAll ${passedCount} Marketing & Promotions tests passed successfully!`);
  } finally {
    await prisma.$disconnect();
  }
}

runMarketingTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
