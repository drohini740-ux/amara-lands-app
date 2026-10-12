
const pool = require("../../config/db");

// =====================================================
// GET MY PROFILE
// =====================================================

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

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
      "Field Executive Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE MY PROFILE
// =====================================================

const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      mobile,
      email,
    } = req.body;

    if (!full_name || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, mobile and email are required.",
      });
    }

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE (email = $1 OR mobile = $2)
        AND id != $3
      `,
      [email, mobile, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Email or mobile number is already in use.",
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
        mobile.trim(),
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
      "Field Executive Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};

