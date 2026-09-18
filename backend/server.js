require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const outletRoutes = require("./routes/outletRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const staffRoutes = require("./routes/staffRoutes");
const auditRoutes = require("./routes/auditRoutes");
const marketingRoutes = require("./routes/marketingRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const { startWorkflowDaemon } = require("./services/workflowEngine");

const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("/{*path}", cors());
app.use(express.json());

// Health Check Endpoints for Render Container Monitoring
app.get(["/health", "/api/health"], (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "FranchiseOps AI Engine",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/marketing", marketingRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/notifications", notificationRoutes);

// Static Production Build Hosting & Single Page App Catch-All
const distDir = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*path}", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "FranchiseOps AI API Service Operational", version: "1.0.0" });
  });
}

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
    startWorkflowDaemon(60000);
  });
}

module.exports = app;