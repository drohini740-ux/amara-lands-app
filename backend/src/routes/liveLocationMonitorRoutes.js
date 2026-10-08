
const express = require("express");

const router = express.Router();

const {
  getFieldExecutiveLiveLocations,
  getFieldExecutiveLiveLocationById,
} = require("../controllers/liveLocationMonitorController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL FIELD EXECUTIVE LIVE LOCATIONS
// =====================================================

router.get(
  "/",
  getFieldExecutiveLiveLocations
);

// =====================================================
// GET SINGLE FIELD EXECUTIVE LIVE LOCATION
// =====================================================

router.get(
  "/:userId",
  getFieldExecutiveLiveLocationById
);

module.exports = router;

