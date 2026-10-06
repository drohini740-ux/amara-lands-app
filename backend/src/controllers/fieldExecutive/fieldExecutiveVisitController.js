
const pool = require("../../config/db");

// =====================================================
// GET MY VISITS
// =====================================================

const getMyVisits = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.user_id,
        fv.visit_date,
        fv.check_in,
        fv.check_out,
        fv.remarks,
        fv.visit_status,
        fv.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE fv.user_id = $1

      ORDER BY
        fv.visit_date DESC,
        fv.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Field Executive visits fetched successfully.",
      visits: result.rows,
    });
  } catch (error) {
    console.error(
      "Field Executive Visits Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch Field Executive visits.",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY VISIT BY ID
// =====================================================

const getMyVisitById = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.user_id,
        fv.visit_date,
        fv.check_in,
        fv.check_out,
        fv.remarks,
        fv.visit_status,
        fv.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE fv.id = $1
        AND fv.user_id = $2

      LIMIT 1
      `,
      [visitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Visit not found or not assigned to this Field Executive.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Field Executive visit fetched successfully.",
      visit: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Visit Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch visit details.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyVisits,
  getMyVisitById,
};

