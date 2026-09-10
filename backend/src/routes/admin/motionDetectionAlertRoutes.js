const express = require("express");

const router = express.Router();

const {
  getMotionDetectionAlerts,
  getMotionDetectionAlert,
  addMotionDetectionAlert,
  updateMotionDetectionAlert,
  deleteMotionDetectionAlert,
  resolveMotionDetectionAlert,
  acknowledgeMotionDetectionAlert,
} = require("../../controllers/admin/motionDetectionAlertController");

const authMiddleware = require("../../middleware/authMiddleware");

// ======================================================
// GET ALL MOTION DETECTION ALERTS
// ======================================================
router.get(
  "/",
  authMiddleware,
  getMotionDetectionAlerts
);

// ======================================================
// GET SINGLE MOTION DETECTION ALERT
// ======================================================
router.get(
  "/:id",
  authMiddleware,
  getMotionDetectionAlert
);

// ======================================================
// CREATE MOTION DETECTION ALERT
// ======================================================
router.post(
  "/",
  authMiddleware,
  addMotionDetectionAlert
);

// ======================================================
// UPDATE MOTION DETECTION ALERT
// ======================================================
router.put(
  "/:id",
  authMiddleware,
  updateMotionDetectionAlert
);

// ======================================================
// DELETE MOTION DETECTION ALERT
// ======================================================
router.delete(
  "/:id",
  authMiddleware,
  deleteMotionDetectionAlert
);

// ======================================================
// ACKNOWLEDGE MOTION DETECTION ALERT
// ======================================================
router.put(
  "/:id/acknowledge",
  authMiddleware,
  acknowledgeMotionDetectionAlert
);

// ======================================================
// RESOLVE MOTION DETECTION ALERT
// ======================================================
router.put(
  "/:id/resolve",
  authMiddleware,
  resolveMotionDetectionAlert
);

module.exports = router;