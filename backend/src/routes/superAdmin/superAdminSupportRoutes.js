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

router.use(authMiddleware);

// =====================================================
// SUPPORT TICKETS
// =====================================================

router.get(
  "/tickets",
  getAllSupportTickets
);

router.get(
  "/tickets/:id",
  getSupportTicketById
);

router.put(
  "/tickets/:id/status",
  updateSupportTicketStatus
);

router.put(
  "/tickets/:id/priority",
  updateSupportTicketPriority
);

// =====================================================
// WHATSAPP SUPPORT
// =====================================================

router.get(
  "/whatsapp",
  getWhatsAppSupport
);

router.put(
  "/whatsapp/:id",
  updateWhatsAppSupport
);

module.exports = router;