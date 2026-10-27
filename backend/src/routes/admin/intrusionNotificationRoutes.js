
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

const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }

  next();
};

router.use(authMiddleware, requireAdmin);

router.get("/", getIntrusionNotifications);
router.get("/:id", getIntrusionNotification);
router.post("/", createIntrusionNotification);
router.put("/:id", updateIntrusionNotification);
router.put("/:id/acknowledge", acknowledgeIntrusionNotification);
router.patch("/:id/resolve", resolveIntrusionNotification);
router.delete("/:id", deleteIntrusionNotification);

module.exports = router;
