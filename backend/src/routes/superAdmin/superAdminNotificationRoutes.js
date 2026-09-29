const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  updateNotificationReadStatus,
  deleteNotification,
} = require("../../controllers/superAdmin/superAdminNotificationController");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

router.get(
  "/",
  getAllNotifications
);

// =====================================================
// CREATE NOTIFICATION
// =====================================================

router.post(
  "/",
  createNotification
);

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

router.get(
  "/:id",
  getNotificationById
);

// =====================================================
// UPDATE NOTIFICATION
// =====================================================

router.put(
  "/:id",
  updateNotification
);

// =====================================================
// UPDATE READ / UNREAD STATUS
// =====================================================

router.put(
  "/:id/read-status",
  updateNotificationReadStatus
);

// =====================================================
// DELETE NOTIFICATION
// =====================================================

router.delete(
  "/:id",
  deleteNotification
);

module.exports = router;