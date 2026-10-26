
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentRemarks,
} = require("../../controllers/superAdmin/superAdminAppointmentController");

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
// APPOINTMENT MANAGEMENT
// =====================================================

// Get all appointments
router.get("/", getAllAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment status
router.put("/:id/status", updateAppointmentStatus);

// Update appointment remarks
router.put("/:id/remarks", updateAppointmentRemarks);

module.exports = router;
