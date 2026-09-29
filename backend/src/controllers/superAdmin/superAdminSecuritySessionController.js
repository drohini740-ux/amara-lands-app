
const pool = require("../../config/db");

// =====================================================
// GET ALL USER SESSIONS
// =====================================================

const getAllSessions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.user_id,
        u.full_name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        s.ip_address,
        s.user_agent,
        s.device_name,
        s.login_at,
        s.last_activity_at,
        s.logout_at,
        s.expires_at,
        s.status,
        s.created_at,
        s.updated_at
      FROM user_sessions s
      LEFT JOIN users u
        ON s.user_id = u.id
      ORDER BY s.login_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "User sessions fetched successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Get User Sessions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user sessions.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SESSION BY ID
// =====================================================

const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.user_id,
        u.full_name AS user_name,
        u.email AS user_email,
        u.role AS user_role,
        s.ip_address,
        s.user_agent,
        s.device_name,
        s.login_at,
        s.last_activity_at,
        s.logout_at,
        s.expires_at,
        s.status,
        s.created_at,
        s.updated_at
      FROM user_sessions s
      LEFT JOIN users u
        ON s.user_id = u.id
      WHERE s.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User session not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User session fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get User Session Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user session.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SESSION STATUS
// =====================================================

const updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Session status is required.",
      });
    }

    const allowedStatuses = [
      "active",
      "logged_out",
      "expired",
      "revoked",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid session status.",
      });
    }

    const existingResult = await pool.query(
      `
      SELECT *
      FROM user_sessions
      WHERE id = $1
      `,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User session not found.",
      });
    }

    let logoutAt = null;

    if (
      status === "logged_out" ||
      status === "revoked"
    ) {
      logoutAt = new Date();
    }

    const result = await pool.query(
      `
      UPDATE user_sessions
      SET
        status = $1,
        logout_at = COALESCE($2, logout_at),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
      `,
      [status, logoutAt, id]
    );

    return res.status(200).json({
      success: true,
      message:
        "User session status updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update User Session Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user session status.",
      error: error.message,
    });
  }
};

// =====================================================
// FORCE LOGOUT SESSION
// =====================================================

const forceLogoutSession = async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult = await pool.query(
      `
      SELECT *
      FROM user_sessions
      WHERE id = $1
      `,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User session not found.",
      });
    }

    const result = await pool.query(
      `
      UPDATE user_sessions
      SET
        status = 'revoked',
        logout_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message:
        "User session forcefully logged out.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Force Logout Session Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to force logout user session.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SESSION
// =====================================================

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM user_sessions
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User session not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User session deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete User Session Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete user session.",
      error: error.message,
    });
  }
};
const createSession = async (req, res) => {
  try {
    const {
      user_id,
      session_token,
      ip_address,
      user_agent,
      device_name,
      login_at,
      last_activity_at,
      expires_at,
      status,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO user_sessions (
        user_id,
        session_token,
        ip_address,
        user_agent,
        device_name,
        login_at,
        last_activity_at,
        expires_at,
        status
      )
      VALUES (
        $1, $2, $3, $4, $5,
        COALESCE($6, CURRENT_TIMESTAMP),
        COALESCE($7, CURRENT_TIMESTAMP),
        $8,
        COALESCE($9, 'active')
      )
      RETURNING *
      `,
      [
        user_id,
        session_token || null,
        ip_address || null,
        user_agent || null,
        device_name || null,
        login_at || null,
        last_activity_at || null,
        expires_at || null,
        status || "active",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User session created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create User Session Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create user session.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSessionStatus,
  forceLogoutSession,
  deleteSession,
};

