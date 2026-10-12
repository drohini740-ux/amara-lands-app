
const express = require("express");

const router = express.Router();

const {
  getFieldExecutiveReports,
} = require("../../controllers/fieldExecutive/fieldExecutiveReportController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET FIELD EXECUTIVE REPORTS
// =====================================================

router.get("/", getFieldExecutiveReports);

module.exports = router;

