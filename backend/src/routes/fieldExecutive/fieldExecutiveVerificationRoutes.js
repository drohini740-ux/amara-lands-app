
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getMyVerificationProperties,
  getVerificationPropertyById,
  verifyProperty,
  rejectProperty,
} = require("../../controllers/fieldExecutive/fieldExecutiveVerificationController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY VERIFICATION PROPERTIES
router.get("/", getMyVerificationProperties);

// GET SINGLE PROPERTY
router.get("/:id", getVerificationPropertyById);

// VERIFY PROPERTY
router.put("/:id/verify", verifyProperty);

// REJECT PROPERTY
router.put("/:id/reject", rejectProperty);

module.exports = router;
