
const express = require("express");
const router = express.Router();

const {
  getLegalReports,
} = require("../../controllers/legalTeam/legalTeamReportController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get Legal Team reports
router.get("/", getLegalReports);

module.exports = router;
