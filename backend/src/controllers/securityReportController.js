const pool = require("../config/db");

// ===============================
// Get All Security Reports
// ===============================
const getAllReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sr.*,
        p.property_name,
        u.full_name AS user_name
      FROM security_reports sr
      LEFT JOIN properties p ON sr.property_id = p.id
      LEFT JOIN users u ON sr.user_id = u.id
      ORDER BY sr.id DESC
    `);

    res.json({
      success: true,
      reports: result.rows,
    });

  } catch (err) {
    console.log(err);

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

    const result = await pool.query(
      `
      SELECT
        sr.*,
        p.property_name,
        u.full_name AS user_name
      FROM security_reports sr
      LEFT JOIN properties p
        ON sr.property_id = p.id
      LEFT JOIN users u
        ON sr.user_id = u.id
      WHERE sr.id=$1
      `,
      [id]
    );

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
    console.log(err);

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

    const user_id = req.user.id;

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
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        property_id,
        user_id,
        report_type,
        report_status,
        description,
        latitude,
        longitude,
      ]
    );

    res.status(201).json({
      success: true,
      report: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
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

const user_id = req.user.id;

    const result = await pool.query(
  `
  UPDATE security_reports
  SET
    property_id=$1,
    user_id=$2,
    report_type=$3,
    report_status=$4,
    description=$5,
    latitude=$6,
    longitude=$7
  WHERE id=$8
  RETURNING *
  `,
  [
    property_id,
    user_id,
    report_type,
    report_status,
    description,
    latitude,
    longitude,
    id,
  ]
);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Security Report not found",
      });
    }

    res.json({
      success: true,
      report: result.rows[0],
      message: "Security Report Updated Successfully",
    });
  } catch (err) {
    console.log(err);

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

    await pool.query(
      `
      DELETE FROM security_reports
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Security Report Deleted Successfully",
    });
  } catch (err) {
    console.log(err);

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