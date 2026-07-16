const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addLegalCase,
  getLegalCases,
  getLegalCase,
  updateLegalCase,
  deleteLegalCase,
} = require("../controllers/legalController");

// Add Legal Case
router.post("/", authMiddleware, addLegalCase);

// Get All Legal Cases
router.get("/", authMiddleware, getLegalCases);

// Get Single Legal Case
router.get("/:id", authMiddleware, getLegalCase);

// Update Legal Case
router.put("/:id", authMiddleware, updateLegalCase);

// Delete Legal Case
router.delete("/:id", authMiddleware, deleteLegalCase);

module.exports = router;