
const express = require("express");
const router = express.Router();

const {
  getMotionDetectionAlerts,
  getMotionDetectionAlertById,
  updateMotionDetectionAlert,
  createMotionDetectionAlert,
} = require("../../controllers/security/motionDetectionAlertController");

const authMiddleware = require("../../middleware/authMiddleware");

// GET all motion detection alerts
// Optional filters: status, severity, property_id
router.get("/", authMiddleware, getMotionDetectionAlerts);
router.post("/", authMiddleware, createMotionDetectionAlert);

// GET one motion detection alert by ID
router.get("/:id", authMiddleware, getMotionDetectionAlertById);

// UPDATE alert status or remarks
router.patch("/:id", authMiddleware, updateMotionDetectionAlert);

module.exports = router;
