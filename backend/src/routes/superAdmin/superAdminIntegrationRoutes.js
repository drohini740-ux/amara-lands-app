const express = require("express");

const router = express.Router();

const {
  getAllIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  updateIntegrationStatus,
  toggleIntegration,
  deleteIntegration,
  testIntegration,
} = require("../../controllers/superAdmin/superAdminIntegrationController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL INTEGRATIONS
// =====================================================

router.get(
  "/",
  getAllIntegrations
);

// =====================================================
// CREATE INTEGRATION
// =====================================================

router.post(
  "/",
  createIntegration
);

// =====================================================
// GET INTEGRATION BY ID
// =====================================================

router.get(
  "/:id",
  getIntegrationById
);

// =====================================================
// UPDATE INTEGRATION
// =====================================================

router.put(
  "/:id",
  updateIntegration
);

// =====================================================
// UPDATE STATUS
// =====================================================

router.put(
  "/:id/status",
  updateIntegrationStatus
);

// =====================================================
// ENABLE / DISABLE
// =====================================================

router.put(
  "/:id/toggle",
  toggleIntegration
);

// =====================================================
// TEST INTEGRATION
// =====================================================

router.put(
  "/:id/test",
  testIntegration
);

// =====================================================
// DELETE INTEGRATION
// =====================================================

router.delete(
  "/:id",
  deleteIntegration
);

module.exports = router;