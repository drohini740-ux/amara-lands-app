
const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getSecurityReports,
  getSecurityReportById,
  createSecurityReport,
} = require("../../controllers/security/securityReportController");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL INCIDENT REPORTS
// GET /api/v1/security/reports
// =====================================================

router.get("/", getSecurityReports);

// =====================================================
// CREATE INCIDENT REPORT
// POST /api/v1/security/reports
// =====================================================

router.post("/", createSecurityReport);

// =====================================================
// GET INCIDENT REPORT DETAILS
// GET /api/v1/security/reports/:id
// =====================================================

router.get("/:id", getSecurityReportById);

module.exports = router;
