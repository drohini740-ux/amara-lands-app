
const express = require("express");
const router = express.Router();

const {
  getLegalTeamDashboard,
} = require("../../controllers/legalTeam/legalTeamDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// GET /api/v1/legal-team/dashboard
router.get("/", getLegalTeamDashboard);

module.exports = router;
