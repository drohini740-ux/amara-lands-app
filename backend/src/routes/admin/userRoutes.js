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

router.use(verifyToken);
router.get("/", getAllUsers);

router.post("/", addUser);

router.get("/:id", getUserById);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

router.put("/:id/status", updateUserStatus);

router.put("/:id/role", updateUserRole);
module.exports = router;