
const pool = require("../../config/db");

// =====================================================
// GET SECURITY PATROL LOGS
// Returns patrol logs for properties actively assigned
// to the logged-in Security user.
// =====================================================

const getSecurityPatrols = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        pl.id AS patrol_id,
        pl.property_id,
        pl.user_id AS patrol_user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,

        patrol_user.full_name AS patrol_user_name,

        'Active' AS assignment_status

      FROM patrol_logs pl

      INNER JOIN properties p
        ON p.id = pl.property_id

      LEFT JOIN users patrol_user
        ON patrol_user.id = pl.user_id

      WHERE EXISTS (
        SELECT 1
        FROM staff_assignments sa
        WHERE sa.staff_id = $1
          AND sa.property_id = pl.property_id
          AND LOWER(sa.status) = 'active'
      )

      ORDER BY
        pl.patrol_date DESC,
        pl.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Security patrol logs fetched successfully.",
      patrols: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Security Patrols Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch Security patrol logs.",
    });
  }
};

// =====================================================
// GET SECURITY PATROL DETAILS BY ID
// =====================================================

const getSecurityPatrolById = async (req, res) => {
  try {
    const userId = req.user.id;
    const patrolId = Number(req.params.id);

    if (
      !Number.isInteger(patrolId) ||
      patrolId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid patrol ID is required.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        pl.id AS patrol_id,
        pl.property_id,
        pl.user_id AS patrol_user_id,
        pl.patrol_date,
        pl.check_in,
        pl.check_out,
        pl.patrol_status,
        pl.remarks,
        pl.created_at,

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

        patrol_user.full_name AS patrol_user_name,
        patrol_user.email AS patrol_user_email,

        sa.assignment_type,
        sa.assignment_date,
        sa.status AS assignment_status,
        sa.notes AS assignment_notes

      FROM patrol_logs pl

      INNER JOIN properties p
        ON p.id = pl.property_id

      LEFT JOIN users patrol_user
        ON patrol_user.id = pl.user_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = pl.property_id
       AND sa.staff_id = $1
       AND LOWER(sa.status) = 'active'

      WHERE pl.id = $2

      ORDER BY sa.id DESC
      LIMIT 1
      `,
      [userId, patrolId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security patrol details fetched successfully.",
      patrol: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Security Patrol By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch patrol details.",
    });
  }
};

module.exports = {
  getSecurityPatrols,
  getSecurityPatrolById,
};
