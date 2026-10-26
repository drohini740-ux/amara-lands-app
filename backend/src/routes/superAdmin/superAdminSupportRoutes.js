const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  updateSupportTicketPriority,
  getWhatsAppSupport,
  updateWhatsAppSupport,
} = require("../../controllers/superAdmin/superAdminSupportController");

// Verify that the authenticated user has the Super Admin role.
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

// Authentication first, then role authorization.
router.use(authMiddleware, requireSuperAdmin);

// SUPPORT TICKETS
router.get("/tickets", getAllSupportTickets);

router.get("/tickets/:id", getSupportTicketById);

router.put("/tickets/:id/status", updateSupportTicketStatus);

router.put("/tickets/:id/priority", updateSupportTicketPriority);

// WHATSAPP SUPPORT
router.get("/whatsapp", getWhatsAppSupport);

router.put("/whatsapp/:id", updateWhatsAppSupport);

module.exports = router;