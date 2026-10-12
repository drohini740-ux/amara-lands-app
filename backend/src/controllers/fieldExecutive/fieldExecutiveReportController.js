const pool = require("../../config/db");

// =====================================================
// FIELD EXECUTIVE REPORTS & ANALYTICS
// =====================================================

const getFieldExecutiveReports = async (req, res) => {
  try {
    const userId = req.user.id;

    // ===================================================
    // OVERVIEW
    // ===================================================

    const overviewResult = await pool.query(
      `
      SELECT
        (
          SELECT COUNT(DISTINCT property_id)
          FROM staff_assignments
          WHERE staff_id = $1
        ) AS total_assigned_properties,

        (
          SELECT COUNT(*)
          FROM field_visits
          WHERE user_id = $1
        ) AS total_visits,

        (
          SELECT COUNT(*)
          FROM field_visits
          WHERE user_id = $1
            AND LOWER(visit_status) = 'completed'
        ) AS completed_visits,

        (
          SELECT COUNT(*)
          FROM field_visits
          WHERE user_id = $1
            AND LOWER(visit_status) = 'pending'
        ) AS pending_visits,

        (
          SELECT COUNT(*)
FROM security_reports
WHERE assigned_to = $1
        ) AS total_security_reports
      `,
      [userId],
    );

    // ===================================================
    // VISIT STATUS BREAKDOWN
    // ===================================================

    const visitStatusResult = await pool.query(
      `
      SELECT
        COALESCE(visit_status, 'Unknown') AS status,
        COUNT(*) AS total
      FROM field_visits
      WHERE user_id = $1
      GROUP BY visit_status
      ORDER BY total DESC
      `,
      [userId],
    );

    // ===================================================
    // MONTHLY VISITS
    // ===================================================

    const monthlyVisitsResult = await pool.query(
      `
      SELECT
        TO_CHAR(visit_date, 'YYYY-MM') AS month,
        COUNT(*) AS total,
        COUNT(*) FILTER (
          WHERE LOWER(visit_status) = 'completed'
        ) AS completed,
        COUNT(*) FILTER (
          WHERE LOWER(visit_status) = 'pending'
        ) AS pending
      FROM field_visits
      WHERE user_id = $1
      GROUP BY TO_CHAR(visit_date, 'YYYY-MM')
      ORDER BY month ASC
      LIMIT 12
      `,
      [userId],
    );

    // ===================================================
    // SECURITY REPORT STATUS
    // ===================================================

    const securityReportStatusResult = await pool.query(
      ` SELECT COALESCE(report_status, 'Unknown') AS status, 
      COUNT(*) AS total
       FROM security_reports
        WHERE assigned_to = $1 
        GROUP BY report_status
         ORDER BY total DESC `,
      [userId],
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

      ORDER BY fv.created_at DESC

      LIMIT 10
      `,
      [userId],
    );

    // ===================================================
    // ASSIGNED PROPERTIES
    // ===================================================

    const assignedPropertiesResult = await pool.query(
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
        p.city,
        p.state,
        p.verification_status

      FROM staff_assignments sa

      LEFT JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1

      ORDER BY sa.created_at DESC

      LIMIT 10
      `,
      [userId],
    );

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,
      message: "Field Executive reports fetched successfully.",

      data: {
        overview: {
          total_assigned_properties: Number(
            overviewResult.rows[0].total_assigned_properties,
          ),

          total_visits: Number(overviewResult.rows[0].total_visits),

          completed_visits: Number(overviewResult.rows[0].completed_visits),

          pending_visits: Number(overviewResult.rows[0].pending_visits),

          total_security_reports: Number(
            overviewResult.rows[0].total_security_reports,
          ),
        },

        visit_status_breakdown: visitStatusResult.rows.map((row) => ({
          status: row.status,
          total: Number(row.total),
        })),

        monthly_visits: monthlyVisitsResult.rows.map((row) => ({
          month: row.month,
          total: Number(row.total),
          completed: Number(row.completed),
          pending: Number(row.pending),
        })),

        security_report_status: securityReportStatusResult.rows.map((row) => ({
          status: row.status,
          total: Number(row.total),
        })),

        recent_visits: recentVisitsResult.rows,

        assigned_properties: assignedPropertiesResult.rows,
      },
    });
  } catch (error) {
    console.error("Field Executive Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Field Executive reports.",
      error: error.message,
    });
  }
};

module.exports = {
  getFieldExecutiveReports,
};
