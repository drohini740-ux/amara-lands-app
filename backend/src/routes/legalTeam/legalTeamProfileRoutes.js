
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/legalTeam/legalTeamProfileController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get logged-in Legal Team profile
router.get("/", getMyProfile);

// Update logged-in Legal Team profile
router.put("/", updateMyProfile);

module.exports = router;
