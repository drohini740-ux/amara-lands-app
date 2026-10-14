
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getSecurityPatrols,
  getSecurityPatrolById,
  createSecurityPatrol,
  getAssignedPatrolProperties,
  updateSecurityPatrol,
  deleteSecurityPatrol,
  getSecurityPatrolReports,
} = require("../../controllers/security/securityPatrolController");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// LIST PATROLS
// =====================================================

router.get("/", getSecurityPatrols);

// =====================================================
// ASSIGNED PROPERTIES
// =====================================================

router.get(
  "/assigned-properties",
  getAssignedPatrolProperties
);

// =====================================================
// SECURITY PATROL REPORTS
// IMPORTANT: KEEP BEFORE /:id
// =====================================================

router.get("/reports", getSecurityPatrolReports);

// =====================================================
// CREATE PATROL
// =====================================================

router.post("/", createSecurityPatrol);

// =====================================================
// VIEW PATROL DETAILS
// =====================================================

router.get("/:id", getSecurityPatrolById);

// =====================================================
// EDIT PATROL
// =====================================================

router.put("/:id", updateSecurityPatrol);

// =====================================================
// DELETE PATROL
// =====================================================

router.delete("/:id", deleteSecurityPatrol);

module.exports = router;
