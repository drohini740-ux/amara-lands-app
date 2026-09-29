
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
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// SYSTEM SETTINGS ROUTES
// =====================================================

router.get(
  "/",
  getAllSettings
);

router.post(
  "/",
  createSetting
);

router.get(
  "/:id",
  getSettingById
);

router.put(
  "/:id",
  updateSetting
);

router.delete(
  "/:id",
  deleteSetting
);

module.exports = router;

