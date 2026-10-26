
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

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

// =====================================================
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

const requireSuperAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required.",
    });
  }

  return next();
};

router.use(authMiddleware, requireSuperAdmin);

// =====================================================
// INTEGRATION ROUTES
// =====================================================

// Get all integrations
router.get("/", getAllIntegrations);

// Create integration
router.post("/", createIntegration);

// Get integration by ID
router.get("/:id", getIntegrationById);

// Update integration
router.put("/:id", updateIntegration);

// Update integration status
router.put("/:id/status", updateIntegrationStatus);

// Enable / disable integration
router.put("/:id/toggle", toggleIntegration);

// Test integration
router.put("/:id/test", testIntegration);

// Delete integration
router.delete("/:id", deleteIntegration);

module.exports = router;
