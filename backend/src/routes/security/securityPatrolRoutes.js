
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getSecurityPatrols,
  getSecurityPatrolById,
} = require(
  "../../controllers/security/securityPatrolController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL PATROL LOGS FOR ASSIGNED PROPERTIES
// GET /api/v1/security/patrols
// =====================================================

router.get("/", getSecurityPatrols);

// =====================================================
// GET PATROL DETAILS
// GET /api/v1/security/patrols/:id
// =====================================================

router.get("/:id", getSecurityPatrolById);

module.exports = router;

