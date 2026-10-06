
const pool = require("../../config/db");

// =====================================================
// GET MY ASSIGNED PROPERTIES
// =====================================================

const getMyProperties = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        sa.id AS assignment_id,
        sa.property_id,
        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes,

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
        p.created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sa.staff_id = $1

      ORDER BY
        sa.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Field Executive assigned properties fetched successfully.",
      properties: result.rows,
    });
  } catch (error) {
    console.error(
      "Field Executive Properties Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch assigned properties.",
      error: error.message,
    });
  }
};

// =====================================================
// GET MY PROPERTY BY ID
// =====================================================

const getMyPropertyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        sa.id AS assignment_id,
        sa.property_id,
        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes,

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
        p.created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sa.staff_id = $1
        AND sa.property_id = $2

      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Property not assigned to this Field Executive.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Field Executive property fetched successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Property Details Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch property details.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProperties,
  getMyPropertyById,
};

