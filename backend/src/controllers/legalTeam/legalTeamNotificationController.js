
const pool = require("../../config/db");

// =====================================================
// GET LEGAL TEAM NOTIFICATIONS
// =====================================================

const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "Legal Team notifications fetched successfully.",
      notifications: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

const getNotificationById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      FROM notifications
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification fetched successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Legal Team Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification.",
    });
  }
};

// =====================================================
// MARK NOTIFICATION AS READ
// =====================================================

const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Mark Legal Team Notification Read Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
    });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  markNotificationAsRead,
};

