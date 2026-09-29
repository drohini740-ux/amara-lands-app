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

router.use(authMiddleware);

router.get("/", getAllRoles);

router.post("/", createRole);

router.get("/:id", getRoleById);

router.put("/:id", updateRole);

router.delete("/:id", deleteRole);

module.exports = router;