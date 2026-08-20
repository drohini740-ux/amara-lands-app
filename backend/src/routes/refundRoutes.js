const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createRefundRequest,
  getMyRefundRequests,
} = require("../controllers/refundController");

// ==========================================
// Customer Refund Routes
// ==========================================

// Create refund request
router.post(
  "/",
  authMiddleware,
  createRefundRequest
);

// Get logged-in customer's refunds
router.get(
  "/my",
  authMiddleware,
  getMyRefundRequests
);

module.exports = router;