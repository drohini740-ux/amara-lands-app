const pool = require("../config/db");

// ==============================
// Get All Geo Tagged Reports
// ==============================
const getGeoReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        g.*,
        p.property_name,
        u.full_name AS user_name
      FROM geo_tagged_reports g
      JOIN properties p ON g.property_id = p.id
      JOIN users u ON g.user_id = u.id
      ORDER BY g.created_at DESC
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

// ==============================
// Get Single Report
// ==============================
const getGeoReport = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        g.*,
        p.property_name,
        u.full_name AS user_name
      FROM geo_tagged_reports g
      JOIN properties p ON g.property_id = p.id
      JOIN users u ON g.user_id = u.id
      WHERE g.id=$1
      `,
      [id]
    );

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

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// ==============================
// Add Geo Report
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
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        property_id,
        req.user.id,
        report_title,
        latitude,
        longitude,
        location_address,
        description,
        image_url,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Geo Report Added Successfully",
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

// ==============================
// Update Geo Report
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

    const result = await pool.query(
      `
      UPDATE geo_tagged_reports
      SET
        property_id=$1,
        report_title=$2,
        latitude=$3,
        longitude=$4,
        location_address=$5,
        description=$6,
        image_url=$7
      WHERE id=$8
      RETURNING *
      `,
      [
        property_id,
        report_title,
        latitude,
        longitude,
        location_address,
        description,
        image_url,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Geo Report Updated Successfully",
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

// ==============================
// Delete Geo Report
// ==============================
const deleteGeoReport = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM geo_tagged_reports WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Geo Report Deleted Successfully",
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
  getGeoReports,
  getGeoReport,
  addGeoReport,
  updateGeoReport,
  deleteGeoReport,
};