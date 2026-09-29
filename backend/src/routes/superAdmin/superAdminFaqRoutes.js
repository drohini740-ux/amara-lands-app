const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  updateFaqStatus,
  deleteFaq,
} = require("../../controllers/superAdmin/superAdminFaqController");

router.use(authMiddleware);

// Get all FAQs
router.get("/", getAllFaqs);

// Create FAQ
router.post("/", createFaq);

// Get FAQ by ID
router.get("/:id", getFaqById);

// Update FAQ
router.put("/:id", updateFaq);

// Update FAQ status
router.put("/:id/status", updateFaqStatus);

// Delete FAQ
router.delete("/:id", deleteFaq);

module.exports = router;