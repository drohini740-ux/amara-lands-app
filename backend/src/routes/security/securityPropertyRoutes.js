
const express = require("express");

const router = express.Router();

// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

// =====================================================
// CONTROLLERS
// =====================================================

const {
  getAssignedProperties,
} = require(
  "../../controllers/security/securityPropertyController"
);

const {
  getAssignedPropertyById,
} = require(
  "../../controllers/security/securityPropertyDetailsController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL ASSIGNED PROPERTIES
// GET /api/v1/security/properties
// =====================================================

router.get(
  "/",
  getAssignedProperties
);

// =====================================================
// GET ASSIGNED PROPERTY BY ID
// GET /api/v1/security/properties/:id
// =====================================================

router.get(
  "/:id",
  getAssignedPropertyById
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

