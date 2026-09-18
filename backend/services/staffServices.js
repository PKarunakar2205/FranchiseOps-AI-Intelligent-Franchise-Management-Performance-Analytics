const prisma = require("../config/prisma");

async function getAllStaff(filters = {}) {
  const where = {};

  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.role) {
    where.role = filters.role;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.shift) {
    where.shift = filters.shift;
  }

  const staffList = await prisma.staff.findMany({
    where,
    orderBy: { staff_id: "asc" }
  });

  return staffList;
}

async function getStaffById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Staff ID");
  }

  const member = await prisma.staff.findUnique({
    where: { staff_id: numericId },
    include: {
      swift_leaves: true
    }
  });

  return member;
}

async function createStaff(data) {
  const staffName = data.staff_name || `${data.first_name || ""} ${data.last_name || ""}`.trim();
  if (!staffName) {
    throw new Error("Staff name is required");
  }

  const newStaff = await prisma.staff.create({
    data: {
      outlet_id: data.outlet_id ? parseInt(data.outlet_id, 10) : null,
      staff_name: staffName,
      first_name: data.first_name || staffName.split(" ")[0] || null,
      last_name: data.last_name || staffName.split(" ").slice(1).join(" ") || null,
      role: data.role || "Staff Member",
      shift: data.shift || "Morning (07:00-15:00)",
      salary: data.salary ? parseFloat(data.salary) : null,
      phone: data.phone || null,
      email: data.email || null,
      joining_date: data.joining_date ? new Date(data.joining_date) : new Date(),
      rating: data.rating !== undefined ? parseFloat(data.rating) : 4.5,
      sales_per_hour: data.sales_per_hour !== undefined ? parseFloat(data.sales_per_hour) : 0,
      attendance: data.attendance !== undefined ? parseInt(data.attendance, 10) : 95,
      leaves_taken: data.leaves_taken !== undefined ? parseInt(data.leaves_taken, 10) : 0,
      status: data.status || "On Shift"
    }
  });

  return newStaff;
}

async function updateStaff(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Staff ID");
  }

  const existing = await prisma.staff.findUnique({
    where: { staff_id: numericId }
  });

  if (!existing) {
    throw new Error("Staff member not found");
  }

  const updateData = {};
  if (data.staff_name !== undefined) updateData.staff_name = data.staff_name;
  if (data.first_name !== undefined) updateData.first_name = data.first_name;
  if (data.last_name !== undefined) updateData.last_name = data.last_name;
  if (data.role !== undefined) updateData.role = data.role;
  if (data.shift !== undefined) updateData.shift = data.shift;
  if (data.salary !== undefined) updateData.salary = parseFloat(data.salary);
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.rating !== undefined) updateData.rating = parseFloat(data.rating);
  if (data.sales_per_hour !== undefined) updateData.sales_per_hour = parseFloat(data.sales_per_hour);
  if (data.attendance !== undefined) updateData.attendance = parseInt(data.attendance, 10);
  if (data.leaves_taken !== undefined) updateData.leaves_taken = parseInt(data.leaves_taken, 10);
  if (data.status !== undefined) updateData.status = data.status;

  const updated = await prisma.staff.update({
    where: { staff_id: numericId },
    data: updateData
  });

  return updated;
}

async function deleteStaff(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Staff ID");
  }

  const existing = await prisma.staff.findUnique({
    where: { staff_id: numericId }
  });

  if (!existing) {
    throw new Error("Staff member not found");
  }

  const deleted = await prisma.staff.delete({
    where: { staff_id: numericId }
  });

  return deleted;
}

async function getStaffSummary(outletId) {
  const where = {};
  if (outletId) {
    where.outlet_id = parseInt(outletId, 10);
  }

  const staffMembers = await prisma.staff.findMany({ where });

  const totalStaff = staffMembers.length;
  let onShiftCount = 0;
  let offDutyCount = 0;
  let onLeaveCount = 0;
  let totalRating = 0;
  let totalAttendance = 0;

  staffMembers.forEach(s => {
    if (s.status === "On Shift") onShiftCount++;
    else if (s.status === "On Leave") onLeaveCount++;
    else offDutyCount++;

    totalRating += Number(s.rating || 4.5);
    totalAttendance += Number(s.attendance || 95);
  });

  const avgRating = totalStaff > 0 ? parseFloat((totalRating / totalStaff).toFixed(1)) : 4.5;
  const avgAttendance = totalStaff > 0 ? Math.round(totalAttendance / totalStaff) : 95;

  return {
    totalStaff,
    onShiftCount,
    offDutyCount,
    onLeaveCount,
    avgRating,
    avgAttendance
  };
}

async function getAllLeaves(filters = {}) {
  const where = {};
  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.applicant_id) {
    where.applicant_id = parseInt(filters.applicant_id, 10);
  }

  const leaves = await prisma.swiftLeave.findMany({
    where,
    include: {
      applicant: {
        select: {
          staff_id: true,
          staff_name: true,
          role: true
        }
      }
    },
    orderBy: { leave_id: "desc" }
  });

  return leaves;
}

async function applyLeave(data) {
  if (!data.applicant_id || !data.outlet_id || !data.leave_type || !data.start_date || !data.end_date) {
    throw new Error("Missing required leave parameters (applicant_id, outlet_id, leave_type, start_date, end_date)");
  }

  const leaveCode = data.leave_code || `LV-${Date.now()}`;

  const newLeave = await prisma.swiftLeave.create({
    data: {
      leave_code: leaveCode,
      applicant_id: parseInt(data.applicant_id, 10),
      outlet_id: parseInt(data.outlet_id, 10),
      leave_type: data.leave_type,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      total_days: data.total_days ? parseInt(data.total_days, 10) : 1,
      reason: data.reason || "Casual leave request",
      status: data.status || "Pending AI Approval",
      priority: data.priority || "Normal",
      ai_conflict: data.ai_conflict || null,
      replacement_suggested: data.replacement_suggested || null
    }
  });

  return newLeave;
}

async function updateLeaveStatus(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Leave ID");
  }

  const existing = await prisma.swiftLeave.findUnique({
    where: { leave_id: numericId }
  });

  if (!existing) {
    throw new Error("Leave request not found");
  }

  const updateData = {};
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.ai_conflict !== undefined) updateData.ai_conflict = data.ai_conflict;
  if (data.replacement_suggested !== undefined) updateData.replacement_suggested = data.replacement_suggested;

  const updated = await prisma.swiftLeave.update({
    where: { leave_id: numericId },
    data: updateData
  });

  return updated;
}

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffSummary,
  getAllLeaves,
  applyLeave,
  updateLeaveStatus
};
