
const express = require("express");
const router = express.Router();

const {
  getFieldExecutiveReports,
} = require("../../controllers/fieldExecutive/fieldExecutiveReportController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET FIELD EXECUTIVE REPORTS
router.get("/", getFieldExecutiveReports);

module.exports = router;
