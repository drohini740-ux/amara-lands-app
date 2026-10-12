
const pool = require("../../config/db");

// =====================================================
// GET VISITS FOR PROPERTIES ASSIGNED TO SECURITY USER
// =====================================================

const getSecurityVisits = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        fv.id AS visit_id,
        fv.property_id,
        fv.user_id AS visit_user_id,
        fv.visit_date,
        fv.check_in,
        fv.check_out,
        fv.remarks,
        fv.visit_status,
        fv.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.address,
        p.city,
        p.state,

        sa.assignment_type,
        sa.status AS assignment_status

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = fv.property_id

      WHERE sa.staff_id = $1
        AND LOWER(sa.status) = 'active'

      ORDER BY
        fv.visit_date DESC,
        fv.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Security visits fetched successfully.",
      visits: result.rows,
    });
  } catch (error) {
    console.error("Security Visits Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Security visits.",
    });
  }
};

// =====================================================
// GET VISIT DETAILS
// =====================================================

const getSecurityVisitById = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = Number(req.params.id);

    if (!Number.isInteger(visitId) || visitId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        fv.id AS visit_id,
        fv.property_id,
        fv.user_id AS visit_user_id,
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

        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes AS assignment_notes

      FROM field_visits fv

      INNER JOIN properties p
        ON p.id = fv.property_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = fv.property_id

      WHERE fv.id = $1
        AND sa.staff_id = $2
        AND LOWER(sa.status) = 'active'

      ORDER BY sa.created_at DESC
      LIMIT 1
      `,
      [visitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Visit not found for your assigned properties.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security visit details fetched successfully.",
      visit: result.rows[0],
    });
  } catch (error) {
    console.error("Security Visit Details Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Security visit details.",
    });
  }
};

module.exports = {
  getSecurityVisits,
  getSecurityVisitById,
};

