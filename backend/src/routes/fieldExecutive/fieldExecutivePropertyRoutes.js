
const express = require("express");
const router = express.Router();

const {
  getMyProperties,
  getMyPropertyById,
} = require("../../controllers/fieldExecutive/fieldExecutivePropertyController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// MY ASSIGNED PROPERTIES
router.get("/", getMyProperties);

// PROPERTY DETAILS
router.get("/:id", getMyPropertyById);

module.exports = router;
