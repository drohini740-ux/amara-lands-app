const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllInvoices,
} = require("../../controllers/admin/invoiceController");

// ==========================================
// GET ALL INVOICES - ADMIN
// ==========================================
router.get(
  "/",
  authMiddleware,
  getAllInvoices
);

module.exports = router;