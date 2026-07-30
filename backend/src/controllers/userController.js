const pool = require("../config/db");
const bcrypt = require("bcryptjs");


// Get Profile
const getProfile = async (req, res) => {
  try {
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
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { full_name, email, mobile } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        mobile = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [full_name, email, mobile, req.user.id]
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const uploadProfileImage = async (req, res) => {
  try {
    console.log("========== FILE ==========");
    console.log(req.headers["content-type"]);
    console.log(req.file);
    console.log(req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file received",
      });
    }

    const image = "/uploads/" + req.file.filename;

    const result = await pool.query(
      `
      UPDATE users
      SET profile_image = $1
      WHERE id = $2
      RETURNING *
      `,
      [image, req.user.id]
    );

    console.log(result.rows[0]);

    return res.status(200).json({
      success: true,
      message: "Profile image updated",
      profile_image: image,
      user: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE id=$1",
      [req.user.id]
    );

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users
       SET password=$1
       WHERE id=$2`,
      [hashedPassword, req.user.id]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
module.exports = {
  getProfile,
  updateProfile,
   uploadProfileImage,
    changePassword,
};