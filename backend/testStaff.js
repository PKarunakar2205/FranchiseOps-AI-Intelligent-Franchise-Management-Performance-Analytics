const assert = require("assert");
const prisma = require("./config/prisma");
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
} = require("./services/staffServices");

async function runStaffTests() {
  console.log("=== Running Staff & Leave Management Backend Tests ===");
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
    let createdStaffId = null;
    let createdLeaveId = null;

    // 1. Create Staff Member
    await test("StaffService: createStaff creates a new staff member", async () => {
      const staffData = {
        staff_name: "Rahul Sharma",
        first_name: "Rahul",
        last_name: "Sharma",
        role: "Shift Lead",
        shift: "Morning (07:00-15:00)",
        salary: 35000.0,
        phone: "9876543210",
        email: "rahul.sharma@example.com",
        rating: 4.8,
        attendance: 98,
        status: "On Shift"
      };

      const staff = await createStaff(staffData);
      assert.ok(staff.staff_id, "Created staff member should have staff_id");
      assert.strictEqual(staff.staff_name, "Rahul Sharma");
      assert.strictEqual(staff.role, "Shift Lead");
      createdStaffId = staff.staff_id;
    });

    // 2. Get Staff By ID
    await test("StaffService: getStaffById retrieves the created staff member", async () => {
      assert.ok(createdStaffId, "Created staff ID should exist");
      const member = await getStaffById(createdStaffId);
      assert.ok(member, "Member should be found");
      assert.strictEqual(member.staff_id, createdStaffId);
      assert.strictEqual(member.email, "rahul.sharma@example.com");
    });

    // 3. Get All Staff
    await test("StaffService: getAllStaff returns staff list containing created member", async () => {
      const list = await getAllStaff();
      assert.ok(Array.isArray(list), "Staff list should be an array");
      assert.ok(list.some(s => s.staff_id === createdStaffId), "List should contain created staff member");
    });

    // 4. Get Staff Summary Metrics
    await test("StaffService: getStaffSummary calculates staff metrics", async () => {
      const summary = await getStaffSummary();
      assert.ok(summary, "Summary object should exist");
      assert.strictEqual(typeof summary.totalStaff, "number");
      assert.ok(summary.totalStaff > 0, "Total staff count should be greater than 0");
    });

    // 5. Update Staff Member
    await test("StaffService: updateStaff modifies staff record", async () => {
      assert.ok(createdStaffId, "Created staff ID should exist");
      const updated = await updateStaff(createdStaffId, {
        rating: 4.9,
        status: "On Shift"
      });
      assert.strictEqual(Number(updated.rating), 4.9);
    });

    // 6. Apply Leave Request
    await test("StaffService: applyLeave submits a new leave request", async () => {
      assert.ok(createdStaffId, "Created staff ID should exist");

      // We need a valid outlet_id or test outlet_id for swift_leaves relation
      // Let's check if there is an existing outlet or create a temp one if needed
      let outletId = 1;
      const existingOutlet = await prisma.outlet.findFirst();
      if (existingOutlet) {
        outletId = existingOutlet.outlet_id;
      } else {
        const tempOutlet = await prisma.outlet.create({
          data: { outlet_name: "Staff Test Outlet" }
        });
        outletId = tempOutlet.outlet_id;
      }

      const leaveData = {
        applicant_id: createdStaffId,
        outlet_id: outletId,
        leave_type: "Medical Leave",
        start_date: "2026-08-20",
        end_date: "2026-08-22",
        total_days: 2,
        reason: "Medical checkup",
        status: "Pending AI Approval"
      };

      const leave = await applyLeave(leaveData);
      assert.ok(leave.leave_id, "Leave should have leave_id");
      assert.strictEqual(leave.leave_type, "Medical Leave");
      createdLeaveId = leave.leave_id;
    });

    // 7. Get All Leaves
    await test("StaffService: getAllLeaves returns leave list", async () => {
      const leaves = await getAllLeaves();
      assert.ok(Array.isArray(leaves), "Leaves should be an array");
      assert.ok(leaves.some(l => l.leave_id === createdLeaveId), "Leave list should contain applied leave");
    });

    // 8. Update Leave Status
    await test("StaffService: updateLeaveStatus updates approval status", async () => {
      assert.ok(createdLeaveId, "Created leave ID should exist");
      const updatedLeave = await updateLeaveStatus(createdLeaveId, {
        status: "Approved",
        replacement_suggested: "Anand Kumar"
      });
      assert.strictEqual(updatedLeave.status, "Approved");
      assert.strictEqual(updatedLeave.replacement_suggested, "Anand Kumar");
    });

    // 9. Clean up test records
    await test("StaffService: deleteStaff and leave cleanup", async () => {
      if (createdLeaveId) {
        await prisma.swiftLeave.delete({ where: { leave_id: createdLeaveId } });
      }
      if (createdStaffId) {
        await deleteStaff(createdStaffId);
        const check = await getStaffById(createdStaffId);
        assert.strictEqual(check, null, "Staff member should be deleted");
      }
    });

    console.log(`\nAll ${passedCount} Staff & Leave Management tests passed successfully!`);
  } finally {
    await prisma.$disconnect();
  }
}

runStaffTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
