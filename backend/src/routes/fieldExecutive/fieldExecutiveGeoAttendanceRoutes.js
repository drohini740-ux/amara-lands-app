
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  recordGeoAttendance,
  getMyGeoAttendance,
  getGeoAttendanceByVisit,
} = require("../../controllers/fieldExecutive/fieldExecutiveGeoAttendanceController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// Record check-in / check-out GPS
router.post("/", recordGeoAttendance);

// Get current user's geo attendance
router.get("/", getMyGeoAttendance);

// Get geo attendance for specific visit
router.get("/visit/:visitId", getGeoAttendanceByVisit);

module.exports = router;
