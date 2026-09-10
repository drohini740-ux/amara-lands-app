const pool = require("../../config/db");

// ======================================================
// GET ALL MOTION DETECTION ALERTS
// ======================================================
const getMotionDetectionAlerts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        mda.*,
        p.property_name,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type
      FROM motion_detection_alerts mda
      LEFT JOIN properties p
        ON mda.property_id = p.id
      JOIN surveillance_cameras sc
        ON mda.camera_id = sc.id
      ORDER BY mda.detected_at DESC
    `);

    // Prevent browser from returning 304
    res.set("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      alerts: result.rows,
    });
  } catch (err) {
    console.error("Get Motion Alerts Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const createMotionDetectionAlert = async (req, res) => {
  try {
    const {
      property_id,
      camera_id,
      alert_type,
      severity,
      detected_at,
      status,
      snapshot_url,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO motion_detection_alerts
      (
        property_id,
        camera_id,
        alert_type,
        severity,
        detected_at,
        status,
        snapshot_url,
        remarks
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        property_id,
        camera_id,
        alert_type,
        severity || "Medium",
        detected_at || new Date(),
        status || "New",
        snapshot_url,
        remarks,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Motion Detection Alert Created Successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Create Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// GET SINGLE MOTION DETECTION ALERT
// ======================================================
const getMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        mda.*,
        p.property_name,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type
      FROM motion_detection_alerts mda
      LEFT JOIN properties p
        ON mda.property_id = p.id
      JOIN surveillance_cameras sc
        ON mda.camera_id = sc.id
      WHERE mda.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion Detection Alert not found",
      });
    }

    res.json({
      success: true,
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Get Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// CREATE MOTION DETECTION ALERT
// ======================================================
const addMotionDetectionAlert = async (req, res) => {
  try {
    const {
      property_id,
      camera_id,
      alert_type,
      severity,
      detected_at,
      status,
      snapshot_url,
      remarks,
    } = req.body;

    if (!camera_id) {
      return res.status(400).json({
        success: false,
        message: "Camera is required",
      });
    }

    if (!alert_type) {
      return res.status(400).json({
        success: false,
        message: "Alert type is required",
      });
    }

    // Verify camera exists
    const cameraCheck = await pool.query(
      `
      SELECT id, property_id
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

    // If property_id is not supplied,
    // automatically take it from the camera
    const finalPropertyId =
      property_id || cameraCheck.rows[0].property_id;

    const result = await pool.query(
      `
      INSERT INTO motion_detection_alerts
      (
        property_id,
        camera_id,
        alert_type,
        severity,
        detected_at,
        status,
        snapshot_url,
        remarks
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        finalPropertyId,
        camera_id,
        alert_type,
        severity || "Medium",
        detected_at || new Date(),
        status || "New",
        snapshot_url || null,
        remarks || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Motion Detection Alert Added Successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Add Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// UPDATE MOTION DETECTION ALERT
// ======================================================
const updateMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_id,
      camera_id,
      alert_type,
      severity,
      detected_at,
      status,
      snapshot_url,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE motion_detection_alerts
      SET
        property_id = $1,
        camera_id = $2,
        alert_type = $3,
        severity = $4,
        detected_at = $5,
        status = $6,
        snapshot_url = $7,
        remarks = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        property_id || null,
        camera_id,
        alert_type,
        severity || "Medium",
        detected_at,
        status || "New",
        snapshot_url || null,
        remarks || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion Detection Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Motion Detection Alert Updated Successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Update Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================================
// DELETE MOTION DETECTION ALERT
// ======================================================
const deleteMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM motion_detection_alerts
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion Detection Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Motion Detection Alert Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// MARK ALERT AS RESOLVED
// ======================================================
const resolveMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE motion_detection_alerts
      SET status = 'Resolved'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion Detection Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Motion Detection Alert Resolved Successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Resolve Motion Alert Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ======================================================
// MARK ALERT AS ACKNOWLEDGED
// ======================================================
const acknowledgeMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE motion_detection_alerts
      SET status = 'Acknowledged'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion Detection Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Motion Detection Alert Acknowledged Successfully",
      alert: result.rows[0],
    });
  } catch (err) {
    console.error("Acknowledge Motion Alert Error:", err);

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
  getMotionDetectionAlerts,
  getMotionDetectionAlert,
  addMotionDetectionAlert,
  updateMotionDetectionAlert,
  deleteMotionDetectionAlert,
  resolveMotionDetectionAlert,
  createMotionDetectionAlert,
   acknowledgeMotionDetectionAlert,
};