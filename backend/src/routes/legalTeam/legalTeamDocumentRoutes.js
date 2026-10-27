
const express = require("express");
const router = express.Router();

const {
  getAllDocuments,
  getDocumentById,
} = require("../../controllers/legalTeam/legalTeamDocumentController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get all documents
router.get("/", getAllDocuments);

// Get document by ID
router.get("/:id", getDocumentById);

module.exports = router;
