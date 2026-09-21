const pool = require("../../config/db");

const STAFF_ROLES = ["field_executive", "legal", "security"];
const ASSIGNMENT_STATUSES = ["Pending", "Active", "Completed", "Cancelled"];

const getStaffAssignments = async (req, res) => {
  try {
    const { status, staff_id, property_id, search } = req.query;

    let query = `
      SELECT
        sa.id,
        sa.staff_id,
        staff.full_name AS staff_name,
        staff.email AS staff_email,
        staff.mobile AS staff_mobile,
        staff.role AS staff_role,

        sa.property_id,
        p.property_name,
        p.survey_number,
        p.city,
        p.state,
        p.verification_status,

        sa.assignment_type,
        sa.assignment_date,
        sa.status,
        sa.notes,

        sa.assigned_by,
        admin.full_name AS assigned_by_name,

        sa.created_at,
        sa.updated_at
      FROM staff_assignments sa
      INNER JOIN users staff ON sa.staff_id = staff.id
      INNER JOIN properties p ON sa.property_id = p.id
      LEFT JOIN users admin ON sa.assigned_by = admin.id
      WHERE 1 = 1
        AND staff.role = ANY($1::varchar[])
    `;

    const values = [STAFF_ROLES];
    let index = 2;

    if (status) {
      query += ` AND sa.status = $${index}`;
      values.push(status);
      index++;
    }

    if (staff_id) {
      query += ` AND sa.staff_id = $${index}`;
      values.push(staff_id);
      index++;
    }

    if (property_id) {
      query += ` AND sa.property_id = $${index}`;
      values.push(property_id);
      index++;
    }

    if (search) {
      query += `
        AND (
          staff.full_name ILIKE $${index}
          OR staff.email ILIKE $${index}
          OR p.property_name ILIKE $${index}
          OR p.survey_number ILIKE $${index}
          OR sa.assignment_type ILIKE $${index}
        )
      `;
      values.push(`%${search}%`);
      index++;
    }

    query += ` ORDER BY sa.created_at DESC`;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Staff Assignments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff assignments",
      error: error.message,
    });
  }
};

const getStaffAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        sa.id,
        sa.staff_id,
        staff.full_name AS staff_name,
        staff.email AS staff_email,
        staff.mobile AS staff_mobile,
        staff.role AS staff_role,

        sa.property_id,
        p.property_name,
        p.survey_number,
        p.city,
        p.state,
        p.verification_status,

        sa.assignment_type,
        sa.assignment_date,
        sa.status,
        sa.notes,

        sa.assigned_by,
        admin.full_name AS assigned_by_name,

        sa.created_at,
        sa.updated_at
      FROM staff_assignments sa
      INNER JOIN users staff ON sa.staff_id = staff.id
      INNER JOIN properties p ON sa.property_id = p.id
      LEFT JOIN users admin ON sa.assigned_by = admin.id
      WHERE sa.id = $1
        AND staff.role = ANY($2::varchar[])
      `,
      [id, STAFF_ROLES]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get Staff Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff assignment",
      error: error.message,
    });
  }
};

const validateStaffAndProperty = async (staff_id, property_id) => {
  const staffResult = await pool.query(
    `
    SELECT id, full_name, email, mobile, role, status
    FROM users
    WHERE id = $1
    `,
    [staff_id]
  );

  if (staffResult.rows.length === 0) {
    return { error: "Staff member not found", status: 404 };
  }

  const staff = staffResult.rows[0];

  if (!STAFF_ROLES.includes(staff.role)) {
    return {
      error: "Selected user is not eligible for staff assignment",
      status: 400,
    };
  }

  if (staff.status !== "active") {
    return {
      error: "Selected staff member is inactive",
      status: 400,
    };
  }

  const propertyResult = await pool.query(
    `
    SELECT
      id,
      property_name,
      survey_number,
      verification_status
    FROM properties
    WHERE id = $1
    `,
    [property_id]
  );

  if (propertyResult.rows.length === 0) {
    return { error: "Property not found", status: 404 };
  }

  return {
    staff,
    property: propertyResult.rows[0],
  };
};

const createStaffAssignment = async (req, res) => {
  try {
    const {
      staff_id,
      property_id,
      assignment_type,
      assignment_date,
      status,
      notes,
    } = req.body;

    if (!staff_id || !property_id || !assignment_type || !assignment_date) {
      return res.status(400).json({
        success: false,
        message:
          "staff_id, property_id, assignment_type and assignment_date are required",
      });
    }

    const finalStatus = status || "Pending";

    if (!ASSIGNMENT_STATUSES.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ASSIGNMENT_STATUSES.join(", ")}`,
      });
    }

    const validation = await validateStaffAndProperty(staff_id, property_id);

    if (validation.error) {
      return res.status(validation.status).json({
        success: false,
        message: validation.error,
      });
    }

    // Prevent duplicate active/pending assignments for the same
    // staff member, property and assignment type.
    const duplicate = await pool.query(
      `
      SELECT id
      FROM staff_assignments
      WHERE staff_id = $1
        AND property_id = $2
        AND assignment_type = $3
        AND status IN ('Pending', 'Active')
      LIMIT 1
      `,
      [staff_id, property_id, assignment_type.trim()]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This staff member already has a pending or active assignment for this property and assignment type.",
      });
    }

    const assignedBy = req.user?.id || null;

    const result = await pool.query(
      `
      INSERT INTO staff_assignments (
        staff_id,
        property_id,
        assignment_type,
        assignment_date,
        status,
        notes,
        assigned_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        staff_id,
        property_id,
        assignment_type.trim(),
        assignment_date,
        finalStatus,
        notes?.trim() || null,
        assignedBy,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Staff assignment created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create Staff Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create staff assignment",
      error: error.message,
    });
  }
};

const updateStaffAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      staff_id,
      property_id,
      assignment_type,
      assignment_date,
      status,
      notes,
    } = req.body;

    if (
      !staff_id ||
      !property_id ||
      !assignment_type ||
      !assignment_date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "staff_id, property_id, assignment_type, assignment_date and status are required",
      });
    }

    if (!ASSIGNMENT_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ASSIGNMENT_STATUSES.join(", ")}`,
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM staff_assignments
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff assignment not found",
      });
    }

    const validation = await validateStaffAndProperty(staff_id, property_id);

    if (validation.error) {
      return res.status(validation.status).json({
        success: false,
        message: validation.error,
      });
    }

    const duplicate = await pool.query(
      `
      SELECT id
      FROM staff_assignments
      WHERE staff_id = $1
        AND property_id = $2
        AND assignment_type = $3
        AND status IN ('Pending', 'Active')
        AND id <> $4
      LIMIT 1
      `,
      [staff_id, property_id, assignment_type.trim(), id]
    );

    if (duplicate.rows.length > 0 && ["Pending", "Active"].includes(status)) {
      return res.status(409).json({
        success: false,
        message:
          "Another pending or active assignment already exists for this staff member, property and assignment type.",
      });
    }

    const result = await pool.query(
      `
      UPDATE staff_assignments
      SET
        staff_id = $1,
        property_id = $2,
        assignment_type = $3,
        assignment_date = $4,
        status = $5,
        notes = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
      `,
      [
        staff_id,
        property_id,
        assignment_type.trim(),
        assignment_date,
        status,
        notes?.trim() || null,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Staff assignment updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update Staff Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff assignment",
      error: error.message,
    });
  }
};

const deleteStaffAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM staff_assignments
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Staff assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff assignment deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Delete Staff Assignment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete staff assignment",
      error: error.message,
    });
  }
};

const getAvailableStaff = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        mobile,
        role,
        status
      FROM users
      WHERE status = 'active'
        AND role = ANY($1::varchar[])
      ORDER BY full_name ASC, id ASC
      `,
      [STAFF_ROLES]
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Available Staff Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch available staff",
      error: error.message,
    });
  }
};

const getAvailableProperties = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        property_name,
        survey_number,
        city,
        state,
        verification_status
      FROM properties
      ORDER BY property_name ASC, id ASC
      `
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Available Properties Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
      error: error.message,
    });
  }
};

module.exports = {
  getStaffAssignments,
  getStaffAssignmentById,
  createStaffAssignment,
  updateStaffAssignment,
  deleteStaffAssignment,
  getAvailableStaff,
  getAvailableProperties,
};
