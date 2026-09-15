const express = require("express");

const router = express.Router();

const {
  getIntrusionNotifications,
  getIntrusionNotification,
  createIntrusionNotification,
  updateIntrusionNotification,
  acknowledgeIntrusionNotification,
  resolveIntrusionNotification,
  deleteIntrusionNotification,
} = require("../../controllers/admin/intrusionNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");

// GET all
router.get(
  "/",
  authMiddleware,
  getIntrusionNotifications
);

// GET single
router.get(
  "/:id",
  authMiddleware,
  getIntrusionNotification
);

// CREATE
router.post(
  "/",
  authMiddleware,
  createIntrusionNotification
);

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  updateIntrusionNotification
);

// ACKNOWLEDGE
router.put(
  "/:id/acknowledge",
  authMiddleware,
  acknowledgeIntrusionNotification
);

// RESOLVE
router.patch(
  "/:id/resolve",
  authMiddleware,
  resolveIntrusionNotification
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  deleteIntrusionNotification
);

module.exports = router;