const express = require("express");
const router = express.Router();

const {
  getGeoReports,
  getGeoReport,
  addGeoReport,
  updateGeoReport,
  deleteGeoReport,
} = require("../controllers/geoTaggedReportController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All Reports
router.get("/", authMiddleware, getGeoReports);

// Get Single Report
router.get("/:id", authMiddleware, getGeoReport);

// Add Report
router.post("/", authMiddleware, addGeoReport);

// Update Report
router.put("/:id", authMiddleware, updateGeoReport);

// Delete Report
router.delete("/:id", authMiddleware, deleteGeoReport);

module.exports = router;