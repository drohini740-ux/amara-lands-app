const pool = require("../../config/db");

// ======================================================
// GET ALL LIVE CAMERA FEEDS
// ======================================================
const getLiveCameraFeeds = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sc.id,
        sc.property_id,
        sc.user_id,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status,
        sc.installation_date,
        sc.remarks,
        sc.created_at,
        p.property_name
      FROM surveillance_cameras sc
      LEFT JOIN properties p
        ON sc.property_id = p.id
      ORDER BY sc.id DESC
    `);

    res.set("Cache-Control", "no-store");

    res.status(200).json({
      success: true,
      cameras: result.rows,
    });
  } catch (err) {
    console.error("Get Live Camera Feeds Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================================
// GET SINGLE LIVE CAMERA FEED
// ======================================================
const getLiveCameraFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        sc.id,
        sc.property_id,
        sc.user_id,
        sc.camera_name,
        sc.camera_location,
        sc.camera_type,
        sc.status,
        sc.installation_date,
        sc.remarks,
        sc.created_at,
        p.property_name
      FROM surveillance_cameras sc
      LEFT JOIN properties p
        ON sc.property_id = p.id
      WHERE sc.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found",
      });
    }

    res.status(200).json({
      success: true,
      camera: result.rows[0],
    });
  } catch (err) {
    console.error("Get Live Camera Feed Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getLiveCameraFeeds,
  getLiveCameraFeed,
};