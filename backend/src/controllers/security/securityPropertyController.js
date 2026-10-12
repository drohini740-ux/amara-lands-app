
const pool = require("../../config/db");

// =====================================================
// GET ASSIGNED PROPERTIES FOR SECURITY USER
// =====================================================

const getAssignedProperties = async (req, res) => {
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
        p.verification_status

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1

      ORDER BY sa.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Assigned properties fetched successfully.",
      properties: result.rows,
    });
  } catch (error) {
    console.error("Security Assigned Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch assigned properties.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAssignedProperties,
};
