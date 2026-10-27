
const express = require("express");
const router = express.Router();

const {
  getSecurityNotifications,
  markSecurityNotificationRead,
} = require("../../controllers/security/securityNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// GET security notifications
router.get("/", getSecurityNotifications);

// Mark a notification as read
router.patch("/:id/read", markSecurityNotificationRead);

module.exports = router;
