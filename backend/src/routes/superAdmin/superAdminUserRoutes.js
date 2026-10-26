
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/authorizeRoles");

const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
} = require("../../controllers/superAdmin/superAdminUserController");

// =====================================================
// AUTHENTICATION + DATABASE-VERIFIED SUPER ADMIN ACCESS
// =====================================================

// Verify JWT, then verify the user's current role and status
// against the database.
router.use(authMiddleware, authorizeRoles("super_admin"));

// =====================================================
// SUPER ADMIN USER MANAGEMENT
// =====================================================

// Get all users
router.get("/", getAllUsers);

// Create a user
router.post("/", addUser);

// Get a user by ID
router.get("/:id", getUserById);

// Update a user
router.put("/:id", updateUser);

// Delete a user
router.delete("/:id", deleteUser);

// Update user status
router.put("/:id/status", updateUserStatus);

// Update user role
router.put("/:id/role", updateUserRole);

// Reset user password
router.put("/:id/reset-password", resetUserPassword);

module.exports = router;
