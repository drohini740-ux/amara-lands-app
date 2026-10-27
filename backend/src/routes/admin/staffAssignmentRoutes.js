
const express = require("express");
const router = express.Router();

const {
  getStaffAssignments,
  getStaffAssignmentById,
  createStaffAssignment,
  updateStaffAssignment,
  deleteStaffAssignment,
  getAvailableStaff,
  getAvailableProperties,
} = require("../../controllers/admin/staffAssignmentController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

// Protect every staff assignment endpoint.
router.use(authMiddleware, adminMiddleware);

// GET all staff assignments
router.get("/", getStaffAssignments);

// GET available staff
router.get("/staff", getAvailableStaff);

// GET available properties
router.get("/properties", getAvailableProperties);

// GET assignment by ID
router.get("/:id", getStaffAssignmentById);

// CREATE assignment
router.post("/", createStaffAssignment);

// UPDATE assignment
router.put("/:id", updateStaffAssignment);

// DELETE assignment
router.delete("/:id", deleteStaffAssignment);

module.exports = router;
