const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllSecurityReports,
  getSecurityReportById,
  updateSecurityReportStatus,

  getAllSurveillanceCameras,
  updateCameraStatus,

  getAllPatrolLogs,
  updatePatrolStatus,

  getAllIntrusionNotifications,
  updateIntrusionNotificationStatus,

  getAllMotionDetectionAlerts,
  updateMotionDetectionAlertStatus,

  getAllStaffAssignments,
  updateStaffAssignmentStatus,

  getAllVisitLogs,
} = require("../../controllers/superAdmin/superAdminSecurityController");

router.use(authMiddleware);

// =====================================================
// SECURITY REPORTS
// =====================================================

router.get(
  "/reports",
  getAllSecurityReports
);

router.get(
  "/reports/:id",
  getSecurityReportById
);

router.put(
  "/reports/:id/status",
  updateSecurityReportStatus
);

// =====================================================
// SURVEILLANCE CAMERAS
// =====================================================

router.get(
  "/cameras",
  getAllSurveillanceCameras
);

router.put(
  "/cameras/:id/status",
  updateCameraStatus
);

// =====================================================
// PATROL LOGS
// =====================================================

router.get(
  "/patrols",
  getAllPatrolLogs
);

router.put(
  "/patrols/:id/status",
  updatePatrolStatus
);

// =====================================================
// INTRUSION NOTIFICATIONS
// =====================================================

router.get(
  "/intrusions",
  getAllIntrusionNotifications
);

router.put(
  "/intrusions/:id/status",
  updateIntrusionNotificationStatus
);

// =====================================================
// MOTION DETECTION ALERTS
// =====================================================

router.get(
  "/motion-alerts",
  getAllMotionDetectionAlerts
);

router.put(
  "/motion-alerts/:id/status",
  updateMotionDetectionAlertStatus
);

// =====================================================
// STAFF ASSIGNMENTS
// =====================================================

router.get(
  "/assignments",
  getAllStaffAssignments
);

router.put(
  "/assignments/:id/status",
  updateStaffAssignmentStatus
);

// =====================================================
// VISIT LOGS
// =====================================================

router.get(
  "/visits",
  getAllVisitLogs
);

module.exports = router;