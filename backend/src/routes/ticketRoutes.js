const express = require("express");
const router = express.Router();

const {
  getTickets,
  getTicket,
  addTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All Tickets
router.get("/", authMiddleware, getTickets);

// Get Single Ticket
router.get("/:id", authMiddleware, getTicket);

// Add Ticket
router.post("/", authMiddleware, addTicket);

// Update Ticket
router.put("/:id", authMiddleware, updateTicket);

// Delete Ticket
router.delete("/:id", authMiddleware, deleteTicket);

module.exports = router;