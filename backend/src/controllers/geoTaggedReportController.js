
const pool = require("../config/db");

// ==============================
// Helper: Check Property Access
// ==============================
const checkPropertyAccess = async (propertyId, userId, userRole) => {
  if (userRole !== "customer") {
    return true;
  }

  const result = await pool.query(
    `SELECT id FROM properties WHERE id = $1 AND user_id = $2`,
    [propertyId, userId]
  );

  return result.rows.length > 0;
};

// ==============================
// Get All Geo Tagged Reports
// ==============================
const getGeoReports = async (req, res) => {
  try {
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        g.*,
        p.property_name,
        u.full_name AS user_name
      FROM geo_tagged_reports g
      JOIN properties p ON g.property_id = p.id
      JOIN users u ON g.user_id = u.id
    `;

    const values = [];

    if (isCustomer) {
      query += ` WHERE p.user_id = $1`;
      values.push(req.user.id);
    }

    query += ` ORDER BY g.created_at DESC`;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      reports: result.rows,
    });
  } catch (err) {
    console.error("Get Geo Reports Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get Single Geo Tagged Report
// ==============================
const getGeoReport = async (req, res) => {
  try {
    const { id } = req.params;
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        g.*,
        p.property_name,
        u.full_name AS user_name
      FROM geo_tagged_reports g
      JOIN properties p ON g.property_id = p.id
      JOIN users u ON g.user_id = u.id
      WHERE g.id = $1
    `;

    const values = [id];

    if (isCustomer) {
      query += ` AND p.user_id = $2`;
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Geo Report not found",
      });
    }

    res.json({
      success: true,
      report: result.rows[0],
    });
  } catch (err) {
    console.error("Get Geo Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Add Geo Tagged Report
// ==============================
const addGeoReport = async (req, res) => {
  try {
    const {
      property_id,
      report_title,
      latitude,
      longitude,
      location_address,
      description,
      image_url,
    } = req.body;

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!property_id || !report_title) {
      return res.status(400).json({
        success: false,
        message: "Property and report title are required",
      });
    }

    const allowed = await checkPropertyAccess(
      property_id,
      userId,
      userRole
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a report for this property",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO geo_tagged_reports
      (
        property_id,
        user_id,
        report_title,
        latitude,
        longitude,
        location_address,
        description,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        property_id,
        userId,
        report_title,
        latitude ?? null,
        longitude ?? null,
        location_address || "",
        description || "",
        image_url || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Geo Report Added Successfully",
      report: result.rows[0],
    });
  } catch (err) {
    console.error("Add Geo Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Update Geo Tagged Report
// ==============================
const updateGeoReport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_id,
      report_title,
      latitude,
      longitude,
      location_address,
      description,
      image_url,
    } = req.body;

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check access to the existing report.
    let accessQuery = `
      SELECT g.id
      FROM geo_tagged_reports g
      JOIN properties p ON p.id = g.property_id
      WHERE g.id = $1
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
        message: "Geo Report not found",
      });
    }

    const allowed = await checkPropertyAccess(
      property_id,
      userId,
      userRole
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot move this report to another customer's property",
      });
    }

    const result = await pool.query(
      `
      UPDATE geo_tagged_reports
      SET
        property_id = $1,
        report_title = $2,
        latitude = $3,
        longitude = $4,
        location_address = $5,
        description = $6,
        image_url = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        property_id,
        report_title,
        latitude ?? null,
        longitude ?? null,
        location_address || "",
        description || "",
        image_url || null,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Geo Report Updated Successfully",
      report: result.rows[0],
    });
  } catch (err) {
    console.error("Update Geo Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Geo Tagged Report
// ==============================
const deleteGeoReport = async (req, res) => {
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
      DELETE FROM geo_tagged_reports g
      USING properties p
      WHERE g.property_id = p.id
        AND g.id = $1
    `;

    const values = [id];

    if (userRole === "customer") {
      query += ` AND p.user_id = $2`;
      values.push(userId);
    }

    query += ` RETURNING g.id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Geo Report not found",
      });
    }

    res.json({
      success: true,
      message: "Geo Report Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Geo Report Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getGeoReports,
  getGeoReport,
  addGeoReport,
  updateGeoReport,
  deleteGeoReport,
};
