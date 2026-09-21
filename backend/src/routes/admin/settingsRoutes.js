const express = require("express");

const router = express.Router();

const {
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
} = require("../../controllers/admin/settingsController");

const authMiddleware = require("../../middleware/authMiddleware");

// ==========================================
// ADMIN SETTINGS ROUTES
// ==========================================

// Get Admin Profile
router.get(
    "/profile",
    authMiddleware,
    getAdminProfile
);

// Update Admin Profile
router.put(
    "/profile",
    authMiddleware,
    updateAdminProfile
);

// Change Admin Password
router.put(
    "/password",
    authMiddleware,
    changeAdminPassword
);

module.exports = router;