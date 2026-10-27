
const express = require("express");
const router = express.Router();

const {
  updateLiveLocation,
  getMyLiveLocation,
  stopLiveLocation,
} = require("../../controllers/fieldExecutive/fieldExecutiveLiveLocationController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// UPDATE LIVE LOCATION
router.post("/", updateLiveLocation);

// GET MY LIVE LOCATION
router.get("/", getMyLiveLocation);

// STOP LIVE LOCATION
router.put("/stop", stopLiveLocation);

module.exports = router;
