const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getReports,
} = require("../../controllers/superAdmin/superAdminReportController");

// Allow only Super Admin users.
const requireSuperAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required.",
    });
  }

  return next();
};

router.use(authMiddleware, requireSuperAdmin);

// Get reports
router.get("/", getReports);

module.exports = router;