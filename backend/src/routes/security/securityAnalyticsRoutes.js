
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getSecurityAnalytics,
} = require("../../controllers/security/securityAnalyticsController");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// GET /api/v1/security/analytics
// Optional filters: ?from=2026-10-01&to=2026-10-31
router.get("/", getSecurityAnalytics);

module.exports = router;
