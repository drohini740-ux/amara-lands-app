const pool = require("../../config/db");

// =====================================================
// SECURITY REPORTS
// =====================================================

// GET ALL SECURITY REPORTS
const getAllSecurityReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sr.id,
        sr.property_id,
        sr.user_id,
        sr.report_type,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.report_status,
        sr.created_at,
        sr.assigned_to,

        p.property_name,
        p.survey_number,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM security_reports sr

      LEFT JOIN properties p
        ON sr.property_id = p.id

      LEFT JOIN users u
        ON sr.user_id = u.id

      ORDER BY sr.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Security reports fetched successfully.",
      reports: result.rows,
    });
  } catch (error) {
    console.error("Get Security Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch security reports.",
      error: error.message,
    });
  }
};

// GET SECURITY REPORT BY ID
const getSecurityReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        sr.id,
        sr.property_id,
        sr.user_id,
        sr.report_type,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.report_status,
        sr.created_at,
        sr.assigned_to,

        p.property_name,
        p.survey_number,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM security_reports sr

      LEFT JOIN properties p
        ON sr.property_id = p.id

      LEFT JOIN users u
        ON sr.user_id = u.id

      WHERE sr.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security report fetched successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Get Security Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch security report.",
      error: error.message,
    });
  }
};

// UPDATE SECURITY REPORT STATUS
const updateSecurityReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { report_status } = req.body;

    if (!report_status) {
      return res.status(400).json({
        success: false,
        message: "Report status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE security_reports
      SET report_status = $1
      WHERE id = $2
      RETURNING
        id,
        report_type,
        report_status
      `,
      [report_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security report not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security report status updated successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Security Report Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update security report status.",
      error: error.message,
    });
  }
};

// =====================================================
// SURVEILLANCE CAMERAS
// =====================================================

// GET ALL SURVEILLANCE CAMERAS
const getAllSurveillanceCameras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sc.id,
        sc.property_id,
        sc.user_id,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status,
        sc.installation_date,
        sc.remarks,
        sc.created_at,

        p.property_name,
        p.survey_number,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM surveillance_cameras sc

      LEFT JOIN properties p
        ON sc.property_id = p.id

      LEFT JOIN users u
        ON sc.user_id = u.id

      ORDER BY sc.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Surveillance cameras fetched successfully.",
      cameras: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Surveillance Cameras Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch surveillance cameras.",
      error: error.message,
    });
  }
};

// UPDATE CAMERA STATUS
const updateCameraStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Camera status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE surveillance_cameras
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        camera_name,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surveillance camera not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Camera status updated successfully.",
      camera: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Camera Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update camera status.",
      error: error.message,
    });
  }
};

// =====================================================
// PATROL LOGS
// =====================================================

// GET ALL PATROL LOGS
const getAllPatrolLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pl.id,
        pl.property_id,
        pl.user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

        p.property_name,
        p.survey_number,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM patrol_logs pl

      LEFT JOIN properties p
        ON pl.property_id = p.id

      LEFT JOIN users u
        ON pl.user_id = u.id

      ORDER BY pl.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Patrol logs fetched successfully.",
      patrols: result.rows,
    });
  } catch (error) {
    console.error("Get Patrol Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patrol logs.",
      error: error.message,
    });
  }
};

// UPDATE PATROL STATUS
const updatePatrolStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { patrol_status } = req.body;

    if (!patrol_status) {
      return res.status(400).json({
        success: false,
        message: "Patrol status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE patrol_logs
      SET patrol_status = $1
      WHERE id = $2
      RETURNING
        id,
        patrol_date,
        patrol_status
      `,
      [patrol_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patrol status updated successfully.",
      patrol: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Patrol Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update patrol status.",
      error: error.message,
    });
  }
};

// =====================================================
// INTRUSION NOTIFICATIONS
// =====================================================

// GET ALL INTRUSION NOTIFICATIONS
const getAllIntrusionNotifications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        i.id,
        i.property_id,
        i.camera_id,
        i.notification_type,
        i.severity,
        i.message,
        i.status,
        i.snapshot_url,
        i.detected_at,
        i.created_at,

        p.property_name,
        p.survey_number,

        sc.camera_name,
        sc.camera_location,
        sc.camera_type

      FROM intrusion_notifications i

      LEFT JOIN properties p
        ON i.property_id = p.id

      LEFT JOIN surveillance_cameras sc
        ON i.camera_id = sc.id

      ORDER BY i.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Intrusion notifications fetched successfully.",
      notifications: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Intrusion Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch intrusion notifications.",
      error: error.message,
    });
  }
};

// UPDATE INTRUSION NOTIFICATION STATUS
const updateIntrusionNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Notification status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE intrusion_notifications
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        notification_type,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Intrusion notification status updated successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Intrusion Notification Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update intrusion notification status.",
      error: error.message,
    });
  }
};

// =====================================================
// MOTION DETECTION ALERTS
// =====================================================

// GET ALL MOTION DETECTION ALERTS
const getAllMotionDetectionAlerts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.property_id,
        m.camera_id,
        m.alert_type,
        m.severity,
        m.detected_at,
        m.status,
        m.snapshot_url,
        m.remarks,
        m.created_at,

        p.property_name,
        p.survey_number,

        sc.camera_name,
        sc.camera_location,
        sc.camera_type

      FROM motion_detection_alerts m

      LEFT JOIN properties p
        ON m.property_id = p.id

      LEFT JOIN surveillance_cameras sc
        ON m.camera_id = sc.id

      ORDER BY m.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Motion detection alerts fetched successfully.",
      alerts: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Motion Detection Alerts Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch motion detection alerts.",
      error: error.message,
    });
  }
};

// UPDATE MOTION DETECTION ALERT STATUS
const updateMotionDetectionAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Alert status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE motion_detection_alerts
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        alert_type,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion detection alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Motion detection alert status updated successfully.",
      alert: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Motion Detection Alert Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update motion detection alert status.",
      error: error.message,
    });
  }
};

// =====================================================
// STAFF ASSIGNMENTS
// =====================================================

// GET ALL STAFF ASSIGNMENTS
const getAllStaffAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sa.id,
        sa.staff_id,
        sa.property_id,
        sa.assignment_type,
        sa.assignment_date,
        sa.status,
        sa.notes,
        sa.assigned_by,
        sa.created_at,
        sa.updated_at,

        p.property_name,
        p.survey_number,

        u.full_name AS staff_name,
        u.mobile AS staff_mobile,
        u.email AS staff_email

      FROM staff_assignments sa

      LEFT JOIN properties p
        ON sa.property_id = p.id

      LEFT JOIN users u
        ON sa.staff_id = u.id

      ORDER BY sa.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Staff assignments fetched successfully.",
      assignments: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Staff Assignments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff assignments.",
      error: error.message,
    });
  }
};

// UPDATE STAFF ASSIGNMENT STATUS
const updateStaffAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Assignment status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE staff_assignments
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        staff_id,
        property_id,
        assignment_type,
        status,
        updated_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Staff assignment status updated successfully.",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Staff Assignment Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update staff assignment status.",
      error: error.message,
    });
  }
};

// =====================================================
// VISIT LOGS
// =====================================================

// GET ALL VISIT LOGS
const getAllVisitLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        vl.id,
        vl.property_id,
        vl.executive_id,
        vl.check_in,
        vl.check_out,
        vl.latitude,
        vl.longitude,

        p.property_name,
        p.survey_number,

        u.full_name AS executive_name,
        u.mobile AS executive_mobile,
        u.email AS executive_email

      FROM visit_logs vl

      LEFT JOIN properties p
        ON vl.property_id = p.id

      LEFT JOIN users u
        ON vl.executive_id = u.id

      ORDER BY vl.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Visit logs fetched successfully.",
      visits: result.rows,
    });
  } catch (error) {
    console.error("Get Visit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch visit logs.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
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
};