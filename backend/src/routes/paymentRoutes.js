
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  addPayment,
  getPayments,
  getMyPayments,
  getPayment,
  updatePayment,
  deletePayment,
  createOrder,
  verifyPayment,
  downloadReceipt,
  downloadMyReceipt,
  getPaymentStats,
  getRecentPayments,
  getPaymentMethodStats,
  getMonthlyRevenue,
} = require("../controllers/paymentController");

const adminOnly = authorizeRoles("admin", "super_admin");

// =====================================================
// CUSTOMER PAYMENT ROUTES
// =====================================================

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);

router.get("/my", authMiddleware, getMyPayments);
router.get("/my/receipt/:id", authMiddleware, downloadMyReceipt);

// The controller checks receipt ownership and allows admin roles.
router.get("/receipt/:id", authMiddleware, downloadReceipt);

// =====================================================
// ADMIN PAYMENT DASHBOARD ROUTES
// =====================================================

router.get("/stats/dashboard", authMiddleware, adminOnly, getPaymentStats);
router.get("/stats/monthly-revenue", authMiddleware, adminOnly, getMonthlyRevenue);
router.get("/stats/methods", authMiddleware, adminOnly, getPaymentMethodStats);
router.get("/recent", authMiddleware, adminOnly, getRecentPayments);

// =====================================================
// ADMIN PAYMENT MANAGEMENT ROUTES
// =====================================================

// Create a manual payment record only through authorized administration.
// Customer checkout must use /create-order and /verify-payment.
router.post("/", authMiddleware, adminOnly, addPayment);

// Global payment list and individual payment details are admin-only.
router.get("/", authMiddleware, adminOnly, getPayments);
router.get("/:id", authMiddleware, adminOnly, getPayment);

// Only admins can edit or delete payment records.
router.put("/:id", authMiddleware, adminOnly, updatePayment);
router.delete("/:id", authMiddleware, adminOnly, deletePayment);

module.exports = router;
