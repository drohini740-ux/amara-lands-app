
const express = require("express");

const router = express.Router();

const {
  getMyVisits,
  getMyVisitById,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveVisitController"
);
const {
  createVisitAssignment,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveVisitAssignmentController"
);
const {
  checkInVisit,
  checkOutVisit,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveVisitAttendanceController"
);

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY VISITS
// =====================================================

router.get(
  "/",
  getMyVisits
);

// =====================================================
// GET VISIT BY ID
// =====================================================

router.get(
  "/:id",
  getMyVisitById
);
router.post(
  "/",
  createVisitAssignment
);
router.post(
  "/:id/check-in",
  checkInVisit
);

router.post(
  "/:id/check-out",
  checkOutVisit
);

module.exports = router;

