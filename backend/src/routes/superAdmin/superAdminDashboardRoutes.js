
const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
} = require("../../controllers/superAdmin/superAdminDashboardController");

const authMiddleware = require("../../middleware/authMiddleware");

// Allow only authenticated Super Admin users.
const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin privileges required.",
    });
  }

  next();
};

router.get(
  "/",
  authMiddleware,
  superAdminOnly,
  getDashboardStats
);

module.exports = router;
