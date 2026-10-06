
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getMySecurityReports,
  getSecurityReportById,
  updateSecurityReport,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveSecurityReportController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// SECURITY REPORTS
// =====================================================

router.get(
  "/",
  getMySecurityReports
);

router.get(
  "/:id",
  getSecurityReportById
);

router.put(
  "/:id",
  updateSecurityReport
);

module.exports = router;

