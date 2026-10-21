
const pool = require("../config/db");

// ===============================
// Get All Security Reports
// ===============================
const getAllReports = async (req, res) => {
  try {
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        sr.*,
        p.property_name,
        u.full_name AS user_name
      FROM security_reports sr
      LEFT JOIN properties p ON sr.property_id = p.id
      LEFT JOIN users u ON sr.user_id = u.id
    `;

    const values = [];

    if (isCustomer) {
      query += ` WHERE p.user_id = $1`;
      values.push(req.user.id);
    }

    query += ` ORDER BY sr.id DESC`;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      reports: result.rows,
    });
  } catch (err) {
    console.error("Get All Security Reports Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Get Single Security Report
// ===============================
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        sr.*,
        p.property_name,
        u.full_name AS user_name
      FROM security_reports sr
      LEFT JOIN properties p ON sr.property_id = p.id
      LEFT JOIN users u ON sr.user_id = u.id
      WHERE sr.id = $1
    `;

    const values = [id];

    // Prevent customers from viewing other customers' property reports.
    if (isCustomer) {
      query += ` AND p.user_id = $2`;
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security Report not found",
      });
    }

    res.json({
      success: true,
      report: result.rows[0],
    });
  } catch (err) {
    console.error("Get Security Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Create Security Report
// ===============================
const createReport = async (req, res) => {
  try {
    const {
      property_id,
      report_type,
      report_status,
      description,
      latitude,
      longitude,
    } = req.body;

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (
      !property_id ||
      !report_type ||
      !report_status
    ) {
      return res.status(400).json({
        success: false,
        message: "Property, report type, and status are required",
      });
    }

    // Customers may create reports only for properties they own.
    if (userRole === "customer") {
      const propertyResult = await pool.query(
        `SELECT id FROM properties WHERE id = $1 AND user_id = $2`,
        [property_id, userId]
      );

      if (propertyResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You can only create reports for your own properties",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO security_reports
      (
        property_id,
        user_id,
        report_type,
        report_status,
        description,
        latitude,
        longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        property_id,
        userId,
        report_type,
        report_status,
        description || "",
        latitude ?? null,
        longitude ?? null,
      ]
    );

    res.status(201).json({
      success: true,
      report: result.rows[0],
      message: "Security Report Created Successfully",
    });
  } catch (err) {
    console.error("Create Security Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Update Security Report
// ===============================
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      property_id,
      report_type,
      report_status,
      description,
      latitude,
      longitude,
    } = req.body;

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Customers may update only reports for properties they own.
    let accessQuery = `
      SELECT sr.id
      FROM security_reports sr
      JOIN properties p ON p.id = sr.property_id
      WHERE sr.id = $1
    `;

    const accessValues = [id];

    if (userRole === "customer") {
      accessQuery += ` AND p.user_id = $2`;
      accessValues.push(userId);
    }

    const accessResult = await pool.query(accessQuery, accessValues);

    if (accessResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security Report not found or access denied",
      });
    }

    // Customers may not move a report to a property they do not own.
    if (userRole === "customer") {
      const propertyResult = await pool.query(
        `SELECT id FROM properties WHERE id = $1 AND user_id = $2`,
        [property_id, userId]
      );

      if (propertyResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You can only select your own properties",
        });
      }
    }

    // Keep the original report creator instead of replacing user_id
    // with the ID of whichever authorized user edits the report.
    const result = await pool.query(
      `
      UPDATE security_reports
      SET
        property_id = $1,
        report_type = $2,
        report_status = $3,
        description = $4,
        latitude = $5,
        longitude = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        property_id,
        report_type,
        report_status,
        description || "",
        latitude ?? null,
        longitude ?? null,
        id,
      ]
    );

    res.json({
      success: true,
      report: result.rows[0],
      message: "Security Report Updated Successfully",
    });
  } catch (err) {
    console.error("Update Security Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Security Report
// ===============================
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let query = `
      DELETE FROM security_reports sr
      USING properties p
      WHERE sr.property_id = p.id
        AND sr.id = $1
    `;

    const values = [id];

    // Customers can delete reports only for their own properties.
    if (userRole === "customer") {
      query += ` AND p.user_id = $2`;
      values.push(userId);
    }

    query += ` RETURNING sr.id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security Report not found or access denied",
      });
    }

    res.json({
      success: true,
      message: "Security Report Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Security Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
