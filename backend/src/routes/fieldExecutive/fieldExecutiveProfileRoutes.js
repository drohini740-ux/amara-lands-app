
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/fieldExecutive/fieldExecutiveProfileController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY PROFILE
router.get("/", getMyProfile);

// UPDATE MY PROFILE
router.put("/", updateMyProfile);

module.exports = router;
