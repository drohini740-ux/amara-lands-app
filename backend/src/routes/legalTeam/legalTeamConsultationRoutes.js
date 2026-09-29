const express = require("express");

const router = express.Router();

const {
  getAllConsultations,
  getConsultationById,
} = require("../../controllers/legalTeam/legalTeamConsultationController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// CONSULTATIONS
// =====================================================

router.get("/", getAllConsultations);

router.get("/:id", getConsultationById);

module.exports = router;