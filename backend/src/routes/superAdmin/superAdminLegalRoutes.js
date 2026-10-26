
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

// =====================================================
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

const requireSuperAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required.",
    });
  }

  return next();
};

router.use(authMiddleware, requireSuperAdmin);

// =====================================================
// LEGAL CASES
// =====================================================

router.get("/cases", getAllLegalCases);

router.get("/cases/:id", getLegalCaseById);

router.put("/cases/:id/status", updateLegalCaseStatus);

router.delete("/cases/:id", deleteLegalCase);

// =====================================================
// LEGAL CONSULTATIONS
// =====================================================

router.get("/consultations", getAllLegalConsultations);

router.put(
  "/consultations/:id/status",
  updateConsultationStatus
);

module.exports = router;
