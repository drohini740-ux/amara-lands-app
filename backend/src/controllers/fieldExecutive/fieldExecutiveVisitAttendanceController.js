
const pool = require("../../config/db");

// =====================================================
// CHECK IN TO VISIT
// =====================================================

const checkInVisit = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.id;

    // =================================================
    // FIND VISIT
    // =================================================

    const visitResult = await pool.query(
      `
      SELECT
        id,
        property_id,
        user_id,
        visit_date,
        check_in,
        check_out,
        visit_status
      FROM field_visits
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [visitId, userId]
    );

    if (visitResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Visit not found or not assigned to this Field Executive.",
      });
    }

    const visit = visitResult.rows[0];

    // =================================================
    // ALREADY CHECKED IN
    // =================================================

    if (visit.check_in) {
      return res.status(400).json({
        success: false,
        message:
          "You have already checked in to this visit.",
        visit,
      });
    }

    // =================================================
    // COMPLETED VISIT
    // =================================================

    if (
      String(visit.visit_status || "")
        .toLowerCase() === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This visit has already been completed.",
      });
    }

    // =================================================
    // CHECK IN
    // =================================================

    const result = await pool.query(
      `
      UPDATE field_visits
      SET
        check_in = CURRENT_TIME,
        visit_status = 'In Progress'
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [visitId, userId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Visit check-in successful.",
      visit: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Check-In Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check in to visit.",
      error: error.message,
    });
  }
};

// =====================================================
// CHECK OUT FROM VISIT
// =====================================================

const checkOutVisit = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitId = req.params.id;

    // =================================================
    // FIND VISIT
    // =================================================

    const visitResult = await pool.query(
      `
      SELECT
        id,
        property_id,
        user_id,
        visit_date,
        check_in,
        check_out,
        visit_status
      FROM field_visits
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
      `,
      [visitId, userId]
    );

    if (visitResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Visit not found or not assigned to this Field Executive.",
      });
    }

    const visit = visitResult.rows[0];

    // =================================================
    // CHECK-IN REQUIRED
    // =================================================

    if (!visit.check_in) {
      return res.status(400).json({
        success: false,
        message:
          "Please check in to the visit before checking out.",
      });
    }

    // =================================================
    // ALREADY CHECKED OUT
    // =================================================

    if (visit.check_out) {
      return res.status(400).json({
        success: false,
        message:
          "You have already checked out from this visit.",
        visit,
      });
    }

    // =================================================
    // CHECK OUT
    // =================================================

    const result = await pool.query(
      `
      UPDATE field_visits
      SET
        check_out = CURRENT_TIME,
        visit_status = 'Completed'
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [visitId, userId]
    );

    return res.status(200).json({
      success: true,
      message:
        "Visit check-out successful.",
      visit: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Field Executive Check-Out Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check out from visit.",
      error: error.message,
    });
  }
};

module.exports = {
  checkInVisit,
  checkOutVisit,
};

