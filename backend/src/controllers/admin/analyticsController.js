const pool = require("../../config/db");

// ==========================================
// GET ADMIN ANALYTICS
// ==========================================

const getAnalytics = async (req, res) => {
  try {
    const { filter = "month" } = req.query;

    let dateCondition = "";

    switch (filter) {
      case "today":
        dateCondition = "CURRENT_DATE";
        break;

      case "week":
        dateCondition = "CURRENT_DATE - INTERVAL '7 days'";
        break;

      case "year":
        dateCondition = "CURRENT_DATE - INTERVAL '1 year'";
        break;

      case "month":
      default:
        dateCondition = "CURRENT_DATE - INTERVAL '1 month'";
        break;
    }

    // ==========================================
    // USER ANALYTICS
    // ==========================================

    const usersResult = await pool.query(`
      SELECT
        COUNT(*) AS total_users,
        COUNT(*) FILTER (
          WHERE created_at >= ${dateCondition}
        ) AS new_users,
        COUNT(*) FILTER (
          WHERE status = 'active'
        ) AS active_users,
        COUNT(*) FILTER (
          WHERE role IN (
            'admin',
            'legal',
            'security',
            'field_executive'
          )
        ) AS staff_users
      FROM users
    `);

    // ==========================================
    // PROPERTY ANALYTICS
    // ==========================================

    const propertiesResult = await pool.query(`
      SELECT
        COUNT(*) AS total_properties,

        COUNT(*) FILTER (
          WHERE verification_status = 'Verified'
        ) AS verified_properties,

        COUNT(*) FILTER (
          WHERE verification_status = 'Pending'
        ) AS pending_properties,

        COUNT(*) FILTER (
          WHERE verification_status = 'Rejected'
        ) AS rejected_properties

      FROM properties
    `);

    // ==========================================
    // PAYMENT ANALYTICS
    // ==========================================

    const paymentsResult = await pool.query(`
      SELECT

        COUNT(*) AS total_payments,

        COALESCE(
          SUM(amount) FILTER (
            WHERE payment_status = 'Success'
          ),
          0
        ) AS total_revenue,

        COUNT(*) FILTER (
          WHERE payment_status = 'Success'
        ) AS successful_payments,

        COUNT(*) FILTER (
          WHERE payment_status = 'Pending'
        ) AS pending_payments,

        COUNT(*) FILTER (
          WHERE payment_status = 'Failed'
        ) AS failed_payments

      FROM payments

      WHERE created_at >= ${dateCondition}
    `);

    // ==========================================
    // SECURITY ANALYTICS
    // ==========================================

    const securityResult = await pool.query(`
      SELECT
        COUNT(*) AS security_reports,

        COUNT(*) FILTER (
          WHERE report_status IN (
            'Resolved',
            'Closed'
          )
        ) AS resolved_security_reports

      FROM security_reports

      WHERE created_at >= ${dateCondition}
    `);

    // ==========================================
    // APPOINTMENT ANALYTICS
    // ==========================================

    const appointmentResult = await pool.query(`
      SELECT
        COUNT(*) AS appointments,

        COUNT(*) FILTER (
          WHERE appointment_date >= CURRENT_DATE
        ) AS upcoming_appointments

      FROM appointments

      WHERE created_at >= ${dateCondition}
    `);

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      filter,

      analytics: {
        users: usersResult.rows[0],

        properties: propertiesResult.rows[0],

        payments: paymentsResult.rows[0],

        security: securityResult.rows[0],

        appointments: appointmentResult.rows[0],
      },
    });

  } catch (error) {

    console.error("Admin Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load analytics",
      error: error.message,
    });

  }
};

module.exports = {
  getAnalytics,
};