const assert = require("assert");
const prisma = require("./config/prisma");
const {
  getAllAudits,
  getAuditSummary,
  getAllEvidence,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence
} = require("./services/auditServices");

async function runAuditTests() {
  console.log("=== Running Audit Risk & Evidence Center Backend Tests ===");
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
    let createdEvidenceId = null;
    let tempOutletId = null;

    // Helper: Find or create outlet for FK reference
    const existingOutlet = await prisma.outlet.findFirst();
    if (existingOutlet) {
      tempOutletId = existingOutlet.outlet_id;
    } else {
      const createdOutlet = await prisma.outlet.create({
        data: { outlet_name: "Audit Test Outlet", city: "Test City" }
      });
      tempOutletId = createdOutlet.outlet_id;
    }

    // 1. Get Audits List
    await test("AuditService: getAllAudits returns audit list", async () => {
      const audits = await getAllAudits();
      assert.ok(Array.isArray(audits), "Audits should be an array");
    });

    // 2. Filter Audits
    await test("AuditService: getAllAudits filters by outlet_id", async () => {
      const filtered = await getAllAudits({ outlet_id: tempOutletId });
      assert.ok(Array.isArray(filtered), "Filtered audits should be an array");
    });

    // 3. Get Audit Summary
    await test("AuditService: getAuditSummary computes avgScore and riskBreakdown", async () => {
      const summary = await getAuditSummary();
      assert.ok(summary, "Summary object should exist");
      assert.strictEqual(typeof summary.avgScore, "number");
      assert.strictEqual(typeof summary.totalAudits, "number");
      assert.ok(Array.isArray(summary.riskBreakdown), "riskBreakdown should be an array");
      assert.ok(summary.riskBreakdown.length > 0, "Should have risk category breakdown");
    });

    // 4. Create Audit Evidence Record
    await test("AuditService: createEvidence creates a new evidence record", async () => {
      const evidenceData = {
        name: "Supplier Invoice #TEST-9988",
        type: "Financial",
        outlet_id: tempOutletId,
        status: "Needs Review",
        ai_score: 92,
        details: "Invoice verification for quarterly audit",
        file_url: "https://example.com/invoice.pdf"
      };

      const evidence = await createEvidence(evidenceData);
      assert.ok(evidence.evidence_id, "Evidence record should have evidence_id");
      assert.strictEqual(evidence.name, "Supplier Invoice #TEST-9988");
      assert.strictEqual(evidence.status, "Needs Review");
      createdEvidenceId = evidence.evidence_id;
    });

    // 5. Get Evidence List & Filter
    await test("AuditService: getAllEvidence returns list containing created record", async () => {
      const list = await getAllEvidence({ status: "Needs Review" });
      assert.ok(Array.isArray(list), "Evidence list should be an array");
      assert.ok(list.some(e => e.evidence_id === createdEvidenceId), "List should contain created evidence");
    });

    // 6. Get Evidence By ID
    await test("AuditService: getEvidenceById retrieves created evidence", async () => {
      assert.ok(createdEvidenceId, "Created evidence ID should exist");
      const item = await getEvidenceById(createdEvidenceId);
      assert.ok(item, "Evidence should be found");
      assert.strictEqual(item.evidence_id, createdEvidenceId);
      assert.strictEqual(item.type, "Financial");
    });

    // 7. Update Evidence Record
    await test("AuditService: updateEvidence updates status and AI score", async () => {
      assert.ok(createdEvidenceId, "Created evidence ID should exist");
      const updated = await updateEvidence(createdEvidenceId, {
        status: "Verified",
        ai_score: 98
      });
      assert.strictEqual(updated.status, "Verified");
      assert.strictEqual(updated.ai_score, 98);
    });

    // 8. Error Handling / Validation
    await test("AuditService: createEvidence throws error on missing required fields", async () => {
      await assert.rejects(
        async () => {
          await createEvidence({ name: "Incomplete Evidence" });
        },
        /Missing required parameters/
      );
    });

    // 9. Delete Evidence Record
    await test("AuditService: deleteEvidence cleans up test evidence record", async () => {
      assert.ok(createdEvidenceId, "Created evidence ID should exist");
      const deleted = await deleteEvidence(createdEvidenceId);
      assert.strictEqual(deleted.evidence_id, createdEvidenceId);

      const check = await getEvidenceById(createdEvidenceId);
      assert.strictEqual(check, null, "Deleted evidence should no longer exist");
    });

    console.log(`\nAll ${passedCount} Audit Risk & Evidence Center tests passed successfully!`);
  } finally {
    await prisma.$disconnect();
  }
}

runAuditTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
