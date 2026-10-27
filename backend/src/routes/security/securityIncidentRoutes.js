
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getIntrusionNotifications,
  getIntrusionNotificationById,
  updateIntrusionNotificationStatus,
  getMotionAlerts,
  getMotionAlertById,
  updateMotionAlertStatus,
} = require("../../controllers/security/securityIncidentController");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// INTRUSION INCIDENTS
router.get("/incidents", getIntrusionNotifications);
router.get("/incidents/:id", getIntrusionNotificationById);
router.put("/incidents/:id/status", updateIntrusionNotificationStatus);

// MOTION DETECTION ALERTS
router.get("/motion-alerts", getMotionAlerts);
router.get("/motion-alerts/:id", getMotionAlertById);
router.put("/motion-alerts/:id/status", updateMotionAlertStatus);

module.exports = router;
