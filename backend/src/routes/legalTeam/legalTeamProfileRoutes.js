
const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/legalTeam/legalTeamProfileController");

const authMiddleware = require("../../middleware/authMiddleware");

router.use(authMiddleware);

// Get logged-in Legal Team profile
router.get("/", getMyProfile);

// Update logged-in Legal Team profile
router.put("/", updateMyProfile);

module.exports = router;

