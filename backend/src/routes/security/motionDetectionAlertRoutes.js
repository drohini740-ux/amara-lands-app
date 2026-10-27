
const express = require("express");
const router = express.Router();

const {
  getMotionDetectionAlerts,
  getMotionDetectionAlertById,
  updateMotionDetectionAlert,
  createMotionDetectionAlert,
} = require("../../controllers/security/motionDetectionAlertController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// Get all motion detection alerts
// Optional filters: status, severity, property_id
router.get("/", getMotionDetectionAlerts);

// Create motion detection alert
router.post("/", createMotionDetectionAlert);

// Get one motion detection alert by ID
router.get("/:id", getMotionDetectionAlertById);

// Update alert status or remarks
router.patch("/:id", updateMotionDetectionAlert);

module.exports = router;
