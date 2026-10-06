
const pool = require("../../config/db");

// =====================================================
// GET MY ASSIGNED PROPERTIES FOR VERIFICATION
// =====================================================

const getMyVerificationProperties = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        sa.id AS assignment_id,
        p.id AS property_id,
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
        p.verified_by,
        p.created_at AS property_created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sa.staff_id = $1

      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Field Executive verification properties fetched successfully.",
      properties: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Field Executive Verification Properties Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch verification properties.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE PROPERTY FOR VERIFICATION
// =====================================================

const getVerificationPropertyById = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    const result = await pool.query(
      `
      SELECT
        sa.id AS assignment_id,
        p.id AS property_id,
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
        p.verified_by,
        p.created_at AS property_created_at,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sa.staff_id = $1
        AND p.id = $2

      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found or not assigned to this Field Executive.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Verification property fetched successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Verification Property Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch verification property.",
      error: error.message,
    });
  }
};

// =====================================================
// VERIFY PROPERTY
// =====================================================

const verifyProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    // ---------------------------------------------------
    // CHECK PROPERTY ASSIGNMENT
    // ---------------------------------------------------

    const assignmentResult = await pool.query(
      `
      SELECT
        sa.id,
        p.id AS property_id,
        p.verification_status
      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1
        AND p.id = $2

      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found or not assigned to this Field Executive.",
      });
    }

    const property =
      assignmentResult.rows[0];

    // ---------------------------------------------------
    // CHECK CURRENT STATUS
    // ---------------------------------------------------

    if (
      String(property.verification_status)
        .toLowerCase() === "verified"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This property is already verified.",
      });
    }

    // ---------------------------------------------------
    // UPDATE PROPERTY
    // ---------------------------------------------------

    const result = await pool.query(
      `
      UPDATE properties
      SET
        verification_status = 'Verified',
        verified_by = $1
      WHERE id = $2
      RETURNING *
      `,
      [userId, propertyId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Property verified successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Verify Property Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify property.",
      error: error.message,
    });
  }
};

// =====================================================
// REJECT PROPERTY
// =====================================================

const rejectProperty = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = req.params.id;

    // ---------------------------------------------------
    // CHECK PROPERTY ASSIGNMENT
    // ---------------------------------------------------

    const assignmentResult = await pool.query(
      `
      SELECT
        sa.id,
        p.id AS property_id,
        p.verification_status
      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1
        AND p.id = $2

      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found or not assigned to this Field Executive.",
      });
    }

    const property =
      assignmentResult.rows[0];

    // ---------------------------------------------------
    // CHECK CURRENT STATUS
    // ---------------------------------------------------

    if (
      String(property.verification_status)
        .toLowerCase() === "rejected"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This property is already rejected.",
      });
    }

    // ---------------------------------------------------
    // UPDATE PROPERTY
    // ---------------------------------------------------

    const result = await pool.query(
      `
      UPDATE properties
      SET
        verification_status = 'Rejected',
        verified_by = $1
      WHERE id = $2
      RETURNING *
      `,
      [userId, propertyId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Property rejected successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Reject Property Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reject property.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getMyVerificationProperties,
  getVerificationPropertyById,
  verifyProperty,
  rejectProperty,
};

