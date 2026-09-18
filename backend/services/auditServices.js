const prisma = require("../config/prisma");

async function getAllAudits(filters = {}) {
  const where = {};
  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.audit_type) {
    where.audit_type = filters.audit_type;
  }

  const audits = await prisma.audit.findMany({
    where,
    include: {
      outlet: {
        select: {
          outlet_id: true,
          outlet_name: true,
          city: true
        }
      }
    },
    orderBy: { audit_id: "desc" }
  });

  return audits;
}

async function getAuditSummary(outletId) {
  const where = {};
  if (outletId) {
    where.outlet_id = parseInt(outletId, 10);
  }

  const audits = await prisma.audit.findMany({ where });
  const totalAudits = audits.length;

  let totalScore = 0;
  audits.forEach(a => {
    totalScore += Number(a.score || 0);
  });

  const avgScore = totalAudits > 0 ? Math.round(totalScore / totalAudits) : 80;

  // Group risk scores by category
  const categories = [
    { category: "Hygiene Risk", type: "Hygiene", defaultScore: 68, color: "#f43f5e" },
    { category: "Financial Risk", type: "Financial", defaultScore: 74, color: "#f97316" },
    { category: "Inventory Risk", type: "Inventory", defaultScore: 82, color: "#eab308" },
    { category: "Staff Compliance Risk", type: "Staff Compliance", defaultScore: 71, color: "#f97316" },
    { category: "Safety Risk", type: "Safety", defaultScore: 45, color: "#10b981" },
    { category: "Documentation Risk", type: "Documentation", defaultScore: 79, color: "#f43f5e" },
    { category: "Operational Risk", type: "Operational", defaultScore: 65, color: "#3b82f6" }
  ];

  const riskBreakdown = categories.map(cat => {
    const matchingAudits = audits.filter(a => a.audit_type === cat.type);
    let score = cat.defaultScore;
    if (matchingAudits.length > 0) {
      const sum = matchingAudits.reduce((acc, curr) => acc + (curr.score || 0), 0);
      score = Math.round(sum / matchingAudits.length);
    }

    let level = "MEDIUM";
    if (score >= 75) level = "HIGH";
    else if (score <= 50) level = "LOW";

    return {
      category: cat.category,
      score,
      level,
      color: cat.color
    };
  });

  return {
    avgScore,
    totalAudits,
    riskBreakdown
  };
}

async function getAllEvidence(filters = {}) {
  const where = {};
  if (filters.outlet_id) {
    where.outlet_id = parseInt(filters.outlet_id, 10);
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.type) {
    where.type = filters.type;
  }

  const evidence = await prisma.auditEvidence.findMany({
    where,
    include: {
      outlet: {
        select: {
          outlet_id: true,
          outlet_name: true,
          city: true
        }
      }
    },
    orderBy: { evidence_id: "desc" }
  });

  return evidence;
}

async function getEvidenceById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Evidence ID");
  }

  const item = await prisma.auditEvidence.findUnique({
    where: { evidence_id: numericId },
    include: {
      outlet: {
        select: {
          outlet_id: true,
          outlet_name: true,
          city: true
        }
      }
    }
  });

  return item;
}

async function createEvidence(data) {
  if (!data.name || !data.type || !data.outlet_id) {
    throw new Error("Missing required parameters (name, type, outlet_id)");
  }

  const evidenceCode = data.evidence_code || `EVD-${Date.now()}`;

  const newEvidence = await prisma.auditEvidence.create({
    data: {
      evidence_code: evidenceCode,
      name: data.name,
      type: data.type,
      outlet_id: parseInt(data.outlet_id, 10),
      status: data.status || "Needs Review",
      ai_score: data.ai_score !== undefined ? parseInt(data.ai_score, 10) : 70,
      upload_date: data.upload_date ? new Date(data.upload_date) : new Date(),
      details: data.details || null,
      file_url: data.file_url || null,
      file_size: data.file_size || null
    }
  });

  return newEvidence;
}

async function updateEvidence(id, data) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Evidence ID");
  }

  const existing = await prisma.auditEvidence.findUnique({
    where: { evidence_id: numericId }
  });

  if (!existing) {
    throw new Error("Evidence record not found");
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.ai_score !== undefined) updateData.ai_score = parseInt(data.ai_score, 10);
  if (data.details !== undefined) updateData.details = data.details;
  if (data.file_url !== undefined) updateData.file_url = data.file_url;
  if (data.file_size !== undefined) updateData.file_size = data.file_size;

  const updated = await prisma.auditEvidence.update({
    where: { evidence_id: numericId },
    data: updateData
  });

  return updated;
}

async function deleteEvidence(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error("Invalid Evidence ID");
  }

  const existing = await prisma.auditEvidence.findUnique({
    where: { evidence_id: numericId }
  });

  if (!existing) {
    throw new Error("Evidence record not found");
  }

  const deleted = await prisma.auditEvidence.delete({
    where: { evidence_id: numericId }
  });

  return deleted;
}

module.exports = {
  getAllAudits,
  getAuditSummary,
  getAllEvidence,
  getEvidenceById,
  createEvidence,
  updateEvidence,
  deleteEvidence
};
