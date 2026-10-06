
const pool = require("../../config/db");

// =====================================================
// GET MY VISIT REPORTS
// =====================================================

const getMyVisitReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.user_id,
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM field_visits fv

      LEFT JOIN properties p
        ON p.id = fv.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE fv.user_id = $1

      ORDER BY
        fv.visit_date DESC,
        fv.id DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message:
        "Field Executive visit reports fetched successfully.",
      reports: result.rows,
    });
  } catch (error) {
    console.error(
      "Get My Visit Reports Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch visit reports.",
    });
  }
};

// =====================================================
// GET VISIT REPORT BY ID
// =====================================================

const getVisitReportById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        fv.id,
        fv.property_id,
        fv.user_id,
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM field_visits fv

      LEFT JOIN properties p
        ON p.id = fv.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE fv.id = $1
        AND fv.user_id = $2

      LIMIT 1
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Visit report not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Visit report fetched successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Visit Report By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch visit report.",
    });
  }
};

// =====================================================
// UPDATE VISIT REPORT
// =====================================================

const updateVisitReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      remarks,
      visit_status,
    } = req.body;

    const existingVisit =
      await pool.query(
        `
        SELECT id
        FROM field_visits
        WHERE id = $1
          AND user_id = $2
        `,
        [id, userId]
      );

    if (existingVisit.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Visit report not found.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    if (
      visit_status &&
      !allowedStatuses.includes(
        visit_status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid visit status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE field_visits
      SET
        remarks = COALESCE($1, remarks),
        visit_status = COALESCE($2, visit_status)
      WHERE id = $3
        AND user_id = $4
      RETURNING *
      `,
      [
        remarks ?? null,
        visit_status ?? null,
        id,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      message:
        "Visit report updated successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Visit Report Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update visit report.",
    });
  }
};

module.exports = {
  getMyVisitReports,
  getVisitReportById,
  updateVisitReport,
};

