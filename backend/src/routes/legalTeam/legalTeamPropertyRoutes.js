
const express = require("express");
const router = express.Router();

const {
  getAllProperties,
  getPropertyById,
} = require("../../controllers/legalTeam/legalTeamPropertyController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get all properties
router.get("/", getAllProperties);

// Get property by ID
router.get("/:id", getPropertyById);

module.exports = router;
