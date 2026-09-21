const express = require("express");

const router = express.Router();

const {
    getSuperAdminDashboard
} = require("../../controllers/superAdmin/superAdminDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");


// ==========================================
// SUPER ADMIN DASHBOARD
// ==========================================

router.get(
    "/dashboard",
    authMiddleware,
    getSuperAdminDashboard
);


module.exports = router;