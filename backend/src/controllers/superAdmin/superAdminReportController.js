const pool = require("../../config/db");

// =====================================================
// GET SUPER ADMIN REPORTS & ANALYTICS
// =====================================================

const getReports = async (req, res) => {
  try {
    // =================================================
    // USERS
    // =================================================

    const usersResult = await pool.query(`
      SELECT
        COUNT(*) AS total_users,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'active'
        ) AS active_users,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'inactive'
        ) AS inactive_users
      FROM users
    `);

    // =================================================
    // USERS BY ROLE
    // =================================================

    const usersByRoleResult = await pool.query(`
      SELECT
        role,
        COUNT(*) AS total
      FROM users
      GROUP BY role
      ORDER BY total DESC
    `);

    // =================================================
    // PROPERTIES
    // =================================================

    const propertiesResult = await pool.query(`
      SELECT
        COUNT(*) AS total_properties,

        COUNT(*) FILTER (
          WHERE LOWER(verification_status) = 'pending'
        ) AS pending_properties,

        COUNT(*) FILTER (
          WHERE LOWER(verification_status) = 'verified'
        ) AS verified_properties,

        COUNT(*) FILTER (
          WHERE LOWER(verification_status) = 'rejected'
        ) AS rejected_properties
      FROM properties
    `);

    // =================================================
    // APPOINTMENTS
    // =================================================

    const appointmentsResult = await pool.query(`
      SELECT
        COUNT(*) AS total_appointments,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'pending'
        ) AS pending_appointments,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'confirmed'
        ) AS confirmed_appointments,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'completed'
        ) AS completed_appointments,

        COUNT(*) FILTER (
          WHERE LOWER(status) = 'cancelled'
        ) AS cancelled_appointments
      FROM appointments
    `);

    // =================================================
    // PAYMENTS
    // =================================================

    const paymentsResult = await pool.query(`
      SELECT
        COUNT(*) AS total_payments,
        COALESCE(SUM(amount), 0) AS total_amount
      FROM payments
    `);

    // =================================================
    // PAYMENTS BY STATUS
    // =================================================

    const paymentsByStatusResult = await pool.query(`
      SELECT
        payment_status,
        COUNT(*) AS total,
        COALESCE(SUM(amount), 0) AS amount
      FROM payments
      GROUP BY payment_status
      ORDER BY total DESC
    `);

    // =================================================
    // LEGAL
    // =================================================

    const legalResult = await pool.query(`
      SELECT
        COUNT(*) AS total_legal_cases
      FROM legal_cases
    `);

    // =================================================
    // SECURITY
    // =================================================

    const securityResult = await pool.query(`
      SELECT
        COUNT(*) AS total_security_reports
      FROM security_reports
    `);

    // =================================================
    // STAFF ASSIGNMENTS
    // =================================================

    const assignmentsResult = await pool.query(`
      SELECT
        COUNT(*) AS total_assignments
      FROM staff_assignments
    `);

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Super Admin reports fetched successfully.",

      data: {
        overview: {
          total_users:
            Number(
              usersResult.rows[0].total_users
            ),

          active_users:
            Number(
              usersResult.rows[0].active_users
            ),

          inactive_users:
            Number(
              usersResult.rows[0].inactive_users
            ),

          total_properties:
            Number(
              propertiesResult.rows[0]
                .total_properties
            ),

          pending_properties:
            Number(
              propertiesResult.rows[0]
                .pending_properties
            ),

          verified_properties:
            Number(
              propertiesResult.rows[0]
                .verified_properties
            ),

          rejected_properties:
            Number(
              propertiesResult.rows[0]
                .rejected_properties
            ),

          total_appointments:
            Number(
              appointmentsResult.rows[0]
                .total_appointments
            ),

          total_payments:
            Number(
              paymentsResult.rows[0]
                .total_payments
            ),

          total_payment_amount:
            Number(
              paymentsResult.rows[0]
                .total_amount
            ),

          total_legal_cases:
            Number(
              legalResult.rows[0]
                .total_legal_cases
            ),

          total_security_reports:
            Number(
              securityResult.rows[0]
                .total_security_reports
            ),

          total_assignments:
            Number(
              assignmentsResult.rows[0]
                .total_assignments
            ),
        },

        users: {
          by_role:
            usersByRoleResult.rows.map(
              (row) => ({
                role: row.role,
                total: Number(row.total),
              })
            ),
        },

        properties: {
          total:
            Number(
              propertiesResult.rows[0]
                .total_properties
            ),

          pending:
            Number(
              propertiesResult.rows[0]
                .pending_properties
            ),

          verified:
            Number(
              propertiesResult.rows[0]
                .verified_properties
            ),

          rejected:
            Number(
              propertiesResult.rows[0]
                .rejected_properties
            ),
        },

        appointments: {
          total:
            Number(
              appointmentsResult.rows[0]
                .total_appointments
            ),

          pending:
            Number(
              appointmentsResult.rows[0]
                .pending_appointments
            ),

          confirmed:
            Number(
              appointmentsResult.rows[0]
                .confirmed_appointments
            ),

          completed:
            Number(
              appointmentsResult.rows[0]
                .completed_appointments
            ),

          cancelled:
            Number(
              appointmentsResult.rows[0]
                .cancelled_appointments
            ),
        },

        payments: {
          total:
            Number(
              paymentsResult.rows[0]
                .total_payments
            ),

          total_amount:
            Number(
              paymentsResult.rows[0]
                .total_amount
            ),

          by_status:
            paymentsByStatusResult.rows.map(
              (row) => ({
                payment_status:
                  row.payment_status,

                total:
                  Number(row.total),

                amount:
                  Number(row.amount),
              })
            ),
        },

        legal: {
          total_cases:
            Number(
              legalResult.rows[0]
                .total_legal_cases
            ),
        },

        security: {
          total_reports:
            Number(
              securityResult.rows[0]
                .total_security_reports
            ),
        },

        staff: {
          total_assignments:
            Number(
              assignmentsResult.rows[0]
                .total_assignments
            ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Super Admin Reports Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch Super Admin reports.",
      error: error.message,
    });
  }
};

module.exports = {
  getReports,
};