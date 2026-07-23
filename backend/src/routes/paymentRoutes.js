const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  createOrder,
  verifyPayment,
  downloadReceipt,
  getPaymentStats,
  getRecentPayments,
    getPaymentMethodStats
} = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);

router.get("/receipt/:id", authMiddleware, downloadReceipt);

// Dashboard routes (keep these BEFORE "/:id")
router.get("/stats/dashboard", authMiddleware, getPaymentStats);
router.get("/stats/methods", authMiddleware, getPaymentMethodStats);
router.get("/recent", authMiddleware, getRecentPayments);

// CRUD routes
router.post("/", authMiddleware, addPayment);
router.get("/", authMiddleware, getPayments);
router.get("/:id", authMiddleware, getPayment);
router.put("/:id", authMiddleware, updatePayment);
router.delete("/:id", authMiddleware, deletePayment);

module.exports = router;