
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

  return next();
};

// Authenticate and authorize every endpoint.
router.use(authMiddleware, requireAdmin);

router.get("/", getMotionDetectionAlerts);
router.get("/:id", getMotionDetectionAlert);
router.post("/", addMotionDetectionAlert);
router.put("/:id", updateMotionDetectionAlert);
router.delete("/:id", deleteMotionDetectionAlert);
router.put("/:id/acknowledge", acknowledgeMotionDetectionAlert);
router.put("/:id/resolve", resolveMotionDetectionAlert);

module.exports = router;
