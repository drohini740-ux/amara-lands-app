
const express = require("express");
const router = express.Router();

const {
  getSecurityNotifications,
  markSecurityNotificationRead,
} = require("../../controllers/security/securityNotificationController");

const authMiddleware = require("../../middleware/authMiddleware");

router.get("/", authMiddleware, getSecurityNotifications);
router.patch("/:id/read", authMiddleware, markSecurityNotificationRead);

module.exports = router;
