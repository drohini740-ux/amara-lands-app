const express = require("express");

const router = express.Router();

const {
  getAllLegalCases,
  getLegalCaseById,
} = require("../../controllers/legalTeam/legalTeamCaseController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// LEGAL CASES
// =====================================================

router.get("/", getAllLegalCases);

router.get("/:id", getLegalCaseById);

module.exports = router;