
const pool = require("../../config/db");

// =====================================================
// ALLOWED ROLES
// =====================================================

const ALLOWED_ROLES = [
  "security",
  "admin",
  "super_admin",
];

// =====================================================
// CHECK ACCESS
// =====================================================

const checkAccess = (req, res) => {
  const role = String(req.user?.role || "").toLowerCase();

  if (!ALLOWED_ROLES.includes(role)) {
    res.status(403).json({
      success: false,
      message: "You are not authorized to manage security incidents and alerts.",
    });

    return false;
  }

  return true;
};

// =====================================================
// VALIDATE ID
// =====================================================

const isValidId = (id) => {
  return /^\d+$/.test(String(id)) && Number(id) > 0;
};

// =====================================================
// GET INTRUSION INCIDENTS
// GET /api/v1/security/incident-alerts/incidents
// =====================================================

const getIntrusionNotifications = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { status, severity, search } = req.query;

    const values = [];
    const conditions = [];

    if (status && status !== "all") {
      values.push(status);
      conditions.push(`LOWER(n.status) = LOWER($${values.length})`);
    }

    if (severity && severity !== "all") {
      values.push(severity);
      conditions.push(`LOWER(n.severity) = LOWER($${values.length})`);
    }

    if (search) {
      values.push(`%${search}%`);
      const index = values.length;

      conditions.push(`
        (
          CAST(n.id AS TEXT) ILIKE $${index}
          OR n.notification_type ILIKE $${index}
          OR COALESCE(n.message, '') ILIKE $${index}
          OR CAST(n.property_id AS TEXT) ILIKE $${index}
          OR CAST(n.camera_id AS TEXT) ILIKE $${index}
        )
      `);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `
      SELECT
        n.id,
        n.property_id,
        n.camera_id,
        n.notification_type,
        n.severity,
        n.message,
        n.status,
        n.snapshot_url,
        n.detected_at,
        n.created_at
      FROM intrusion_notifications n
      ${whereClause}
      ORDER BY n.detected_at DESC NULLS LAST, n.id DESC
      `,
      values
    );

    return res.status(200).json({
      success: true,
      message: "Intrusion incidents fetched successfully.",
      total: result.rows.length,
      incidents: result.rows,
    });
  } catch (error) {
    console.error("Get Intrusion Notifications Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch intrusion incidents.",
    });
  }
};

// =====================================================
// GET INTRUSION INCIDENT BY ID
// GET /api/v1/security/incident-alerts/incidents/:id
// =====================================================

const getIntrusionNotificationById = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        n.id,
        n.property_id,
        n.camera_id,
        n.notification_type,
        n.severity,
        n.message,
        n.status,
        n.snapshot_url,
        n.detected_at,
        n.created_at
      FROM intrusion_notifications n
      WHERE n.id = $1
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident fetched successfully.",
      incident: result.rows[0],
    });
  } catch (error) {
    console.error("Get Intrusion Notification By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch incident details.",
    });
  }
};

// =====================================================
// UPDATE INTRUSION INCIDENT STATUS
// PUT /api/v1/security/incident-alerts/incidents/:id/status
// =====================================================

const updateIntrusionNotificationStatus = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid incident ID.",
      });
    }

    const allowedStatuses = [
      "New",
      "Acknowledged",
      "Resolved",
      "Dismissed",
    ];

    const normalizedStatus = allowedStatuses.find(
      (item) => item.toLowerCase() === String(status || "").toLowerCase()
    );

    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    const result = await pool.query(
      `
      UPDATE intrusion_notifications
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [normalizedStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Incident not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Incident status updated successfully.",
      incident: result.rows[0],
    });
  } catch (error) {
    console.error("Update Intrusion Notification Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update incident status.",
    });
  }
};

// =====================================================
// GET MOTION DETECTION ALERTS
// GET /api/v1/security/incident-alerts/motion-alerts
// =====================================================

const getMotionAlerts = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { status, severity, search } = req.query;

    const values = [];
    const conditions = [];

    if (status && status !== "all") {
      values.push(status);
      conditions.push(`LOWER(a.status) = LOWER($${values.length})`);
    }

    if (severity && severity !== "all") {
      values.push(severity);
      conditions.push(`LOWER(a.severity) = LOWER($${values.length})`);
    }

    if (search) {
      values.push(`%${search}%`);
      const index = values.length;

      conditions.push(`
        (
          CAST(a.id AS TEXT) ILIKE $${index}
          OR a.alert_type ILIKE $${index}
          OR COALESCE(a.remarks, '') ILIKE $${index}
          OR CAST(a.property_id AS TEXT) ILIKE $${index}
          OR CAST(a.camera_id AS TEXT) ILIKE $${index}
        )
      `);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.property_id,
        a.camera_id,
        a.alert_type,
        a.severity,
        a.detected_at,
        a.status,
        a.snapshot_url,
        a.remarks,
        a.created_at
      FROM motion_detection_alerts a
      ${whereClause}
      ORDER BY a.detected_at DESC NULLS LAST, a.id DESC
      `,
      values
    );

    return res.status(200).json({
      success: true,
      message: "Motion detection alerts fetched successfully.",
      total: result.rows.length,
      alerts: result.rows,
    });
  } catch (error) {
    console.error("Get Motion Alerts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch motion detection alerts.",
    });
  }
};

// =====================================================
// GET MOTION ALERT BY ID
// GET /api/v1/security/incident-alerts/motion-alerts/:id
// =====================================================

const getMotionAlertById = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.property_id,
        a.camera_id,
        a.alert_type,
        a.severity,
        a.detected_at,
        a.status,
        a.snapshot_url,
        a.remarks,
        a.created_at
      FROM motion_detection_alerts a
      WHERE a.id = $1
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Motion alert fetched successfully.",
      alert: result.rows[0],
    });
  } catch (error) {
    console.error("Get Motion Alert By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch motion alert details.",
    });
  }
};

// =====================================================
// UPDATE MOTION ALERT STATUS
// PUT /api/v1/security/incident-alerts/motion-alerts/:id/status
// =====================================================

const updateMotionAlertStatus = async (req, res) => {
  try {
    if (!checkAccess(req, res)) return;

    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert ID.",
      });
    }

    const allowedStatuses = [
      "New",
      "Acknowledged",
      "Resolved",
      "Dismissed",
    ];

    const normalizedStatus = allowedStatuses.find(
      (item) => item.toLowerCase() === String(status || "").toLowerCase()
    );

    if (!normalizedStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}.`,
      });
    }

    const result = await pool.query(
      `
      UPDATE motion_detection_alerts
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [normalizedStatus, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Motion alert status updated successfully.",
      alert: result.rows[0],
    });
  } catch (error) {
    console.error("Update Motion Alert Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update motion alert status.",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getIntrusionNotifications,
  getIntrusionNotificationById,
  updateIntrusionNotificationStatus,
  getMotionAlerts,
  getMotionAlertById,
  updateMotionAlertStatus,
};
