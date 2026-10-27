
const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/authMiddleware");

const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
} = require("../../controllers/admin/userController");

// Allow only Admin users.
const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }

  return next();
};

// Authenticate first, then authorize.
router.use(verifyToken, requireAdmin);

router.get("/", getAllUsers);
router.post("/", addUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/status", updateUserStatus);
router.put("/:id/role", updateUserRole);

module.exports = router;
