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

router.use(authMiddleware);

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