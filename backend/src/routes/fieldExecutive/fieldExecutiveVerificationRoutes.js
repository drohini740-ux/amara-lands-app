
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getMyVerificationProperties,
  getVerificationPropertyById,
  verifyProperty,
  rejectProperty,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveVerificationController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY VERIFICATION PROPERTIES
// =====================================================

router.get(
  "/",
  getMyVerificationProperties
);

// =====================================================
// GET SINGLE PROPERTY
// =====================================================

router.get(
  "/:id",
  getVerificationPropertyById
);

// =====================================================
// VERIFY PROPERTY
// =====================================================

router.put(
  "/:id/verify",
  verifyProperty
);

// =====================================================
// REJECT PROPERTY
// =====================================================

router.put(
  "/:id/reject",
  rejectProperty
);

module.exports = router;

