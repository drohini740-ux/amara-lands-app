const pool = require("../../config/db");

const getSecurityMonitoringDashboard = async (req, res) => {
  try {
    const [
      camerasResult,
      alertsResult,
      highSeverityAlertsResult,
      intrusionsResult,
      patrolsResult,
      reportsResult,
      recentIncidentsResult,
    ] = await Promise.all([
      // Active cameras
      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM surveillance_cameras
        WHERE LOWER(status) = 'active'
      `),

      // New motion detection alerts
      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM motion_detection_alerts
        WHERE LOWER(status) = 'new'
      `),

      // High severity alerts from both security tables
      pool.query(`
        SELECT
          (
            SELECT COUNT(*)
            FROM motion_detection_alerts
            WHERE LOWER(severity) = 'high'
          )
          +
          (
            SELECT COUNT(*)
            FROM intrusion_notifications
            WHERE LOWER(severity) = 'high'
          ) AS count
      `),

      // Intrusion notifications
      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM intrusion_notifications
      `),

      // Patrol logs
      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM patrol_logs
      `),

      // Security reports
      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM security_reports
      `),

      // Recent incidents from motion detection + intrusion notifications
      pool.query(`
        SELECT *
        FROM (
          SELECT
            m.id,
            'Motion Detection' AS incident_source,
            m.alert_type AS incident_type,
            m.severity,
            m.status,
            m.detected_at,
            m.snapshot_url,
            p.property_name,
            s.camera_name,
            s.camera_location
          FROM motion_detection_alerts m
          LEFT JOIN properties p
            ON p.id = m.property_id
          LEFT JOIN surveillance_cameras s
            ON s.id = m.camera_id

          UNION ALL

          SELECT
            i.id,
            'Intrusion Notification' AS incident_source,
            i.notification_type AS incident_type,
            i.severity,
            i.status,
            i.detected_at,
            i.snapshot_url,
            p.property_name,
            s.camera_name,
            s.camera_location
          FROM intrusion_notifications i
          LEFT JOIN properties p
            ON p.id = i.property_id
          LEFT JOIN surveillance_cameras s
            ON s.id = i.camera_id
        ) incidents
        ORDER BY detected_at DESC
        LIMIT 10
      `),
    ]);

    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "Security Monitoring Dashboard Loaded Successfully",

      dashboard: {
        activeCameras: camerasResult.rows[0].count,
        newAlerts: alertsResult.rows[0].count,
        highSeverity: Number(highSeverityAlertsResult.rows[0].count),
        intrusions: intrusionsResult.rows[0].count,
        patrols: patrolsResult.rows[0].count,
        securityReports: reportsResult.rows[0].count,

        recentIncidents: recentIncidentsResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Security Monitoring Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load Security Monitoring Dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getSecurityMonitoringDashboard,
};