
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  updateRefundStatus,
} = require("../../controllers/superAdmin/superAdminPaymentController");

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
// PAYMENT ROUTES
// =====================================================

// Get all payments
router.get("/", getAllPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Update payment status
router.put("/:id/status", updatePaymentStatus);

// Update refund status
router.put("/:id/refund-status", updateRefundStatus);

module.exports = router;