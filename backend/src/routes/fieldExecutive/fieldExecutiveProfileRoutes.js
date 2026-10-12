
const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/fieldExecutive/fieldExecutiveProfileController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY PROFILE
// =====================================================

router.get("/", getMyProfile);

// =====================================================
// UPDATE MY PROFILE
// =====================================================

router.put("/", updateMyProfile);

module.exports = router;

