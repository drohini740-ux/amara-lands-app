
const pool = require("../../config/db");

// GET all surveillance cameras
const getAllCameras = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        sc.*,
        p.property_name,
        p.survey_number,
        p.address,
        p.city
      FROM surveillance_cameras sc
      LEFT JOIN properties p ON sc.property_id = p.id
      ORDER BY sc.created_at DESC, sc.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Surveillance cameras fetched successfully.",
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get cameras error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch surveillance cameras.",
    });
  }
};

// GET one camera by ID
const getCameraById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera ID.",
      });
    }

    const result = await pool.query(
      `SELECT
         sc.*,
         p.property_name,
         p.survey_number,
         p.address,
         p.city
       FROM surveillance_cameras sc
       LEFT JOIN properties p ON sc.property_id = p.id
       WHERE sc.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surveillance camera not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get camera by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch camera details.",
    });
  }
};

// CREATE a surveillance camera
const createCamera = async (req, res) => {
  try {
    const {
      property_id,
      camera_name,
      camera_location,
      camera_type,
      status = "Active",
      installation_date,
      remarks,
    } = req.body;

    if (!property_id || !camera_name?.trim() || !camera_location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Property, camera name, and location are required.",
      });
    }

    if (!Number.isInteger(Number(property_id)) || Number(property_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid property.",
      });
    }

    if (!["Active", "Inactive", "Offline"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera status.",
      });
    }

    const propertyCheck = await pool.query(
      "SELECT id FROM properties WHERE id = $1",
      [property_id]
    );

    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Selected property was not found.",
      });
    }

    const result = await pool.query(
      `INSERT INTO surveillance_cameras
        (
          property_id,
          camera_name,
          camera_location,
          camera_type,
          status,
          installation_date,
          remarks
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        Number(property_id),
        camera_name.trim(),
        camera_location.trim(),
        camera_type?.trim() || "CCTV",
        status,
        installation_date || null,
        remarks?.trim() || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Surveillance camera created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create camera error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create surveillance camera.",
    });
  }
};

// UPDATE a surveillance camera
const updateCamera = async (req, res) => {
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

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera ID.",
      });
    }

    if (
      !property_id ||
      !camera_name?.trim() ||
      !camera_location?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Property, camera name, and location are required.",
      });
    }

    if (!Number.isInteger(Number(property_id)) || Number(property_id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid property.",
      });
    }

    if (!["Active", "Inactive", "Offline"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera status.",
      });
    }

    const result = await pool.query(
      `UPDATE surveillance_cameras
       SET property_id = $1,
           camera_name = $2,
           camera_location = $3,
           camera_type = $4,
           status = $5,
           installation_date = $6,
           remarks = $7
       WHERE id = $8
       RETURNING *`,
      [
        Number(property_id),
        camera_name.trim(),
        camera_location.trim(),
        camera_type?.trim() || "CCTV",
        status,
        installation_date || null,
        remarks?.trim() || null,
        Number(id),
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surveillance camera not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Surveillance camera updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update camera error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update surveillance camera.",
    });
  }
};

// DELETE a surveillance camera
const deleteCamera = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid camera ID.",
      });
    }

    const result = await pool.query(
      `DELETE FROM surveillance_cameras
       WHERE id = $1
       RETURNING id, camera_name`,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Surveillance camera not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Surveillance camera deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete camera error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete camera. Check whether motion alerts reference this camera.",
    });
  }
};

module.exports = {
  getAllCameras,
  getCameraById,
  createCamera,
  updateCamera,
  deleteCamera,
};
