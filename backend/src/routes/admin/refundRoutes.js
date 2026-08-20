const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getAllRefundRequests,
  getRefundRequestById,
  approveRefund,
  rejectRefund,
} = require("../../controllers/admin/refundController");

// ==========================================
// ADMIN REFUND ROUTES
// ==========================================

// Get all refund requests
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllRefundRequests
);

// Get single refund request
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getRefundRequestById
);

// Approve refund
router.put(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveRefund
);

// Reject refund
router.put(
  "/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectRefund
);

module.exports = router;