
const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/security/securityDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// GET SECURITY DASHBOARD
router.get("/", getDashboardStats);

module.exports = router;
