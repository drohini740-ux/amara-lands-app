
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getMyVisitReports,
  getVisitReportById,
  updateVisitReport,
} = require("../../controllers/fieldExecutive/fieldExecutiveVisitReportController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// VISIT REPORTS
router.get("/", getMyVisitReports);
router.get("/:id", getVisitReportById);
router.put("/:id", updateVisitReport);

module.exports = router;
