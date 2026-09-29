const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
} = require("../../controllers/superAdmin/superAdminPermissionController");

router.use(authMiddleware);

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