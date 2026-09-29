
const express = require("express");

const router = express.Router();

const {
  getAllAppointments,
  getAppointmentById,
} = require("../../controllers/legalTeam/legalTeamAppointmentController");

const authMiddleware = require("../../middleware/authMiddleware");

// Authentication required
router.use(authMiddleware);

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

module.exports = router;

