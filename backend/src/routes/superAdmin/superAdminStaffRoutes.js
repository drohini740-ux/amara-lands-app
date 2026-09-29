const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllStaff,
  getStaffById,
  updateStaffStatus,
  updateStaffRole,
  getStaffAssignments,
  updateAssignmentStatus,
} = require("../../controllers/superAdmin/superAdminStaffController");

router.use(authMiddleware);

// Staff
router.get("/", getAllStaff);

router.get("/:id", getStaffById);

router.put("/:id/status", updateStaffStatus);

router.put("/:id/role", updateStaffRole);

// Staff assignments
router.get("/assignments/all", getStaffAssignments);

router.put(
  "/assignments/:id/status",
  updateAssignmentStatus
);

module.exports = router;