
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getMySecurityReports,
  getSecurityReportById,
  createSecurityReport,
  updateSecurityReport,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveSecurityReportController"
);

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY SECURITY REPORTS
router.get("/", getMySecurityReports);

// CREATE SECURITY REPORT
router.post("/", createSecurityReport);

// GET SECURITY REPORT BY ID
router.get("/:id", getSecurityReportById);

// UPDATE SECURITY REPORT
router.put("/:id", updateSecurityReport);

module.exports = router;
