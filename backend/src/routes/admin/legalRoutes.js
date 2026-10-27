
const express = require("express");
const router = express.Router();

const {
  getAllLegalCases,
  getLegalCaseById,
  updateLegalCase,
  deleteLegalCase,
  assignAdvocate,
  getCaseTracking,
} = require("../../controllers/admin/legalController");

const authMiddleware = require("../../middleware/authMiddleware");

const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required.",
    });
  }

  return next();
};

// Protect every endpoint in this router.
router.use(authMiddleware, requireAdmin);

router.get("/tracking", getCaseTracking);
router.get("/", getAllLegalCases);
router.get("/:id", getLegalCaseById);
router.put("/:id/assign-advocate", assignAdvocate);
router.put("/:id", updateLegalCase);
router.delete("/:id", deleteLegalCase);

module.exports = router;
