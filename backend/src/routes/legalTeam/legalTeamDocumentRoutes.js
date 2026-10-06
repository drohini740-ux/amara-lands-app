
const express = require("express");

const router = express.Router();

const {
  getAllDocuments,
  getDocumentById,
} = require("../../controllers/legalTeam/legalTeamDocumentController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL DOCUMENTS
// =====================================================

router.get("/", getAllDocuments);

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

router.get("/:id", getDocumentById);

module.exports = router;

