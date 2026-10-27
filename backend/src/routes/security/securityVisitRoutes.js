
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getSecurityVisits,
  getSecurityVisitById,
} = require("../../controllers/security/securityVisitController");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// GET /api/v1/security/visits
router.get("/", getSecurityVisits);

// GET /api/v1/security/visits/:id
router.get("/:id", getSecurityVisitById);

module.exports = router;
