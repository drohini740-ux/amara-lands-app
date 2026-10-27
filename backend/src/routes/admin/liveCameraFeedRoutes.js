
const express = require("express");
const router = express.Router();

const {
  getLiveCameraFeeds,
  getLiveCameraFeed,
} = require("../../controllers/admin/liveCameraFeedController");

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

router.use(authMiddleware, requireAdmin);

router.get("/", getLiveCameraFeeds);
router.get("/:id", getLiveCameraFeed);

module.exports = router;
