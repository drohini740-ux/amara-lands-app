const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllLegalCases,
  getLegalCaseById,
  updateLegalCaseStatus,
  deleteLegalCase,
  getAllLegalConsultations,
  updateConsultationStatus,
} = require("../../controllers/superAdmin/superAdminLegalController");

router.use(authMiddleware);

// Legal Cases
router.get("/cases", getAllLegalCases);

router.get("/cases/:id", getLegalCaseById);

router.put("/cases/:id/status", updateLegalCaseStatus);

router.delete("/cases/:id", deleteLegalCase);

// Legal Consultations
router.get("/consultations", getAllLegalConsultations);

router.put(
  "/consultations/:id/status",
  updateConsultationStatus
);

module.exports = router;