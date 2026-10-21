
const pool = require("../../config/db");

// =====================================================
// LEGAL TEAM DASHBOARD
// GET /api/v1/legal-team/dashboard
// =====================================================

const getLegalTeamDashboard = async (req, res) => {
  try {
    // Fetch dashboard information from PostgreSQL.
    const [
      totalCasesResult,
      activeCasesResult,
      pendingCasesResult,
      closedCasesResult,
      rejectedCasesResult,
      upcomingAppointmentsResult,
      recentCasesResult,
    ] = await Promise.all([
      // 1. Total legal cases
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM legal_cases
      `),

      // 2. Active cases
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM legal_cases
        WHERE LOWER(TRIM(COALESCE(status, ''))) IN
          ('open', 'in progress', 'active')
      `),

      // 3. Pending cases
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM legal_cases
        WHERE LOWER(TRIM(COALESCE(status, ''))) IN
          ('pending', 'awaiting', 'under review')
      `),

      // 4. Closed or resolved cases
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM legal_cases
        WHERE LOWER(TRIM(COALESCE(status, ''))) IN
          ('closed', 'resolved', 'completed')
      `),

      // 5. Rejected cases
      pool.query(`
        SELECT COUNT(*)::int AS total
        FROM legal_cases
        WHERE LOWER(TRIM(COALESCE(status, ''))) IN
          ('rejected', 'dismissed')
      `),

      // 6. Upcoming appointments
      // Correct columns: appointment_date and appointment_time
      pool.query(`
        SELECT
          a.id,
          a.customer_name,
          a.appointment_date,
          a.appointment_time,
          a.status,
          a.purpose,
          a.service_type
        FROM appointments a
        WHERE a.appointment_date >= CURRENT_DATE
          AND LOWER(TRIM(COALESCE(a.status, ''))) NOT IN
            ('cancelled', 'canceled', 'rejected', 'completed')
        ORDER BY
          a.appointment_date ASC,
          a.appointment_time ASC
        LIMIT 5
      `),

      // 7. Five most recent legal cases
      pool.query(`
        SELECT
          lc.id,
          lc.case_number,
          lc.case_title,
          lc.status,
          lc.created_at,
          lc.court_name,
          u.full_name AS customer_name,
          p.property_name
        FROM legal_cases lc
        LEFT JOIN users u ON lc.user_id = u.id
        LEFT JOIN properties p ON lc.property_id = p.id
        ORDER BY lc.created_at DESC NULLS LAST, lc.id DESC
        LIMIT 5
      `),
    ]);

    // Return dashboard data
    return res.status(200).json({
      success: true,
      message: "Legal Team dashboard fetched successfully.",
      dashboard: {
        totalCases: totalCasesResult.rows[0].total,
        activeCases: activeCasesResult.rows[0].total,
        pendingCases: pendingCasesResult.rows[0].total,
        closedCases: closedCasesResult.rows[0].total,
        rejectedCases: rejectedCasesResult.rows[0].total,
        upcomingAppointments: upcomingAppointmentsResult.rows,
        recentCases: recentCasesResult.rows,
      },
    });
  } catch (error) {
    console.error("Legal Team Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Legal Team dashboard.",
    });
  }
};

module.exports = {
  getLegalTeamDashboard,
};
