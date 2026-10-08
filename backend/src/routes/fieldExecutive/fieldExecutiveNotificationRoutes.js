
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getMyNotifications,
  getNotificationById,
  createNotification,
  updateNotificationReadStatus,
  deleteNotification,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveNotificationController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

router.get(
  "/",
  getMyNotifications
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
// MARK READ / UNREAD
// =====================================================

router.put(
  "/:id/read",
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

