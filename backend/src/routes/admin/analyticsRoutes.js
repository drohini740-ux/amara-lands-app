const express = require("express");

const router = express.Router();

const analyticsController = require("../../controllers/admin/analyticsController");
const authMiddleware = require("../../middleware/authMiddleware");

// Check controller
console.log("Analytics Controller:", analyticsController);

// Check middleware
console.log("Auth Middleware:", authMiddleware);

// ==========================================
// GET ADMIN ANALYTICS
// ==========================================

router.get(
  "/",
  authMiddleware,
  analyticsController.getAnalytics
);

module.exports = router;