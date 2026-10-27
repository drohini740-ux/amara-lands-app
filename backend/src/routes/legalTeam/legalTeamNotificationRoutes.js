
const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  getNotificationById,
  markNotificationAsRead,
} = require("../../controllers/legalTeam/legalTeamNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Legal Team authorization.
router.use(authMiddleware, authorizeRoles("legal"));

// Get all notifications
router.get("/", getAllNotifications);

// Get notification by ID
router.get("/:id", getNotificationById);

// Mark notification as read
router.put("/:id/read", markNotificationAsRead);

module.exports = router;
