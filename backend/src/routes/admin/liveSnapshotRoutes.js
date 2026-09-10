const express = require("express");

const router = express.Router();

const {
  getLiveSnapshots,
  getLiveSnapshot,
  createLiveSnapshot,
  deleteLiveSnapshot,
} = require("../../controllers/admin/liveSnapshotController");

const authMiddleware = require("../../middleware/authMiddleware");

// ======================================================
// GET ALL SNAPSHOTS
// ======================================================
router.get(
  "/",
  authMiddleware,
  getLiveSnapshots
);

// ======================================================
// GET SINGLE SNAPSHOT
// ======================================================
router.get(
  "/:id",
  authMiddleware,
  getLiveSnapshot
);

// ======================================================
// CREATE SNAPSHOT
// ======================================================
router.post(
  "/",
  authMiddleware,
  createLiveSnapshot
);

// ======================================================
// DELETE SNAPSHOT
// ======================================================
router.delete(
  "/:id",
  authMiddleware,
  deleteLiveSnapshot
);

module.exports = router;