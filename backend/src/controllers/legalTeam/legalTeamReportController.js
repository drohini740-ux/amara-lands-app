
const pool = require("../../config/db");

// =====================================================
// LEGAL TEAM REPORTS & ANALYTICS
// =====================================================

const getLegalReports = async (req, res) => {
  try {
    // ===================================================
    // CASE SUMMARY
    // ===================================================

    const caseSummaryResult = await pool.query(`
      SELECT
        COUNT(*)::INTEGER AS total_cases,

        COUNT(*) FILTER (
          WHERE LOWER(status) IN (
            'open',
            'in progress',
            'pending'
          )
        )::INTEGER AS active_cases,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'pending'
        )::INTEGER AS pending_cases,

        COUNT(*) FILTER (
          WHERE LOWER(status) IN (
            'closed',
            'completed',
            'resolved'
          )
        )::INTEGER AS closed_cases

      FROM legal_cases
    `);

    // ===================================================
    // CASE STATUS BREAKDOWN
    // ===================================================

    const caseStatusResult = await pool.query(`
      SELECT
        COALESCE(status, 'Unknown') AS status,
        COUNT(*)::INTEGER AS count
      FROM legal_cases
      GROUP BY status
      ORDER BY count DESC
    `);

    // ===================================================
    // CASES BY MONTH
    // ===================================================

    const casesByMonthResult = await pool.query(`
      SELECT
        TO_CHAR(
          DATE_TRUNC('month', created_at),
          'Mon YYYY'
        ) AS month,

        COUNT(*)::INTEGER AS count

      FROM legal_cases

      GROUP BY DATE_TRUNC('month', created_at)

      ORDER BY DATE_TRUNC('month', created_at)
    `);

    // ===================================================
    // CONSULTATION SUMMARY
    // ===================================================

    const consultationSummaryResult = await pool.query(`
      SELECT
        COUNT(*)::INTEGER AS total_consultations,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'pending'
        )::INTEGER AS pending_consultations,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'confirmed'
        )::INTEGER AS confirmed_consultations,

        COUNT(*) FILTER (
          WHERE LOWER(status) IN (
            'completed',
            'closed'
          )
        )::INTEGER AS completed_consultations,

        COUNT(*) FILTER (
          WHERE LOWER(status) IN (
            'cancelled',
            'canceled'
          )
        )::INTEGER AS cancelled_consultations

      FROM legal_consultations
    `);

    // ===================================================
    // CONSULTATIONS BY MEETING TYPE
    // ===================================================

    const consultationTypeResult = await pool.query(`
      SELECT
        COALESCE(meeting_type, 'Unknown') AS meeting_type,
        COUNT(*)::INTEGER AS count

      FROM legal_consultations

      GROUP BY meeting_type

      ORDER BY count DESC
    `);

    // ===================================================
    // CASES BY COURT
    // ===================================================

    const courtResult = await pool.query(`
      SELECT
        COALESCE(court_name, 'Not Assigned') AS court_name,
        COUNT(*)::INTEGER AS count

      FROM legal_cases

      GROUP BY court_name

      ORDER BY count DESC
    `);

    // ===================================================
    // RESPONSE
    // ===================================================

    return res.status(200).json({
      success: true,

      message:
        "Legal Team reports fetched successfully.",

      data: {
        case_summary:
          caseSummaryResult.rows[0],

        case_status:
          caseStatusResult.rows,

        cases_by_month:
          casesByMonthResult.rows,

        consultation_summary:
          consultationSummaryResult.rows[0],

        consultation_types:
          consultationTypeResult.rows,

        cases_by_court:
          courtResult.rows,
      },
    });
  } catch (error) {
    console.error(
      "Legal Team Reports Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch Legal Team reports.",
      error: error.message,
    });
  }
};

module.exports = {
  getLegalReports,
};

