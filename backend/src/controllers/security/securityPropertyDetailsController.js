
const pool = require("../../config/db");

// =====================================================
// GET DETAILS OF AN ASSIGNED PROPERTY
// =====================================================

const getAssignedPropertyById = async (req, res) => {
  try {
    const userId = req.user.id;
    const propertyId = Number(req.params.id);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID.",
      });
    }

    // Only allow the logged-in security user to view
    // properties assigned to their own account.
    const result = await pool.query(
      `
      SELECT
        sa.id AS assignment_id,
        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes AS assignment_notes,

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
        p.created_at

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1
        AND sa.property_id = $2

      ORDER BY sa.created_at DESC
      LIMIT 1
      `,
      [userId, propertyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assigned property not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned property details fetched successfully.",
      property: result.rows[0],
    });
  } catch (error) {
    console.error("Security Property Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch property details.",
    });
  }
};

module.exports = {
  getAssignedPropertyById,
};

