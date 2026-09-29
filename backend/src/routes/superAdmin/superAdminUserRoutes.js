const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

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
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// USER MANAGEMENT
// =====================================================

// Get all users
router.get("/", getAllUsers);

// Add user
router.post("/", addUser);

// Get user by ID
router.get("/:id", getUserById);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

// Update user status
router.put(
  "/:id/status",
  updateUserStatus
);

// Update user role
router.put(
  "/:id/role",
  updateUserRole
);

// Reset password
router.put(
  "/:id/reset-password",
  resetUserPassword
);

module.exports = router;