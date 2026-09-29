const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  updateRefundStatus,
} = require("../../controllers/superAdmin/superAdminPaymentController");

router.use(authMiddleware);

// Get all payments
router.get("/", getAllPayments);

// Get payment by ID
router.get("/:id", getPaymentById);

// Update payment status
router.put("/:id/status", updatePaymentStatus);

// Update refund status
router.put("/:id/refund-status", updateRefundStatus);

module.exports = router;