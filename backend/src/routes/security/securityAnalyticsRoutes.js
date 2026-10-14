
const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getSecurityAnalytics,
} = require("../../controllers/security/securityAnalyticsController");

// Require a valid login token.
router.use(authMiddleware);

// GET /api/v1/security/analytics
// Optional filters: ?from=2026-10-01&to=2026-10-31
router.get("/", getSecurityAnalytics);

module.exports = router;
