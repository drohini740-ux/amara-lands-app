
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/superAdmin/superAdminProfileController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

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

// GET logged-in Super Admin profile
router.get("/", getMyProfile);

// UPDATE logged-in Super Admin profile
router.put("/", updateMyProfile);

module.exports = router;
