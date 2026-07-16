const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// =======================================
// Add Appointment
// =======================================

router.post("/", authMiddleware, addAppointment);

// =======================================
// Get All Appointments
// =======================================

router.get("/", authMiddleware, getAppointments);
router.get("/:id", authMiddleware, getAppointment);

router.put("/:id", authMiddleware, updateAppointment);

router.delete("/:id", authMiddleware, deleteAppointment);

module.exports = router;