
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getAssignedProperties,
} = require("../../controllers/security/securityPropertyController");

const {
  getAssignedPropertyById,
} = require("../../controllers/security/securityPropertyDetailsController");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// GET ALL ASSIGNED PROPERTIES
// GET /api/v1/security/properties
router.get("/", getAssignedProperties);

// GET ASSIGNED PROPERTY BY ID
// GET /api/v1/security/properties/:id
router.get("/:id", getAssignedPropertyById);

module.exports = router;
