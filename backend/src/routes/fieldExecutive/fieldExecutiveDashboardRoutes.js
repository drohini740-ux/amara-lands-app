
const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/fieldExecutive/fieldExecutiveDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET FIELD EXECUTIVE DASHBOARD
// =====================================================

router.get("/", getDashboardStats);

module.exports = router;

