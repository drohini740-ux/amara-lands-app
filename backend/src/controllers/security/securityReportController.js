
const pool = require("../../config/db");

// =====================================================
// CHECK SECURITY ROLE
// =====================================================

const checkSecurityRole = (req, res) => {
  if (String(req.user?.role || "").toLowerCase() !== "security") {
    res.status(403).json({
      success: false,
      message: "Only Security users can access this module.",
    });

    return false;
  }

  return true;
};

// =====================================================
// GET SECURITY INCIDENT REPORTS
// =====================================================

const getSecurityReports = async (req, res) => {
  try {
    if (!checkSecurityRole(req, res)) return;

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
        p.address,
        p.city,
        p.state,

        u.full_name AS security_name,
        u.email AS security_email

      FROM security_reports sr

      LEFT JOIN properties p
        ON p.id = sr.property_id

      LEFT JOIN users u
        ON u.id = sr.user_id

      WHERE
        sr.user_id = $1
        OR EXISTS (
          SELECT 1
          FROM staff_assignments sa
          WHERE sa.staff_id = $1
            AND sa.property_id = sr.property_id
            AND LOWER(COALESCE(sa.status, '')) = 'active'
        )

      ORDER BY sr.created_at DESC, sr.id DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Security incident reports fetched successfully.",
      total: result.rows.length,
      reports: result.rows,
    });
  } catch (error) {
    console.error("Get Security Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch security incident reports.",
    });
  }
};

// =====================================================
// GET SECURITY INCIDENT REPORT BY ID
// =====================================================

const getSecurityReportById = async (req, res) => {
  try {
    if (!checkSecurityRole(req, res)) return;

    const userId = req.user.id;
    const reportId = Number(req.params.id);

    if (!Number.isInteger(reportId) || reportId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid report ID is required.",
      });
    }

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

        u.full_name AS security_name,
        u.email AS security_email

      FROM security_reports sr

      LEFT JOIN properties p
        ON p.id = sr.property_id

      LEFT JOIN users u
        ON u.id = sr.user_id

      WHERE sr.id = $1
        AND (
          sr.user_id = $2
          OR EXISTS (
            SELECT 1
            FROM staff_assignments sa
            WHERE sa.staff_id = $2
              AND sa.property_id = sr.property_id
              AND LOWER(COALESCE(sa.status, '')) = 'active'
          )
        )

      LIMIT 1
      `,
      [reportId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security report not found or access denied.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Security incident report fetched successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Get Security Report By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch security report details.",
    });
  }
};

// =====================================================
// CREATE SECURITY INCIDENT REPORT
// =====================================================

const createSecurityReport = async (req, res) => {
  try {
    if (!checkSecurityRole(req, res)) return;

    const userId = req.user.id;

    const {
      property_id,
      report_type,
      description,
      latitude,
      longitude,
    } = req.body;

    const propertyId = Number(property_id);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid property.",
      });
    }

    if (
      typeof report_type !== "string" ||
      !report_type.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Report type is required.",
      });
    }

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Report description is required.",
      });
    }

    const validCoordinate = (value, min, max) => {
      if (value === undefined || value === null || value === "") {
        return true;
      }

      const number = Number(value);

      return Number.isFinite(number) && number >= min && number <= max;
    };

    if (
      !validCoordinate(latitude, -90, 90) ||
      !validCoordinate(longitude, -180, 180)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid latitude and longitude.",
      });
    }

    // -----------------------------------------------
    // CHECK ACTIVE PROPERTY ASSIGNMENT
    // -----------------------------------------------

    const assignment = await pool.query(
      `
      SELECT p.id
      FROM properties p
      WHERE p.id = $1
        AND EXISTS (
          SELECT 1
          FROM staff_assignments sa
          WHERE sa.property_id = p.id
            AND sa.staff_id = $2
            AND LOWER(COALESCE(sa.status, '')) = 'active'
        )
      LIMIT 1
      `,
      [propertyId, userId]
    );

    if (assignment.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not actively assigned to this property.",
      });
    }

    // -----------------------------------------------
    // INSERT INCIDENT REPORT
    // -----------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO security_reports (
        property_id,
        user_id,
        report_type,
        description,
        latitude,
        longitude,
        report_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        propertyId,
        userId,
        report_type.trim(),
        description.trim(),
        latitude === undefined || latitude === null || latitude === ""
          ? null
          : Number(latitude),
        longitude === undefined || longitude === null || longitude === ""
          ? null
          : Number(longitude),
        "Pending",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Security incident report created successfully.",
      report: result.rows[0],
    });
  } catch (error) {
    console.error("Create Security Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create security incident report.",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  getSecurityReports,
  getSecurityReportById,
  createSecurityReport,
};
