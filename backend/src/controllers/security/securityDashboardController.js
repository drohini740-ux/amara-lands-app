
const pool = require("../../config/db");

// =====================================================
// SECURITY DASHBOARD
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // ===================================================
    // TOTAL ASSIGNED PROPERTIES
    // ===================================================

    const assignedPropertiesResult = await pool.query(
      `
      SELECT COUNT(DISTINCT property_id) AS total
      FROM staff_assignments
      WHERE staff_id = $1
      `,
      [userId]
    );

    // ===================================================
    // TOTAL SECURITY REPORTS
    // ===================================================

    const securityReportsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM security_reports
      WHERE assigned_to = $1
      `,
      [userId]
    );

    // ===================================================
    // TOTAL PATROLS
    // ===================================================

    const patrolsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM patrol_logs
      WHERE user_id = $1
      `,
      [userId]
    );

    // ===================================================
    // COMPLETED PATROLS
    // ===================================================

    const completedPatrolsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM patrol_logs
      WHERE user_id = $1
        AND LOWER(patrol_status) = 'completed'
      `,
      [userId]
    );

    // ===================================================
    // TOTAL INCIDENTS
    // ===================================================
    // intrusion_notifications does not have user_id.
    // We connect it through surveillance_cameras.user_id.

    const incidentsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM intrusion_notifications i

      INNER JOIN surveillance_cameras c
        ON c.id = i.camera_id

      WHERE c.user_id = $1
      `,
      [userId]
    );

    // ===================================================
    // ACTIVE INCIDENTS
    // ===================================================

    const activeIncidentsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM intrusion_notifications i

      INNER JOIN surveillance_cameras c
        ON c.id = i.camera_id

      WHERE c.user_id = $1
        AND LOWER(i.status) IN (
          'new',
          'pending',
          'active',
          'unresolved'
        )
      `,
      [userId]
    );

    // ===================================================
    // TOTAL MOTION ALERTS
    // ===================================================

    const motionAlertsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM motion_detection_alerts m

      INNER JOIN surveillance_cameras c
        ON c.id = m.camera_id

      WHERE c.user_id = $1
      `,
      [userId]
    );

    // ===================================================
    // ACTIVE CAMERAS
    // ===================================================

    const camerasResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM surveillance_cameras
      WHERE user_id = $1
        AND LOWER(status) = 'active'
      `,
      [userId]
    );

    // ===================================================
    // RECENT SECURITY REPORTS
    // ===================================================

    const recentReportsResult = await pool.query(
      `
      SELECT
        sr.id,
        sr.property_id,
        sr.report_type,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.report_status,
        sr.created_at,

        p.property_name,
        p.survey_number,
        p.city,
        p.state

      FROM security_reports sr

      LEFT JOIN properties p
        ON p.id = sr.property_id

      WHERE sr.assigned_to = $1

      ORDER BY sr.created_at DESC

      LIMIT 5
      `,
      [userId]
    );

    // ===================================================
    // RECENT PATROLS
    // ===================================================

    const recentPatrolsResult = await pool.query(
      `
      SELECT
        pl.id,
        pl.property_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

        p.property_name,
        p.survey_number,
        p.city,
        p.state

      FROM patrol_logs pl

      LEFT JOIN properties p
        ON p.id = pl.property_id

      WHERE pl.user_id = $1

      ORDER BY pl.created_at DESC

      LIMIT 5
      `,
      [userId]
    );

    // ===================================================
    // ASSIGNED PROPERTIES
    // ===================================================

    const assignedPropertiesListResult =
      await pool.query(
        `
        SELECT
          sa.id AS assignment_id,
          sa.property_id,
          sa.assignment_type,
          sa.assignment_date,
          sa.status AS assignment_status,

          p.property_name,
          p.survey_number,
          p.property_type,
          p.address,
          p.city,
          p.state,
          p.pincode,
          p.verification_status

        FROM staff_assignments sa

        LEFT JOIN properties p
          ON p.id = sa.property_id

        WHERE sa.staff_id = $1

        ORDER BY sa.created_at DESC

        LIMIT 5
        `,
        [userId]
      );

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      message:
        "Security dashboard data fetched successfully.",

      data: {
        overview: {
          total_assigned_properties:
            Number(
              assignedPropertiesResult.rows[0].total
            ),

          total_security_reports:
            Number(
              securityReportsResult.rows[0].total
            ),

          total_patrols:
            Number(
              patrolsResult.rows[0].total
            ),

          completed_patrols:
            Number(
              completedPatrolsResult.rows[0].total
            ),

          total_incidents:
            Number(
              incidentsResult.rows[0].total
            ),

          active_incidents:
            Number(
              activeIncidentsResult.rows[0].total
            ),

          total_motion_alerts:
            Number(
              motionAlertsResult.rows[0].total
            ),

          active_cameras:
            Number(
              camerasResult.rows[0].total
            ),
        },

        recent_reports:
          recentReportsResult.rows,

        recent_patrols:
          recentPatrolsResult.rows,

        assigned_properties:
          assignedPropertiesListResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Security Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch Security dashboard data.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};

