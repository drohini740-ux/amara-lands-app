const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllProperties,
  getPropertyById,
  verifyProperty,
  rejectProperty,
  deleteProperty,
} = require("../../controllers/superAdmin/superAdminPropertyController");

// Allow only Super Admin users.
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

// Get all properties
router.get("/", getAllProperties);

// Get property by ID
router.get("/:id", getPropertyById);

// Verify property
router.put("/:id/verify", verifyProperty);

// Reject property
router.put("/:id/reject", rejectProperty);

// Delete property
router.delete("/:id", deleteProperty);

module.exports = router;