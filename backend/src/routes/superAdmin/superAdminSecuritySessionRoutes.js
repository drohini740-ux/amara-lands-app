
const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllSessions,
  getSessionById,
  createSession,
  updateSessionStatus,
  forceLogoutSession,
  deleteSession,
} = require("../../controllers/superAdmin/superAdminSecuritySessionController");
// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// SESSION ROUTES
// =====================================================

router.get("/", getAllSessions);

router.get("/:id", getSessionById);

router.put("/:id/status", updateSessionStatus);

router.put("/:id/force-logout", forceLogoutSession);

router.delete("/:id", deleteSession);
router.post("/", createSession);

module.exports = router;
