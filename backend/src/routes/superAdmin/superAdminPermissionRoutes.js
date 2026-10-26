
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
} = require("../../controllers/superAdmin/superAdminPermissionController");

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
// PERMISSION ROUTES
// =====================================================

// Get all permissions
router.get("/", getAllPermissions);

// Get permissions assigned to a role
router.get("/role/:roleId", getRolePermissions);

// Assign permission to role
router.post("/role/:roleId", assignPermission);

// Remove permission from role
router.delete(
  "/role/:roleId/permission/:permissionId",
  removePermission
);

module.exports = router;
