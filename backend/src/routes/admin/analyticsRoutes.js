
const express = require("express");
const router = express.Router();

const analyticsController = require("../../controllers/admin/analyticsController");
const authMiddleware = require("../../middleware/authMiddleware");

const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }

  return next();
};

// Authentication + authorization
router.get(
  "/",
  authMiddleware,
  requireAdmin,
  analyticsController.getAnalytics
);

module.exports = router;
