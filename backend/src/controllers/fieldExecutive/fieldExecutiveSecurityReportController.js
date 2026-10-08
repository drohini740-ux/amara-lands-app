const pool = require("../../config/db");

// =====================================================
// GET MY SECURITY REPORTS
// =====================================================

const getMySecurityReports = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        sr.id,
        sr.property_id,
        sr.user_id,
        sr.report_type,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.report_status,
        sr.created_at,
        sr.assigned_to,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.verification_status,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM security_reports sr

      LEFT JOIN properties p
        ON p.id = sr.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sr.user_id = $1

      ORDER BY
        sr.created_at DESC,
        sr.id DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message:
        "Field Executive security reports fetched successfully.",
      reports: result.rows,
    });
  } catch (error) {
    console.error(
      "Get My Security Reports Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch security reports.",
    });
  }
};

// =====================================================
// GET SECURITY REPORT BY ID
// =====================================================

const getSecurityReportById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        sr.id,
        sr.property_id,
        sr.user_id,
        sr.report_type,
        sr.description,
        sr.latitude,
        sr.longitude,
        sr.report_status,
        sr.created_at,
        sr.assigned_to,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude AS property_latitude,
        p.longitude AS property_longitude,
        p.verification_status,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM security_reports sr

      LEFT JOIN properties p
        ON p.id = sr.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      WHERE sr.id = $1
        AND sr.user_id = $2

      LIMIT 1
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Security report not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Security report fetched successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Security Report By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch security report.",
    });
  }
};

// =====================================================
// CREATE SECURITY REPORT
// =====================================================

const createSecurityReport = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      property_id,
      report_type,
      description,
      latitude,
      longitude,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
    }

    if (!report_type || !report_type.trim()) {
      return res.status(400).json({
        success: false,
        message: "Report type is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Report description is required.",
      });
    }

    // =====================================================
    // CHECK PROPERTY ASSIGNMENT
    // =====================================================

    const assignmentResult = await pool.query(
      `
      SELECT
        sa.id,
        p.id AS property_id,
        p.property_name,
        p.survey_number

      FROM staff_assignments sa

      INNER JOIN properties p
        ON p.id = sa.property_id

      WHERE sa.staff_id = $1
        AND sa.property_id = $2

      LIMIT 1
      `,
      [userId, property_id]
    );

    if (assignmentResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this property.",
      });
    }

    // =====================================================
    // CREATE SECURITY REPORT
    // =====================================================

    const result = await pool.query(
      `
      INSERT INTO security_reports
      (
        property_id,
        user_id,
        report_type,
        description,
        latitude,
        longitude,
        report_status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        'Pending'
      )
      RETURNING
        id,
        property_id,
        user_id,
        report_type,
        description,
        latitude,
        longitude,
        report_status,
        created_at,
        assigned_to
      `,
      [
        property_id,
        userId,
        report_type.trim(),
        description.trim(),
        latitude || null,
        longitude || null,
      ]
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    res.status(201).json({
      success: true,
      message:
        "Security report created successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Field Executive Security Report Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create security report.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SECURITY REPORT
// =====================================================

const updateSecurityReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const {
      report_type,
      description,
      latitude,
      longitude,
      report_status,
    } = req.body;

    const existingReport =
      await pool.query(
        `
        SELECT id
        FROM security_reports
        WHERE id = $1
          AND user_id = $2
        `,
        [id, userId]
      );

    if (existingReport.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Security report not found.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "Resolved",
      "Closed",
      "Rejected",
    ];

    if (
      report_status &&
      !allowedStatuses.includes(
        report_status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid security report status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE security_reports
      SET
        report_type =
          COALESCE($1, report_type),

        description =
          COALESCE($2, description),

        latitude =
          COALESCE($3, latitude),

        longitude =
          COALESCE($4, longitude),

        report_status =
          COALESCE($5, report_status)

      WHERE id = $6
        AND user_id = $7

      RETURNING *
      `,
      [
        report_type ?? null,
        description ?? null,
        latitude ?? null,
        longitude ?? null,
        report_status ?? null,
        id,
        userId,
      ]
    );

    res.status(200).json({
      success: true,
      message:
        "Security report updated successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Security Report Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update security report.",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getMySecurityReports,
  getSecurityReportById,
  createSecurityReport,
  updateSecurityReport,
};

