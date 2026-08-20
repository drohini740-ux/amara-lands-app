const pool = require("../../config/db");
const { getIO } = require("../../socket");

// ===========================
// Get All Properties - Admin
// ===========================
const getAllProperties = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.user_id,
        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,
        p.created_at,
        p.verified_by,

        u.full_name AS owner_name,
        u.email AS owner_email,
        u.mobile AS owner_mobile

      FROM properties p

      LEFT JOIN users u
        ON p.user_id = u.id

      ORDER BY p.id DESC
    `);

    res.json({
      success: true,
      properties: result.rows,
    });
  } catch (error) {
    console.error("Get All Properties Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Get Property By ID - Admin
// ===========================
const getPropertyById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.user_id,
        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,
        p.created_at,
        p.verified_by,

        u.full_name AS owner_name,
        u.email AS owner_email,
        u.mobile AS owner_mobile

      FROM properties p

      LEFT JOIN users u
        ON p.user_id = u.id

      WHERE p.id = $1
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    res.json({
      success: true,
      property: result.rows[0],
    });
  } catch (error) {
    console.error("Get Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Update Property - Admin
// ===========================
const updateProperty = async (req, res) => {
  try {
    const {
      property_name,
      survey_number,
      property_type,
      area,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE properties
      SET
        property_name = $1,
        survey_number = $2,
        property_type = $3,
        area = $4,
        address = $5,
        city = $6,
        state = $7,
        pincode = $8,
        latitude = $9,
        longitude = $10

      WHERE id = $11

      RETURNING *
      `,
      [
        property_name,
        survey_number,
        property_type,
        area,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        req.params.id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    res.json({
      success: true,
      message: "Property Updated Successfully",
      property: result.rows[0],
    });
  } catch (error) {
    console.error("Update Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Delete Property - Admin
// ===========================
const deleteProperty = async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM properties
      WHERE id = $1
      RETURNING *
      `,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    res.json({
      success: true,
      message: "Property Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Update Verification Status
// ===========================
const updateVerificationStatus = async (req, res) => {
  try {
    const { verification_status } = req.body;
    const propertyId = req.params.id;

    const allowedStatuses = ["Pending", "Verified", "Rejected"];

    if (!allowedStatuses.includes(verification_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status",
      });
    }

    // Get property owner
    const propertyResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        property_name,
        verification_status
      FROM properties
      WHERE id = $1
      `,
      [propertyId],
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property Not Found",
      });
    }

    const property = propertyResult.rows[0];

    // Update property verification status
    const result = await pool.query(
      `
      UPDATE properties
      SET
        verification_status = $1,
        verified_by = $2
      WHERE id = $3
      RETURNING *
      `,
      [verification_status, req.user.id, propertyId],
    );

    // Create customer notification
    const notificationResult = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        title,
        message,
        notification_type
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        property.user_id,
        "Property Verification Updated",
        `Your property "${property.property_name}" has been ${verification_status}.`,
        "Property Verification",
      ],
    );

    const notification = notificationResult.rows[0];

    // Send real-time notification
    const io = getIO();

    io.to(`user_${property.user_id}`).emit("newNotification", notification);

    res.json({
      success: true,
      message: "Verification Status Updated Successfully",
      property: result.rows[0],
    });
  } catch (error) {
    console.error("Verification Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updateVerificationStatus,
};
