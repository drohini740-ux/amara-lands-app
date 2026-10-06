
const pool = require("../../config/db");

// =====================================================
// CREATE VISIT ASSIGNMENT
// =====================================================

const createVisitAssignment = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      property_id,
      visit_date,
      remarks,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!property_id || !visit_date) {
      return res.status(400).json({
        success: false,
        message:
          "Property ID and visit date are required.",
      });
    }

    // =================================================
    // CHECK PROPERTY
    // =================================================

    const propertyResult = await pool.query(
      `
      SELECT
        id,
        property_name
      FROM properties
      WHERE id = $1
      LIMIT 1
      `,
      [property_id]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found.",
      });
    }

    // =================================================
    // CHECK PROPERTY ASSIGNMENT
    // =================================================

    const assignmentResult = await pool.query(
      `
      SELECT
        id
      FROM staff_assignments
      WHERE staff_id = $1
        AND property_id = $2
      LIMIT 1
      `,
      [userId, property_id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "This property is not assigned to this Field Executive.",
      });
    }

    // =================================================
    // CREATE VISIT
    // =================================================

    const result = await pool.query(
      `
      INSERT INTO field_visits
      (
        property_id,
        user_id,
        visit_date,
        remarks,
        visit_status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        'Pending'
      )
      RETURNING *
      `,
      [
        property_id,
        userId,
        visit_date,
        remarks || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Visit assigned successfully.",
      visit: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Visit Assignment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create visit assignment.",
      error: error.message,
    });
  }
};

module.exports = {
  createVisitAssignment,
};

