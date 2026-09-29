const pool = require("../../config/db");

// =====================================================
// GET ALL STAFF
// =====================================================

const getAllStaff = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.status,
        u.created_at,

        COUNT(sa.id) AS total_assignments

      FROM users u

      LEFT JOIN staff_assignments sa
        ON u.id = sa.staff_id

      WHERE u.role IN (
        'field_executive',
        'legal',
        'security',
        'admin'
      )

      GROUP BY
        u.id,
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.status,
        u.created_at

      ORDER BY u.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      staff: result.rows,
    });
  } catch (error) {
    console.error("Get Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff.",
      error: error.message,
    });
  }
};

// =====================================================
// GET STAFF BY ID
// =====================================================

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        u.id,
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.status,
        u.created_at,

        COUNT(sa.id) AS total_assignments

      FROM users u

      LEFT JOIN staff_assignments sa
        ON u.id = sa.staff_id

      WHERE u.id = $1
        AND u.role IN (
          'field_executive',
          'legal',
          'security',
          'admin'
        )

      GROUP BY
        u.id,
        u.full_name,
        u.mobile,
        u.email,
        u.role,
        u.status,
        u.created_at
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff fetched successfully.",
      staff: result.rows[0],
    });
  } catch (error) {
    console.error("Get Staff By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff member.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE STAFF STATUS
// =====================================================

const updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2
        AND role IN (
          'field_executive',
          'legal',
          'security',
          'admin'
        )

      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        updated_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff status updated successfully.",
      staff: result.rows[0],
    });
  } catch (error) {
    console.error("Update Staff Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff status.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE STAFF ROLE
// =====================================================

const updateStaffRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "field_executive",
      "legal",
      "security",
      "admin",
    ];

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff role.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        role = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        updated_at
      `,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff member not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff role updated successfully.",
      staff: result.rows[0],
    });
  } catch (error) {
    console.error("Update Staff Role Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff role.",
      error: error.message,
    });
  }
};

// =====================================================
// GET STAFF ASSIGNMENTS
// =====================================================

const getStaffAssignments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sa.id,
        sa.staff_id,
        sa.property_id,
        sa.assignment_type,
        sa.assignment_date,
        sa.status,
        sa.notes,
        sa.assigned_by,
        sa.created_at,
        sa.updated_at,

        u.full_name AS staff_name,
        u.mobile AS staff_mobile,
        u.email AS staff_email,
        u.role AS staff_role,

        p.property_name,
        p.survey_number,
        p.city,
        p.state

      FROM staff_assignments sa

      LEFT JOIN users u
        ON sa.staff_id = u.id

      LEFT JOIN properties p
        ON sa.property_id = p.id

      ORDER BY sa.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Staff assignments fetched successfully.",
      assignments: result.rows,
    });
  } catch (error) {
    console.error("Get Staff Assignments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff assignments.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ASSIGNMENT STATUS
// =====================================================

const updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Assignment status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE staff_assignments
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $2

      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment status updated successfully.",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error("Update Assignment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update assignment status.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  updateStaffStatus,
  updateStaffRole,
  getStaffAssignments,
  updateAssignmentStatus,
};