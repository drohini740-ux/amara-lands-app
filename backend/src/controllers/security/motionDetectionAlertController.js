
const pool = require("../../config/db");

// Allowed alert statuses
const ALLOWED_STATUSES = [
  "New",
  "Acknowledged",
  "Resolved",
  "Dismissed",
];

// Reusable SQL query for alert details
const ALERT_DETAILS_QUERY = `
  SELECT
    mda.*,
    p.property_name,
    p.survey_number,
    p.address,
    p.city,
    p.state,
    sc.camera_name,
    sc.camera_location,
    sc.camera_type,
    sc.status AS camera_status
  FROM motion_detection_alerts mda
  LEFT JOIN properties p
    ON mda.property_id = p.id
  LEFT JOIN surveillance_cameras sc
    ON mda.camera_id = sc.id
`;

// =====================================================
// GET ALL MOTION DETECTION ALERTS
// GET /api/v1/security/motion-alerts
// Optional filters: status, severity, property_id
// =====================================================

const getMotionDetectionAlerts = async (req, res) => {
  try {
    const { status, severity, property_id } = req.query;

    let query = `
      ${ALERT_DETAILS_QUERY}
      WHERE 1 = 1
    `;

    const values = [];

    if (status) {
      values.push(status);
      query += ` AND mda.status = $${values.length}`;
    }

    if (severity) {
      values.push(severity);
      query += ` AND mda.severity = $${values.length}`;
    }

    if (property_id !== undefined) {
      if (
        !/^[1-9]\d*$/.test(String(property_id))
      ) {
        return res.status(400).json({
          success: false,
          message: "Property ID must be a positive integer.",
        });
      }

      values.push(Number(property_id));
      query += ` AND mda.property_id = $${values.length}`;
    }

    query += `
      ORDER BY mda.detected_at DESC NULLS LAST,
               mda.id DESC
    `;

    const result = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Motion detection alerts fetched successfully.",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get motion detection alerts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch motion detection alerts.",
    });
  }
};

// =====================================================
// GET MOTION DETECTION ALERT BY ID
// GET /api/v1/security/motion-alerts/:id
// =====================================================

const getMotionDetectionAlertById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(String(id))) {
      return res.status(400).json({
        success: false,
        message: "Alert ID must be a positive integer.",
      });
    }

    const query = `
      ${ALERT_DETAILS_QUERY}
      WHERE mda.id = $1
    `;

    const result = await pool.query(query, [Number(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion detection alert not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Motion detection alert fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get motion alert details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch motion detection alert details.",
    });
  }
};

// =====================================================
// UPDATE MOTION DETECTION ALERT
// PATCH /api/v1/security/motion-alerts/:id
// Body: { "status": "Acknowledged", "remarks": "..." }
// =====================================================

const updateMotionDetectionAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!/^[1-9]\d*$/.test(String(id))) {
      return res.status(400).json({
        success: false,
        message: "Alert ID must be a positive integer.",
      });
    }

    if (status === undefined && remarks === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide a status or remarks to update.",
      });
    }

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !ALLOWED_STATUSES.includes(status))
    ) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}.`,
      });
    }

    if (
      remarks !== undefined &&
      (typeof remarks !== "string" || remarks.length > 5000)
    ) {
      return res.status(400).json({
        success: false,
        message: "Remarks must be text with at most 5000 characters.",
      });
    }

    const values = [];
    const updates = [];

    if (status !== undefined) {
      values.push(status);
      updates.push(`status = $${values.length}`);
    }

    if (remarks !== undefined) {
      values.push(remarks);
      updates.push(`remarks = $${values.length}`);
    }

    values.push(Number(id));

    const updateQuery = `
      UPDATE motion_detection_alerts
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING id
    `;

    const updateResult = await pool.query(updateQuery, values);

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Motion detection alert not found.",
      });
    }

    // Return the updated alert with its property and camera details.
    const detailsQuery = `
      ${ALERT_DETAILS_QUERY}
      WHERE mda.id = $1
    `;

    const detailsResult = await pool.query(detailsQuery, [
      Number(id),
    ]);

    return res.status(200).json({
      success: true,
      message: "Motion detection alert updated successfully.",
      data: detailsResult.rows[0],
    });
  } catch (error) {
    console.error("Update motion detection alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update motion detection alert.",
    });
  }
};

const createMotionDetectionAlert = async (req, res) => {
  try {
    const {
      property_id,
      camera_id,
      alert_type,
      severity = "Medium",
      snapshot_url = null,
      remarks = null,
    } = req.body;

    // Validate required fields
    if (
      !camera_id ||
      !alert_type ||
      !String(alert_type).trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Camera and alert type are required.",
      });
    }

    const cameraId = Number(camera_id);

    if (!Number.isInteger(cameraId) || cameraId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera ID.",
      });
    }

    const allowedSeverities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    if (!allowedSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert severity.",
      });
    }

    // Check whether the camera exists
    const cameraResult = await pool.query(
      `SELECT id, property_id
       FROM surveillance_cameras
       WHERE id = $1`,
      [cameraId]
    );

    if (cameraResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found.",
      });
    }

    const camera = cameraResult.rows[0];

    // Make sure the selected property belongs to this camera
    if (
      property_id !== undefined &&
      property_id !== null &&
      property_id !== "" &&
      Number(property_id) !== Number(camera.property_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "The selected camera does not belong to this property.",
      });
    }

    // Create the alert
    const result = await pool.query(
      `INSERT INTO motion_detection_alerts
        (
          property_id,
          camera_id,
          alert_type,
          severity,
          status,
          snapshot_url,
          remarks
        )
       VALUES ($1, $2, $3, $4, 'New', $5, $6)
       RETURNING *`,
      [
        camera.property_id,
        cameraId,
        String(alert_type).trim(),
        severity,
        snapshot_url || null,
        remarks || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Motion detection alert created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create motion alert error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create motion detection alert.",
    });
  }
};

module.exports = {
  getMotionDetectionAlerts,
  getMotionDetectionAlertById,
  updateMotionDetectionAlert,
  createMotionDetectionAlert,
};
