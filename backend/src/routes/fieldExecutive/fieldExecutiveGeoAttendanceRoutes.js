
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  recordGeoAttendance,
  getMyGeoAttendance,
  getGeoAttendanceByVisit,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveGeoAttendanceController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GEO ATTENDANCE
// =====================================================

// Record check-in / check-out GPS
router.post(
  "/",
  recordGeoAttendance
);

// Get current user's geo attendance
router.get(
  "/",
  getMyGeoAttendance
);

// Get geo attendance for specific visit
router.get(
  "/visit/:visitId",
  getGeoAttendanceByVisit
);

module.exports = router;

