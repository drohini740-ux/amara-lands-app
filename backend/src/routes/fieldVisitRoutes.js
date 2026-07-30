const express = require("express");
const router = express.Router();

const {
  getFieldVisits,
  getFieldVisit,
  addFieldVisit,
  updateFieldVisit,
  deleteFieldVisit,
} = require("../controllers/fieldVisitController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All
router.get("/", authMiddleware, getFieldVisits);

// Get Single
router.get("/:id", authMiddleware, getFieldVisit);

// Add
router.post("/", authMiddleware, addFieldVisit);

// Update
router.put("/:id", authMiddleware, updateFieldVisit);

// Delete
router.delete("/:id", authMiddleware, deleteFieldVisit);

module.exports = router;