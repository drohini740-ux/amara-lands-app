const express = require("express");

const router = express.Router();

const {
  getAllLegalCases,
  getLegalCaseById,
  updateLegalCase,
  deleteLegalCase,
  assignAdvocate,
  getCaseTracking,
} = require("../../controllers/admin/legalController");

const authMiddleware = require("../../middleware/authMiddleware");

// ==========================================
// GET ALL LEGAL CASES - ADMIN
// ==========================================

router.get(
  "/",
  authMiddleware,
  getAllLegalCases
);


// ==========================================
// GET SINGLE LEGAL CASE - ADMIN
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getLegalCaseById
);
router.put(
  "/:id/assign-advocate",
  authMiddleware,
  assignAdvocate
);


// ==========================================
// UPDATE LEGAL CASE - ADMIN
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  updateLegalCase
);

router.get("/tracking", getCaseTracking);
// ==========================================
// DELETE LEGAL CASE - ADMIN
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteLegalCase
);


module.exports = router;