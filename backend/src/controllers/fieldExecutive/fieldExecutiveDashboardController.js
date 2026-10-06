
const pool = require("../../config/db");

// =====================================================
// FIELD EXECUTIVE DASHBOARD
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
    // TOTAL VISITS
    // ===================================================

    const totalVisitsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM field_visits
      WHERE user_id = $1
      `,
      [userId]
    );

    // ===================================================
    // COMPLETED VISITS
    // ===================================================

    const completedVisitsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM field_visits
      WHERE user_id = $1
        AND LOWER(visit_status) = 'completed'
      `,
      [userId]
    );

    // ===================================================
    // PENDING VISITS
    // ===================================================

    const pendingVisitsResult = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM field_visits
      WHERE user_id = $1
        AND LOWER(visit_status) = 'pending'
      `,
      [userId]
    );

    // ===================================================
    // SECURITY REPORTS
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
    // UPCOMING VISITS
    // ===================================================

    const upcomingVisitsResult = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.visit_date,
        fv.check_in,
        fv.check_out,
        fv.visit_status,
        fv.remarks,

        p.property_name,
        p.survey_number,
        p.address,
        p.city,
        p.state

      FROM field_visits fv

      LEFT JOIN properties p
        ON p.id = fv.property_id

      WHERE fv.user_id = $1
        AND fv.visit_date >= CURRENT_DATE

      ORDER BY
        fv.visit_date ASC,
        fv.check_in ASC

      LIMIT 5
      `,
      [userId]
    );

    // ===================================================
    // RECENT VISITS
    // ===================================================

    const recentVisitsResult = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.visit_date,
        fv.check_in,
        fv.check_out,
        fv.visit_status,
        fv.remarks,

        p.property_name,
        p.survey_number,
        p.city,
        p.state

      FROM field_visits fv

      LEFT JOIN properties p
        ON p.id = fv.property_id

      WHERE fv.user_id = $1

      ORDER BY
        fv.created_at DESC

      LIMIT 5
      `,
      [userId]
    );

    // ===================================================
    // ASSIGNED PROPERTIES
    // ===================================================

    const assignedPropertiesListResult = await pool.query(
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

      ORDER BY
        sa.created_at DESC

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
        "Field Executive dashboard data fetched successfully.",

      data: {
        overview: {
          total_assigned_properties: Number(
            assignedPropertiesResult.rows[0].total
          ),

          total_visits: Number(
            totalVisitsResult.rows[0].total
          ),

          completed_visits: Number(
            completedVisitsResult.rows[0].total
          ),

          pending_visits: Number(
            pendingVisitsResult.rows[0].total
          ),

          total_security_reports: Number(
            securityReportsResult.rows[0].total
          ),
        },

        upcoming_visits:
          upcomingVisitsResult.rows,

        recent_visits:
          recentVisitsResult.rows,

        assigned_properties:
          assignedPropertiesListResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Field Executive Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch Field Executive dashboard data.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};

