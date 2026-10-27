
const express = require("express");
const router = express.Router();

const {
  getAllConsultations,
  getConsultationById,
} = require("../../controllers/legalTeam/legalTeamConsultationController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get all consultations
router.get("/", getAllConsultations);

// Get consultation by ID
router.get("/:id", getConsultationById);

module.exports = router;
