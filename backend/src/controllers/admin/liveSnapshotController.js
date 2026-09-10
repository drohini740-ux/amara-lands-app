const pool = require("../../config/db");

// ======================================================
// GET ALL LIVE SNAPSHOTS
// ======================================================
const getLiveSnapshots = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        cs.id,
        cs.camera_id,
        cs.snapshot_url,
        cs.captured_at,
        cs.remarks,

        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status AS camera_status,

        p.id AS property_id,
        p.property_name

      FROM camera_snapshots cs

      JOIN surveillance_cameras sc
        ON cs.camera_id = sc.id

      LEFT JOIN properties p
        ON sc.property_id = p.id

      ORDER BY cs.captured_at DESC
    `);

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      snapshots: result.rows,
    });
  } catch (err) {
    console.error("Get Live Snapshots Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// GET SINGLE SNAPSHOT
// ======================================================
const getLiveSnapshot = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        cs.id,
        cs.camera_id,
        cs.snapshot_url,
        cs.captured_at,
        cs.remarks,

        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status AS camera_status,

        p.id AS property_id,
        p.property_name

      FROM camera_snapshots cs

      JOIN surveillance_cameras sc
        ON cs.camera_id = sc.id

      LEFT JOIN properties p
        ON sc.property_id = p.id

      WHERE cs.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Snapshot not found",
      });
    }

    res.status(200).json({
      success: true,
      snapshot: result.rows[0],
    });
  } catch (err) {
    console.error("Get Live Snapshot Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// CREATE SNAPSHOT
// ======================================================
const createLiveSnapshot = async (req, res) => {
  try {
    const {
      camera_id,
      snapshot_url,
      captured_at,
      remarks,
    } = req.body;

    // Validate camera
    if (!camera_id) {
      return res.status(400).json({
        success: false,
        message: "Camera is required",
      });
    }

    // Validate snapshot URL
    if (!snapshot_url) {
      return res.status(400).json({
        success: false,
        message: "Snapshot URL is required",
      });
    }

    // Check camera exists
    const cameraCheck = await pool.query(
      `
      SELECT id
      FROM surveillance_cameras
      WHERE id = $1
      `,
      [camera_id]
    );

    if (cameraCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO camera_snapshots
      (
        camera_id,
        snapshot_url,
        captured_at,
        remarks
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [
        camera_id,
        snapshot_url,
        captured_at || new Date(),
        remarks || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Live Snapshot Created Successfully",
      snapshot: result.rows[0],
    });
  } catch (err) {
    console.error("Create Live Snapshot Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// DELETE SNAPSHOT
// ======================================================
const deleteLiveSnapshot = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM camera_snapshots
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Snapshot not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Live Snapshot Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Live Snapshot Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================
module.exports = {
  getLiveSnapshots,
  getLiveSnapshot,
  createLiveSnapshot,
  deleteLiveSnapshot,
};