
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllBackups,
  getBackupById,
  createBackup,
  updateBackupStatus,
  deleteBackup,
} = require("../../controllers/superAdmin/superAdminBackupController");

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
// BACKUP ROUTES
// =====================================================

router.get("/", getAllBackups);

router.post("/", createBackup);

router.get("/:id", getBackupById);

router.put("/:id/status", updateBackupStatus);

router.delete("/:id", deleteBackup);

module.exports = router;
