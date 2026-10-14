
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/superAdmin/superAdminProfileController");

const authMiddleware = require("../../middleware/authMiddleware");

// All profile routes require authentication.
router.use(authMiddleware);

// GET logged-in Super Admin profile
router.get("/", getMyProfile);

// UPDATE logged-in Super Admin profile
router.put("/", updateMyProfile);

module.exports = router;
