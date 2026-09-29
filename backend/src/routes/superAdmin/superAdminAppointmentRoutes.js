const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentRemarks,
} = require("../../controllers/superAdmin/superAdminAppointmentController");

router.use(authMiddleware);

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment status
router.put("/:id/status", updateAppointmentStatus);

// Update appointment remarks
router.put("/:id/remarks", updateAppointmentRemarks);

module.exports = router;