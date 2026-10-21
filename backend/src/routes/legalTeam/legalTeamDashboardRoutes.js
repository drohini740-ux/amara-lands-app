
const express = require("express");
const router = express.Router();

const {
  getLegalTeamDashboard,
} = require("../../controllers/legalTeam/legalTeamDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

// All dashboard routes require authentication.
router.use(authMiddleware);

// GET /api/v1/legal-team/dashboard
router.get("/", getLegalTeamDashboard);

module.exports = router;
