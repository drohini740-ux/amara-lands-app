
const express = require("express");
const router = express.Router();

const {
  getSecurityMonitoringDashboard,
} = require("../../controllers/admin/securityMonitoringDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Admin-only security monitoring dashboard
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getSecurityMonitoringDashboard
);

module.exports = router;
