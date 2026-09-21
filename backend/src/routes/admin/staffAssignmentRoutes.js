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

// =====================================================
// STAFF ASSIGNMENTS
// Base URL:
// /api/v1/admin/staff-assignments
// =====================================================

// GET all staff assignments
// GET /api/v1/admin/staff-assignments
router.get("/", getStaffAssignments);

// GET available staff
// GET /api/v1/admin/staff-assignments/staff
router.get("/staff", getAvailableStaff);

// GET available properties
// GET /api/v1/admin/staff-assignments/properties
router.get("/properties", getAvailableProperties);

// GET assignment by ID
// GET /api/v1/admin/staff-assignments/:id
router.get("/:id", getStaffAssignmentById);

// CREATE assignment
// POST /api/v1/admin/staff-assignments
router.post("/", createStaffAssignment);

// UPDATE assignment
// PUT /api/v1/admin/staff-assignments/:id
router.put("/:id", updateStaffAssignment);

// DELETE assignment
// DELETE /api/v1/admin/staff-assignments/:id
router.delete("/:id", deleteStaffAssignment);

module.exports = router;