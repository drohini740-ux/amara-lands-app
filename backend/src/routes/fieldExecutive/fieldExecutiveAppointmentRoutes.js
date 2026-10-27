
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
} = require("../../controllers/fieldExecutive/fieldExecutiveAppointmentController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY APPOINTMENTS
router.get("/", getMyAppointments);

// GET APPOINTMENT BY ID
router.get("/:id", getAppointmentById);

// UPDATE APPOINTMENT STATUS
router.put("/:id/status", updateAppointmentStatus);

module.exports = router;
