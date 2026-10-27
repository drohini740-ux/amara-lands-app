
const express = require("express");
const router = express.Router();

const {
  getMyVisits,
  getMyVisitById,
} = require("../../controllers/fieldExecutive/fieldExecutiveVisitController");

const {
  createVisitAssignment,
} = require("../../controllers/fieldExecutive/fieldExecutiveVisitAssignmentController");

const {
  checkInVisit,
  checkOutVisit,
} = require("../../controllers/fieldExecutive/fieldExecutiveVisitAttendanceController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY VISITS
router.get("/", getMyVisits);

// GET VISIT BY ID
router.get("/:id", getMyVisitById);

// CREATE VISIT ASSIGNMENT
router.post("/", createVisitAssignment);

// CHECK IN
router.post("/:id/check-in", checkInVisit);

// CHECK OUT
router.post("/:id/check-out", checkOutVisit);

module.exports = router;
