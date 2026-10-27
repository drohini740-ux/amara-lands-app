
const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/fieldExecutive/fieldExecutiveDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET FIELD EXECUTIVE DASHBOARD
router.get("/", getDashboardStats);

module.exports = router;
