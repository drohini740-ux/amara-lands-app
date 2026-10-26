
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
// AUTHENTICATION + SUPER ADMIN AUTHORIZATION
// =====================================================

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

router.use(authMiddleware, requireSuperAdmin);

// =====================================================
// SECURITY SESSION ROUTES
// =====================================================

router.get("/", getAllSessions);

router.post("/", createSession);

router.get("/:id", getSessionById);

router.put("/:id/status", updateSessionStatus);

router.put("/:id/force-logout", forceLogoutSession);

router.delete("/:id", deleteSession);

module.exports = router;
