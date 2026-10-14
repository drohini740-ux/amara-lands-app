
const pool = require("../../config/db");

// =====================================================
// GET MY SUPER ADMIN PROFILE
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
        AND role = 'super_admin'
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Super Admin profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Super Admin profile fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Super Admin Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Super Admin profile.",
    });
  }
};

// =====================================================
// UPDATE MY SUPER ADMIN PROFILE
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

    const { full_name, mobile, email } = req.body;

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

    const normalizedEmail = email.trim().toLowerCase();

    // Basic email format validation.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check whether another user already uses this email.
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = $1
        AND id != $2
      LIMIT 1
      `,
      [normalizedEmail, userId]
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
        AND role = 'super_admin'
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
        normalizedEmail,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Super Admin profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Super Admin profile updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Super Admin Update Profile Error:", error);

    // PostgreSQL unique constraint violation.
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update Super Admin profile.",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};
