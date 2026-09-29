const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/superAdmin/superAdminDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

router.get(
  "/",
  authMiddleware,
  getDashboardStats
);

module.exports = router;