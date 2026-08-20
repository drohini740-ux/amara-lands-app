const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAllPayments,
  getPaymentById,
  getPaymentStats,
  getRecentPayments,
  getPaymentMethodStats,
  getMonthlyRevenue,
  updatePayment,
  deletePayment,
  getPaymentReceipt,
  downloadPaymentReceipt,
} = require("../../controllers/admin/paymentController");
// ==========================================
// ADMIN PAYMENT ROUTES
// ==========================================
// Dashboard statistics
router.get(
  "/stats/dashboard",
  authMiddleware,
  adminMiddleware,
  getPaymentStats
);

// Monthly revenue
router.get(
  "/stats/monthly-revenue",
  authMiddleware,
  adminMiddleware,
  getMonthlyRevenue
);

// Payment method statistics
router.get(
  "/stats/methods",
  authMiddleware,
  adminMiddleware,
  getPaymentMethodStats
);

// Recent payments
router.get(
  "/recent",
  authMiddleware,
  adminMiddleware,
  getRecentPayments
);

// Download receipt
router.get(
  "/receipt/:id",
  authMiddleware,
  adminMiddleware,
  getPaymentReceipt
);

// Get all payments
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPayments
);

// Get single payment
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getPaymentById
);

// Update payment
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updatePayment
);

// Delete payment
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deletePayment
);
// Download Payment Receipt
router.get(
  "/receipt/:id",
  authMiddleware,
  adminMiddleware,
  downloadPaymentReceipt
);
module.exports = router;