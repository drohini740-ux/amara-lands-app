
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

// Get all surveillance cameras
router.get("/", authMiddleware, getAllCameras);

// Get one camera by ID
router.get("/:id", authMiddleware, getCameraById);

// Add a new camera
router.post("/", authMiddleware, createCamera);

// Update a camera
router.put("/:id", authMiddleware, updateCamera);

// Delete a camera
router.delete("/:id", authMiddleware, deleteCamera);

module.exports = router;
