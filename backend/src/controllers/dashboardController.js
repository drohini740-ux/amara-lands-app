const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Property Summary
    const totalProperties = await pool.query(
      "SELECT COUNT(*) FROM properties WHERE user_id = $1",
      [userId]
    );

    const pendingProperties = await pool.query(
      "SELECT COUNT(*) FROM properties WHERE user_id = $1 AND verification_status = 'Pending'",
      [userId]
    );

    const approvedProperties = await pool.query(
      "SELECT COUNT(*) FROM properties WHERE user_id = $1 AND verification_status = 'Approved'",
      [userId]
    );

    // Payment Summary
    const totalPayments = await pool.query(
  `SELECT COALESCE(SUM(amount),0) AS total
   FROM payments
   WHERE user_id = $1`,
  [userId]
);
const completedPayments = await pool.query(
  `SELECT COALESCE(SUM(amount),0) AS total
   FROM payments
   WHERE user_id = $1
   AND payment_status = 'Success'`,
  [userId]
);

   const pendingPayments = await pool.query(
  `SELECT COALESCE(SUM(amount),0) AS total
   FROM payments
   WHERE user_id = $1
   AND payment_status = 'Pending'`,
  [userId]
);

    // Recent Properties
    const recentProperties = await pool.query(
      `SELECT
          id,
          property_name,
          city,
          state,
          verification_status
       FROM properties
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    res.json({
      success: true,
      dashboard: {
        totalProperties: Number(totalProperties.rows[0].count),
        pendingProperties: Number(pendingProperties.rows[0].count),
        approvedProperties: Number(approvedProperties.rows[0].count),

        totalPayments: Number(totalPayments.rows[0].total),
        completedPayments: Number(completedPayments.rows[0].total),
        pendingPayments: Number(pendingPayments.rows[0].total),

        recentProperties: recentProperties.rows,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboard,
};