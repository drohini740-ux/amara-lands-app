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
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// BACKUP ROUTES
// =====================================================

router.get("/", getAllBackups);

router.post("/", createBackup);

router.get("/:id", getBackupById);

router.put("/:id/status", updateBackupStatus);

router.delete("/:id", deleteBackup);

module.exports = router;