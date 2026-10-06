
const express = require("express");

const router = express.Router();

const {
  getAllNotifications,
  getNotificationById,
  markNotificationAsRead,
} = require("../../controllers/legalTeam/legalTeamNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

router.get("/", getAllNotifications);

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

router.get("/:id", getNotificationById);

// =====================================================
// MARK NOTIFICATION AS READ
// =====================================================

router.put("/:id/read", markNotificationAsRead);

module.exports = router;

