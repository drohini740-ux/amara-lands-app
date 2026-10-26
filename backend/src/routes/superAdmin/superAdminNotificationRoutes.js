
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  updateNotificationReadStatus,
  deleteNotification,
} = require("../../controllers/superAdmin/superAdminNotificationController");

// =====================================================
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

const requireSuperAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required.",
    });
  }

  return next();
};

router.use(authMiddleware, requireSuperAdmin);

// =====================================================
// NOTIFICATION ROUTES
// =====================================================

// Get all notifications
router.get("/", getAllNotifications);

// Create notification
router.post("/", createNotification);

// Get notification by ID
router.get("/:id", getNotificationById);

// Update notification
router.put("/:id", updateNotification);

// Update read / unread status
router.put("/:id/read-status", updateNotificationReadStatus);

// Delete notification
router.delete("/:id", deleteNotification);

module.exports = router;
