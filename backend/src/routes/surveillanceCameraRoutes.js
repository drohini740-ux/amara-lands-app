const express = require("express");
const router = express.Router();

const {
  getSurveillanceCameras,
  getSurveillanceCamera,
  addSurveillanceCamera,
  updateSurveillanceCamera,
  deleteSurveillanceCamera,
} = require("../controllers/surveillanceCameraController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All Cameras
router.get("/", authMiddleware, getSurveillanceCameras);

// Get Single Camera
router.get("/:id", authMiddleware, getSurveillanceCamera);

// Add Camera
router.post("/", authMiddleware, addSurveillanceCamera);

// Update Camera
router.put("/:id", authMiddleware, updateSurveillanceCamera);

// Delete Camera
router.delete("/:id", authMiddleware, deleteSurveillanceCamera);

module.exports = router;