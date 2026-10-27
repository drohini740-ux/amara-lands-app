
const express = require("express");
const router = express.Router();

const {
  getAllCameras,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
} = require("../../controllers/security/surveillanceCameraController");

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// Require authentication and Security role.
router.use(authMiddleware, authorizeRoles("security"));

// Get all surveillance cameras
router.get("/", getAllCameras);

// Get one camera by ID
router.get("/:id", getCameraById);

// Add a new camera
router.post("/", createCamera);

// Update a camera
router.put("/:id", updateCamera);

// Delete a camera
router.delete("/:id", deleteCamera);

module.exports = router;
