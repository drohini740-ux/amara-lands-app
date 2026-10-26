
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllSettings,
  getSettingById,
  createSetting,
  updateSetting,
  deleteSetting,
} = require("../../controllers/superAdmin/superAdminSettingsController");

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

// =====================================================
// SYSTEM SETTINGS ROUTES
// =====================================================

router.get("/", getAllSettings);

router.post("/", createSetting);

router.get("/:id", getSettingById);

router.put("/:id", updateSetting);

router.delete("/:id", deleteSetting);

module.exports = router;
