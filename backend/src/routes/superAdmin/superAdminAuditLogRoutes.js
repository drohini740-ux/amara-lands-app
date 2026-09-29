
const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllAuditLogs,
  getAuditLogById,
  createAuditLog,
  deleteAuditLog,
} = require("../../controllers/superAdmin/superAdminAuditLogController");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// AUDIT LOG ROUTES
// =====================================================

router.get(
  "/",
  getAllAuditLogs
);

router.post(
  "/",
  createAuditLog
);

router.get(
  "/:id",
  getAuditLogById
);

router.delete(
  "/:id",
  deleteAuditLog
);

module.exports = router;

