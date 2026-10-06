
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveAppointmentController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY APPOINTMENTS
// =====================================================

router.get(
  "/",
  getMyAppointments
);

// =====================================================
// GET APPOINTMENT BY ID
// =====================================================

router.get(
  "/:id",
  getAppointmentById
);

// =====================================================
// UPDATE STATUS
// =====================================================

router.put(
  "/:id/status",
  updateAppointmentStatus
);

module.exports = router;

