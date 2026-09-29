const pool = require("../../config/db");
const bcrypt = require("bcryptjs");

// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        created_at,
        updated_at
      FROM users
      ORDER BY id DESC
    `);

    return res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("SUPER ADMIN GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {
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
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("SUPER ADMIN GET USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

// =====================================================
// ADD USER
// =====================================================

const addUser = async (req, res) => {
  try {
    const {
      full_name,
      mobile,
      email,
      password,
      role,
      status,
    } = req.body;

    // -------------------------------------------------
    // Validation
    // -------------------------------------------------

    if (
      !full_name ||
      !mobile ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, mobile, email, password and role are required.",
      });
    }

    // -------------------------------------------------
    // Check existing email/mobile
    // -------------------------------------------------

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
         OR mobile = $2
      `,
      [email, mobile]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email or Mobile already exists.",
      });
    }

    // -------------------------------------------------
    // Hash password
    // -------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -------------------------------------------------
    // Create user
    // -------------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO users
      (
        full_name,
        mobile,
        email,
        password,
        role,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        created_at
      `,
      [
        full_name,
        mobile,
        email,
        hashedPassword,
        role,
        status || "active",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User added successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("SUPER ADMIN ADD USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add user.",
    });
  }
};

// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      mobile,
      role,
      status,
    } = req.body;

    // -------------------------------------------------
    // Check user exists
    // -------------------------------------------------

    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // -------------------------------------------------
    // Check duplicate email/mobile
    // -------------------------------------------------

    const duplicateUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE (email = $1 OR mobile = $2)
        AND id != $3
      `,
      [
        email,
        mobile,
        req.params.id,
      ]
    );

    if (duplicateUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Another user already has this email or mobile.",
      });
    }

    // -------------------------------------------------
    // Update
    // -------------------------------------------------

    const result = await pool.query(
      `
      UPDATE users
      SET
        full_name = $1,
        email = $2,
        mobile = $3,
        role = $4,
        status = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        created_at,
        updated_at
      `,
      [
        full_name,
        email,
        mobile,
        role,
        status,
        req.params.id,
      ]
    );

    return res.json({
      success: true,
      message: "User updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("SUPER ADMIN UPDATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
};

// =====================================================
// UPDATE USER STATUS
// =====================================================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        updated_at
      `,
      [
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User status updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN UPDATE STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};

// =====================================================
// UPDATE USER ROLE
// =====================================================

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE users
      SET
        role = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        updated_at
      `,
      [
        role,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User role updated successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN UPDATE ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    // -------------------------------------------------
    // Prevent Super Admin from deleting itself
    // -------------------------------------------------

    if (Number(req.user?.id) === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id, full_name, email
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "User deleted successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("SUPER ADMIN DELETE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters.",
      });
    }

    const userExists = await pool.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        updated_at = NOW()
      WHERE id = $2
      `,
      [
        hashedPassword,
        req.params.id,
      ]
    );

    return res.json({
      success: true,
      message: "User password reset successfully.",
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to reset user password.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
};