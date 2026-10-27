
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

// Protect all Admin payment routes.
router.use(authMiddleware, adminMiddleware);

// Dashboard statistics
router.get("/stats/dashboard", getPaymentStats);

// Monthly revenue
router.get("/stats/monthly-revenue", getMonthlyRevenue);

// Payment method statistics
router.get("/stats/methods", getPaymentMethodStats);

// Recent payments
router.get("/recent", getRecentPayments);

// View payment receipt
router.get("/receipt/:id", getPaymentReceipt);

// Download payment receipt
router.get("/receipt/:id/download", downloadPaymentReceipt);

// Get all payments
router.get("/", getAllPayments);

// Get single payment
router.get("/:id", getPaymentById);

// Update payment
router.put("/:id", updatePayment);

// Delete payment
router.delete("/:id", deletePayment);

module.exports = router;
