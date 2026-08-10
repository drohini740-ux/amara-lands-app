const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updateVerificationStatus,
} = require("../../controllers/admin/propertyController");
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  getAllProperties
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  getPropertyById
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateProperty
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteProperty
);

router.put(
  "/:id/verification",
  verifyToken,
  authorizeRoles("admin"),
  updateVerificationStatus
);

module.exports = router;