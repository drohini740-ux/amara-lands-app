const express = require("express");
const router = express.Router();

const {
  getPatrolLogs,
  getPatrolLog,
  addPatrolLog,
  updatePatrolLog,
  deletePatrolLog,
} = require("../controllers/patrolLogController");

const authMiddleware = require("../middleware/authMiddleware");

// Get All Patrol Logs
router.get("/", authMiddleware, getPatrolLogs);

// Get Single Patrol Log
router.get("/:id", authMiddleware, getPatrolLog);

// Add Patrol Log
router.post("/", authMiddleware, addPatrolLog);

// Update Patrol Log
router.put("/:id", authMiddleware, updatePatrolLog);

// Delete Patrol Log
router.delete("/:id", authMiddleware, deletePatrolLog);

module.exports = router;