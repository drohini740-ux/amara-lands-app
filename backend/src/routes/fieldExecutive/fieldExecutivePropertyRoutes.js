
const express = require("express");

const router = express.Router();

const {
  getMyProperties,
  getMyPropertyById,
} = require("../../controllers/fieldExecutive/fieldExecutivePropertyController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// MY PROPERTIES
// =====================================================

router.get("/", getMyProperties);

// =====================================================
// PROPERTY DETAILS
// =====================================================

router.get("/:id", getMyPropertyById);

module.exports = router;

