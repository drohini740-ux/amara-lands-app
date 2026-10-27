
const express = require("express");
const router = express.Router();

const {
  getLiveSnapshots,
  getLiveSnapshot,
  createLiveSnapshot,
  deleteLiveSnapshot,
} = require("../../controllers/admin/liveSnapshotController");

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

router.get("/", getLiveSnapshots);
router.get("/:id", getLiveSnapshot);
router.post("/", createLiveSnapshot);
router.delete("/:id", deleteLiveSnapshot);

module.exports = router;
