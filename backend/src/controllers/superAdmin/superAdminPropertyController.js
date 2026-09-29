const pool = require("../../config/db");

// GET ALL PROPERTIES
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

        u.full_name AS owner_name,
        u.mobile AS owner_mobile,
        u.email AS owner_email

      FROM properties p

      LEFT JOIN users u
        ON u.id = p.user_id

      ORDER BY p.id DESC
    `);

    return res.json({
      success: true,
      properties: result.rows,
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN GET PROPERTIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties.",
    });
  }
};

// GET PROPERTY BY ID
const getPropertyById = async (req, res) => {
  try {
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

        u.full_name AS owner_name,
        u.mobile AS owner_mobile,
        u.email AS owner_email

      FROM properties p

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.json({
      success: true,
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN GET PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property.",
    });
  }
};

// VERIFY PROPERTY
const verifyProperty = async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE properties
      SET
        verification_status = 'Verified',
        verified_by = $1
      WHERE id = $2
      RETURNING
        id,
        property_name,
        verification_status,
        verified_by
      `,
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.json({
      success: true,
      message: "Property verified successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN VERIFY PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to verify property.",
    });
  }
};

// REJECT PROPERTY
const rejectProperty = async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE properties
      SET
        verification_status = 'Rejected',
        verified_by = $1
      WHERE id = $2
      RETURNING
        id,
        property_name,
        verification_status,
        verified_by
      `,
      [req.user.id, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.json({
      success: true,
      message: "Property rejected successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN REJECT PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reject property.",
    });
  }
};

// DELETE PROPERTY
const deleteProperty = async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM properties
      WHERE id = $1
      RETURNING id, property_name
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    return res.json({
      success: true,
      message: "Property deleted successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN DELETE PROPERTY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete property.",
    });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  verifyProperty,
  rejectProperty,
  deleteProperty,
};