const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require("../../controllers/superAdmin/superAdminRoleController");

// Allow only authenticated Super Admin users.
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

// Get all roles
router.get("/", getAllRoles);

// Create a role
router.post("/", createRole);

// Get a role by ID
router.get("/:id", getRoleById);

// Update a role
router.put("/:id", updateRole);

// Delete a role
router.delete("/:id", deleteRole);

module.exports = router;