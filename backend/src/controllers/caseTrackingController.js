const pool = require("../config/db");

// Get Logged-in User Case Tracking
const getCaseTracking = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          id,
          case_title,
          case_number,
          court_name,
          advocate_name,
          hearing_date,
          status,
          remarks
       FROM legal_cases
       WHERE user_id=$1
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      cases: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getCaseTracking,
};