
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllInvoices,
} = require("../../controllers/admin/invoiceController");

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

router.get(
  "/",
  authMiddleware,
  requireAdmin,
  getAllInvoices
);

module.exports = router;
