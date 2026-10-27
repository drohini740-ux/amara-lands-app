
const express = require("express");
const router = express.Router();

const {
  getAllLegalCases,
  getLegalCaseById,
} = require("../../controllers/legalTeam/legalTeamCaseController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get all legal cases
router.get("/", getAllLegalCases);

// Get legal case by ID
router.get("/:id", getLegalCaseById);

module.exports = router;
