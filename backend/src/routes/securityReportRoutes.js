const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/securityReportController");

// Get all reports
router.get("/", authMiddleware, (req, res, next) => {
  console.log("✅ GET /security-reports hit");
  next();
}, getAllReports);

// Get single report
router.get("/:id", authMiddleware, getReportById);

// Create report
router.post("/", authMiddleware, createReport);

// Update report
router.put("/:id", authMiddleware, updateReport);

// Delete report
router.delete("/:id", authMiddleware, deleteReport);

module.exports = router;