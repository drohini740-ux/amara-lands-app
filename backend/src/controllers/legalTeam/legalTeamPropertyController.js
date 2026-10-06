
const pool = require("../../config/db");

// =====================================================
// GET ALL PROPERTIES
// =====================================================

const getAllProperties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.user_id,
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
        p.verified_by,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM properties p

      LEFT JOIN users u
        ON p.user_id = u.id

      ORDER BY
        p.created_at DESC,
        p.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal Team properties fetched successfully.",
      properties: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Properties Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
      error: error.message,
    });
  }
};

// =====================================================
// GET PROPERTY BY ID
// =====================================================

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.user_id,
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
        p.verified_by,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,
        u.role AS customer_role,
        u.status AS customer_status

      FROM properties p

      LEFT JOIN users u
        ON p.user_id = u.id

      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Property fetched successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Legal Team Property By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
};

