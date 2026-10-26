
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
// AUDIT LOG ROUTES
// =====================================================

// Get all audit logs
router.get("/", getAllAuditLogs);

// Create audit log
router.post("/", createAuditLog);

// Get audit log by ID
router.get("/:id", getAuditLogById);

// Delete audit log
router.delete("/:id", deleteAuditLog);

module.exports = router;
