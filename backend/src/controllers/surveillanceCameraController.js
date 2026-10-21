
const pool = require("../config/db");

// Check whether a customer owns the property.
const checkPropertyAccess = async (propertyId, userId, userRole) => {
  if (userRole !== "customer") {
    return true;
  }

  const result = await pool.query(
    "SELECT id FROM properties WHERE id = $1 AND user_id = $2",
    [propertyId, userId]
  );

  return result.rows.length > 0;
};

// ==============================
// Get All Cameras
// ==============================
const getSurveillanceCameras = async (req, res) => {
  try {
    let query = `
      SELECT
        sc.*,
        p.property_name,
        u.full_name AS user_name
      FROM surveillance_cameras sc
      JOIN properties p ON sc.property_id = p.id
      JOIN users u ON sc.user_id = u.id
    `;

    const values = [];

    if (req.user.role === "customer") {
      query += " WHERE p.user_id = $1";
      values.push(req.user.id);
    }

    query += " ORDER BY sc.created_at DESC";

    const result = await pool.query(query, values);

    res.json({
      success: true,
      cameras: result.rows,
    });
  } catch (err) {
    console.error("Get surveillance cameras error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch surveillance cameras.",
    });
  }
};

// ==============================
// Get Single Camera
// ==============================
const getSurveillanceCamera = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT
        sc.*,
        p.property_name,
        u.full_name AS user_name
      FROM surveillance_cameras sc
      JOIN properties p ON sc.property_id = p.id
      JOIN users u ON sc.user_id = u.id
      WHERE sc.id = $1
    `;

    const values = [id];

    if (req.user.role === "customer") {
      query += " AND p.user_id = $2";
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found.",
      });
    }

    res.json({
      success: true,
      camera: result.rows[0],
    });
  } catch (err) {
    console.error("Get surveillance camera error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch camera.",
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

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
    }

    const hasAccess = await checkPropertyAccess(
      property_id,
      req.user.id,
      req.user.role
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You cannot add a camera to a property you do not own.",
      });
    }

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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      message: "Camera added successfully.",
      camera: result.rows[0],
    });
  } catch (err) {
    console.error("Add surveillance camera error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to add camera.",
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

    // Confirm the camera belongs to an accessible property.
    let existingQuery = `
      SELECT sc.id
      FROM surveillance_cameras sc
      JOIN properties p ON sc.property_id = p.id
      WHERE sc.id = $1
    `;

    const existingValues = [id];

    if (req.user.role === "customer") {
      existingQuery += " AND p.user_id = $2";
      existingValues.push(req.user.id);
    }

    const existing = await pool.query(existingQuery, existingValues);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found.",
      });
    }

    // Verify access if the camera is being moved to another property.
    if (property_id !== undefined) {
      const hasAccess = await checkPropertyAccess(
        property_id,
        req.user.id,
        req.user.role
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "You cannot assign a camera to a property you do not own.",
        });
      }
    }

    const result = await pool.query(
      `
      UPDATE surveillance_cameras
      SET
        property_id = COALESCE($1, property_id),
        camera_name = COALESCE($2, camera_name),
        camera_location = COALESCE($3, camera_location),
        camera_type = COALESCE($4, camera_type),
        status = COALESCE($5, status),
        installation_date = COALESCE($6, installation_date),
        remarks = COALESCE($7, remarks)
      WHERE id = $8
      RETURNING *
      `,
      [
        property_id ?? null,
        camera_name ?? null,
        camera_location ?? null,
        camera_type ?? null,
        status ?? null,
        installation_date ?? null,
        remarks ?? null,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Camera updated successfully.",
      camera: result.rows[0],
    });
  } catch (err) {
    console.error("Update surveillance camera error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update camera.",
    });
  }
};

// ==============================
// Delete Camera
// ==============================
const deleteSurveillanceCamera = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      DELETE FROM surveillance_cameras sc
      USING properties p
      WHERE sc.property_id = p.id
        AND sc.id = $1
    `;

    const values = [id];

    if (req.user.role === "customer") {
      query += " AND p.user_id = $2";
      values.push(req.user.id);
    }

    query += " RETURNING sc.id";

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Camera not found.",
      });
    }

    res.json({
      success: true,
      message: "Camera deleted successfully.",
    });
  } catch (err) {
    console.error("Delete surveillance camera error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete camera.",
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
