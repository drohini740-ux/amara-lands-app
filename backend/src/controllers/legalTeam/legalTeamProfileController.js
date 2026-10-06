
const pool = require("../../config/db");

// =====================================================
// GET MY PROFILE
// =====================================================

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        profile_image,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Legal Team Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE MY PROFILE
// =====================================================

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required.",
      });
    }

    const {
      full_name,
      mobile,
      email,
    } = req.body;

    if (!full_name || !full_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check whether another user already
    // uses this email.
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER($1)
        AND id != $2
      LIMIT 1
      `,
      [email.trim(), userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        mobile = $2,
        email = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        profile_image,
        created_at
      `,
      [
        full_name.trim(),
        mobile?.trim() || null,
        email.trim(),
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Legal Team Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};

