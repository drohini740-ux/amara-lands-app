const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addNotification,
  getNotifications,
  getNotification,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

// Create Notification
router.post("/", authMiddleware, addNotification);

// Get All Notifications
router.get("/", authMiddleware, getNotifications);

// Get Single Notification
router.get("/:id", authMiddleware, getNotification);

// Mark Notification as Read
router.put("/:id/read", authMiddleware, markAsRead);

// Delete Notification
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;