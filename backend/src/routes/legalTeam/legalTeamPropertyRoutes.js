
const express = require("express");

const router = express.Router();

const {
  getAllProperties,
  getPropertyById,
} = require("../../controllers/legalTeam/legalTeamPropertyController");

const authMiddleware = require("../../middleware/authMiddleware");

// Authentication required
router.use(authMiddleware);

// Get all properties
router.get("/", getAllProperties);

// Get property by ID
router.get("/:id", getPropertyById);

module.exports = router;

