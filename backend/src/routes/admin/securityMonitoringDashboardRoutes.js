const express = require("express");

const router = express.Router();

const {
  getSecurityMonitoringDashboard,
} = require("../../controllers/admin/securityMonitoringDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  getSecurityMonitoringDashboard
);

module.exports = router;