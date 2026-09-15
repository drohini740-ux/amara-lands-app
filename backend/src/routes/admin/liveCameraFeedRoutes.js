const express = require("express");

const router = express.Router();

const {
  getLiveCameraFeeds,
  getLiveCameraFeed,
} = require("../../controllers/admin/liveCameraFeedController");

const authMiddleware = require("../../middleware/authMiddleware");

// ======================================================
// GET ALL LIVE CAMERA FEEDS
// ======================================================
router.get(
  "/",
  authMiddleware,
  getLiveCameraFeeds
);

// ======================================================
// GET SINGLE CAMERA
// ======================================================
router.get(
  "/:id",
  authMiddleware,
  getLiveCameraFeed
);

module.exports = router;