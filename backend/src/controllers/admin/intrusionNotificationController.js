const pool = require("../../config/db");

// ======================================================
// GET ALL INTRUSION NOTIFICATIONS
// ======================================================
const getIntrusionNotifications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        inot.*,
        p.property_name,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status AS camera_status
      FROM intrusion_notifications inot
      LEFT JOIN properties p
        ON inot.property_id = p.id
      JOIN surveillance_cameras sc
        ON inot.camera_id = sc.id
      ORDER BY inot.detected_at DESC
    `);

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      notifications: result.rows,
    });
  } catch (err) {
    console.error("Get Intrusion Notifications Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// GET SINGLE INTRUSION NOTIFICATION
// ======================================================
const getIntrusionNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        inot.*,
        p.property_name,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status AS camera_status
      FROM intrusion_notifications inot
      LEFT JOIN properties p
        ON inot.property_id = p.id
      JOIN surveillance_cameras sc
        ON inot.camera_id = sc.id
      WHERE inot.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification: result.rows[0],
    });
  } catch (err) {
    console.error("Get Intrusion Notification Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// CREATE INTRUSION NOTIFICATION
// ======================================================
const createIntrusionNotification = async (req, res) => {
  try {
    const {
      property_id,
      camera_id,
      notification_type,
      severity,
      message,
      status,
      snapshot_url,
      detected_at,
    } = req.body;

    // Validate camera
    if (!camera_id) {
      return res.status(400).json({
        success: false,
        message: "Camera is required",
      });
    }

    // Validate notification type
    if (!notification_type) {
      return res.status(400).json({
        success: false,
        message: "Notification type is required",
      });
    }

    // Check camera
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

    // Automatically get property from camera
    const finalPropertyId =
      property_id || cameraCheck.rows[0].property_id;

    const result = await pool.query(
      `
      INSERT INTO intrusion_notifications
      (
        property_id,
        camera_id,
        notification_type,
        severity,
        message,
        status,
        snapshot_url,
        detected_at
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [
        finalPropertyId,
        camera_id,
        notification_type,
        severity || "Medium",
        message || null,
        status || "New",
        snapshot_url || null,
        detected_at || new Date(),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Intrusion Notification Created Successfully",
      notification: result.rows[0],
    });
  } catch (err) {
    console.error("Create Intrusion Notification Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// UPDATE INTRUSION NOTIFICATION
// ======================================================
const updateIntrusionNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_id,
      camera_id,
      notification_type,
      severity,
      message,
      status,
      snapshot_url,
      detected_at,
    } = req.body;

    if (!camera_id) {
      return res.status(400).json({
        success: false,
        message: "Camera is required",
      });
    }

    if (!notification_type) {
      return res.status(400).json({
        success: false,
        message: "Notification type is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE intrusion_notifications
      SET
        property_id = $1,
        camera_id = $2,
        notification_type = $3,
        severity = $4,
        message = $5,
        status = $6,
        snapshot_url = $7,
        detected_at = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        property_id || null,
        camera_id,
        notification_type,
        severity || "Medium",
        message || null,
        status || "New",
        snapshot_url || null,
        detected_at || new Date(),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Intrusion Notification Updated Successfully",
      notification: result.rows[0],
    });
  } catch (err) {
    console.error("Update Intrusion Notification Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// ACKNOWLEDGE INTRUSION NOTIFICATION
// ======================================================
const acknowledgeIntrusionNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE intrusion_notifications
      SET status = 'Acknowledged'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Intrusion Notification Acknowledged Successfully",
      notification: result.rows[0],
    });
  } catch (err) {
    console.error(
      "Acknowledge Intrusion Notification Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// RESOLVE INTRUSION NOTIFICATION
// ======================================================
const resolveIntrusionNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE intrusion_notifications
      SET status = 'Resolved'
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Intrusion Notification Resolved Successfully",
      notification: result.rows[0],
    });
  } catch (err) {
    console.error("Resolve Intrusion Notification Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// DELETE INTRUSION NOTIFICATION
// ======================================================
const deleteIntrusionNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM intrusion_notifications
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intrusion Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Intrusion Notification Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Intrusion Notification Error:", err);

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
  getIntrusionNotifications,
  getIntrusionNotification,
  createIntrusionNotification,
  updateIntrusionNotification,
  acknowledgeIntrusionNotification,
  resolveIntrusionNotification,
  deleteIntrusionNotification,
};