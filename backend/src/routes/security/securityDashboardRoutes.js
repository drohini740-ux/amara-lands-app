
const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/security/securityDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET SECURITY DASHBOARD
// =====================================================

router.get("/", getDashboardStats);

module.exports = router;

