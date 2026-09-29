const pool = require("../../config/db");

// =====================================================
// SUPER ADMIN DASHBOARD
// =====================================================
const getDashboardStats = async (req, res) => {
  try {
    // -------------------------------------------------
    // 1. Total Users
    // -------------------------------------------------
    const usersResult = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
    `);

    // -------------------------------------------------
    // 2. Total Properties
    // -------------------------------------------------
    const propertiesResult = await pool.query(`
      SELECT COUNT(*) AS total_properties
      FROM properties
    `);

    // -------------------------------------------------
    // 3. Pending Property Approvals
    // -------------------------------------------------
    const pendingApprovalsResult = await pool.query(`
      SELECT COUNT(*) AS pending_approvals
      FROM properties
      WHERE LOWER(verification_status) = 'pending'
    `);

    // -------------------------------------------------
    // 4. Total Bookings / Appointments
    // -------------------------------------------------
    const bookingsResult = await pool.query(`
      SELECT COUNT(*) AS total_bookings
      FROM appointments
    `);

    // -------------------------------------------------
    // 5. Active Staff
    // -------------------------------------------------
    const activeStaffResult = await pool.query(`
      SELECT COUNT(*) AS active_staff
      FROM users
      WHERE status = 'active'
      AND role NOT IN ('customer', 'super_admin')
    `);

    // -------------------------------------------------
    // 6. Total Revenue
    // -------------------------------------------------
    // Count only successful/completed/captured payments.
    const revenueResult = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_revenue
      FROM payments
      WHERE LOWER(payment_status) IN (
        'success',
        'successful',
        'completed',
        'captured'
      )
    `);

    // -------------------------------------------------
    // 7. Payment Statistics
    // -------------------------------------------------
    const paymentStatsResult = await pool.query(`
      SELECT
        COUNT(*) AS total_payments,
        COUNT(*) FILTER (
          WHERE LOWER(payment_status) IN (
            'success',
            'successful',
            'completed',
            'captured'
          )
        ) AS successful_payments,
        COUNT(*) FILTER (
          WHERE LOWER(payment_status) = 'pending'
        ) AS pending_payments,
        COUNT(*) FILTER (
          WHERE LOWER(payment_status) IN (
            'failed',
            'failure'
          )
        ) AS failed_payments
      FROM payments
    `);

    // -------------------------------------------------
    // 8. User Statistics
    // -------------------------------------------------
    const userStatsResult = await pool.query(`
      SELECT
        COUNT(*) AS total_users,
        COUNT(*) FILTER (
          WHERE status = 'active'
        ) AS active_users,
        COUNT(*) FILTER (
          WHERE status = 'inactive'
        ) AS inactive_users,
        COUNT(*) FILTER (
          WHERE role = 'customer'
        ) AS customers,
        COUNT(*) FILTER (
          WHERE role = 'field_executive'
        ) AS field_executives,
        COUNT(*) FILTER (
          WHERE role = 'legal'
        ) AS legal_users,
        COUNT(*) FILTER (
          WHERE role = 'security'
        ) AS security_users,
        COUNT(*) FILTER (
          WHERE role = 'admin'
        ) AS admins,
        COUNT(*) FILTER (
          WHERE role = 'super_admin'
        ) AS super_admins
      FROM users
    `);

    // -------------------------------------------------
    // 9. Property Statistics
    // -------------------------------------------------
    const propertyStatsResult = await pool.query(`
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

    // -------------------------------------------------
    // 10. Appointment Statistics
    // -------------------------------------------------
    const appointmentStatsResult = await pool.query(`
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

    // -------------------------------------------------
    // Final Response
    // -------------------------------------------------
    return res.status(200).json({
      success: true,
      message: "Super Admin dashboard data fetched successfully.",

      data: {
        overview: {
          total_users: Number(
            usersResult.rows[0].total_users
          ),

          total_properties: Number(
            propertiesResult.rows[0].total_properties
          ),

          total_revenue: Number(
            revenueResult.rows[0].total_revenue
          ),

          total_bookings: Number(
            bookingsResult.rows[0].total_bookings
          ),

          pending_approvals: Number(
            pendingApprovalsResult.rows[0].pending_approvals
          ),

          active_staff: Number(
            activeStaffResult.rows[0].active_staff
          ),
        },

        users: {
          total: Number(userStatsResult.rows[0].total_users),
          active: Number(userStatsResult.rows[0].active_users),
          inactive: Number(userStatsResult.rows[0].inactive_users),
          customers: Number(userStatsResult.rows[0].customers),
          field_executives: Number(
            userStatsResult.rows[0].field_executives
          ),
          legal: Number(userStatsResult.rows[0].legal_users),
          security: Number(userStatsResult.rows[0].security_users),
          admins: Number(userStatsResult.rows[0].admins),
          super_admins: Number(
            userStatsResult.rows[0].super_admins
          ),
        },

        properties: {
          total: Number(
            propertyStatsResult.rows[0].total_properties
          ),
          pending: Number(
            propertyStatsResult.rows[0].pending_properties
          ),
          verified: Number(
            propertyStatsResult.rows[0].verified_properties
          ),
          rejected: Number(
            propertyStatsResult.rows[0].rejected_properties
          ),
        },

        appointments: {
          total: Number(
            appointmentStatsResult.rows[0].total_appointments
          ),
          pending: Number(
            appointmentStatsResult.rows[0].pending_appointments
          ),
          confirmed: Number(
            appointmentStatsResult.rows[0].confirmed_appointments
          ),
          completed: Number(
            appointmentStatsResult.rows[0].completed_appointments
          ),
          cancelled: Number(
            appointmentStatsResult.rows[0].cancelled_appointments
          ),
        },

        payments: {
          total: Number(
            paymentStatsResult.rows[0].total_payments
          ),
          successful: Number(
            paymentStatsResult.rows[0].successful_payments
          ),
          pending: Number(
            paymentStatsResult.rows[0].pending_payments
          ),
          failed: Number(
            paymentStatsResult.rows[0].failed_payments
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Super Admin dashboard data.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};