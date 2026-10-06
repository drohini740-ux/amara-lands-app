
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getMyVisitReports,
  getVisitReportById,
  updateVisitReport,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveVisitReportController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// VISIT REPORTS
// =====================================================

router.get(
  "/",
  getMyVisitReports
);

router.get(
  "/:id",
  getVisitReportById
);

router.put(
  "/:id",
  updateVisitReport
);

module.exports = router;

