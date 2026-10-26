
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllStaff,
  getStaffById,
  updateStaffStatus,
  updateStaffRole,
  getStaffAssignments,
  updateAssignmentStatus,
} = require("../../controllers/superAdmin/superAdminStaffController");

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
// STAFF MANAGEMENT
// =====================================================

router.get("/", getAllStaff);

router.get("/:id", getStaffById);

router.put("/:id/status", updateStaffStatus);

router.put("/:id/role", updateStaffRole);

// =====================================================
// STAFF ASSIGNMENTS
// =====================================================

router.get("/assignments/all", getStaffAssignments);

router.put("/assignments/:id/status", updateAssignmentStatus);

module.exports = router;
