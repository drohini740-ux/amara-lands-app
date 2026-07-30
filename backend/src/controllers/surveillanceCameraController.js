const pool = require("../config/db");

// ==============================
// Get All Cameras
// ==============================
const getSurveillanceCameras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sc.*,
        p.property_name,
        u.full_name AS user_name
      FROM surveillance_cameras sc
      JOIN properties p ON sc.property_id = p.id
      JOIN users u ON sc.user_id = u.id
      ORDER BY sc.created_at DESC
    `);

    res.json({
      success: true,
      cameras: result.rows,
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
// Get Single Camera
// ==============================
const getSurveillanceCamera = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        sc.*,
        p.property_name,
        u.full_name AS user_name
      FROM surveillance_cameras sc
      JOIN properties p ON sc.property_id = p.id
      JOIN users u ON sc.user_id = u.id
      WHERE sc.id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found",
      });
    }

    res.json({
      success: true,
      camera: result.rows[0],
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
// Add Camera
// ==============================
const addSurveillanceCamera = async (req, res) => {
  try {
    const {
      property_id,
      camera_name,
      camera_location,
      camera_type,
      status,
      installation_date,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO surveillance_cameras
      (
        property_id,
        user_id,
        camera_name,
        camera_location,
        camera_type,
        status,
        installation_date,
        remarks
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        property_id,
        req.user.id,
        camera_name,
        camera_location,
        camera_type,
        status,
        installation_date,
        remarks,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Camera Added Successfully",
      camera: result.rows[0],
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
// Update Camera
// ==============================
const updateSurveillanceCamera = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_id,
      camera_name,
      camera_location,
      camera_type,
      status,
      installation_date,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE surveillance_cameras
      SET
        property_id=$1,
        camera_name=$2,
        camera_location=$3,
        camera_type=$4,
        status=$5,
        installation_date=$6,
        remarks=$7
      WHERE id=$8
      RETURNING *
      `,
      [
        property_id,
        camera_name,
        camera_location,
        camera_type,
        status,
        installation_date,
        remarks,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Camera Updated Successfully",
      camera: result.rows[0],
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
// Delete Camera
// ==============================
const deleteSurveillanceCamera = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM surveillance_cameras WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Camera Deleted Successfully",
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
  getSurveillanceCameras,
  getSurveillanceCamera,
  addSurveillanceCamera,
  updateSurveillanceCamera,
  deleteSurveillanceCamera,
};