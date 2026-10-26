
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

// =====================================================
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

const requireSuperAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required.",
    });
  }

  return next();
};

router.use(authMiddleware, requireSuperAdmin);

// =====================================================
// FAQ ROUTES
// =====================================================

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
