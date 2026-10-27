
const express = require("express");
const router = express.Router();

const {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} = require("../../controllers/admin/settingsController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Protect all Admin settings routes.
router.use(authMiddleware, adminMiddleware);

// Get Admin Profile
router.get("/profile", getAdminProfile);

// Update Admin Profile
router.put("/profile", updateAdminProfile);

// Change Admin Password
router.put("/password", changeAdminPassword);

module.exports = router;
