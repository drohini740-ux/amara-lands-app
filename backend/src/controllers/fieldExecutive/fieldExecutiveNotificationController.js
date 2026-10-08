
const pool = require("../../config/db");

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

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

    res.status(200).json({
      success: true,
      message:
        "Field Executive notifications fetched successfully.",
      notifications: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Field Executive Notifications Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch notifications.",
      error: error.message,
    });
  }
};

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

const getNotificationById = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

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
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification fetched successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Field Executive Notification By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch notification.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      message,
      notification_type,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification title is required.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO notifications
      (
        user_id,
        title,
        message,
        is_read,
        notification_type
      )
      VALUES
      (
        $1,
        $2,
        $3,
        FALSE,
        $4
      )
      RETURNING
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      `,
      [
        userId,
        title.trim(),
        message.trim(),
        notification_type?.trim() ||
          "general",
      ]
    );

    res.status(201).json({
      success: true,
      message:
        "Notification created successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Field Executive Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create notification.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE READ STATUS
// =====================================================

const updateNotificationReadStatus = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const { is_read } = req.body;

    if (typeof is_read !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "is_read must be true or false.",
      });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = $1
      WHERE id = $2
        AND user_id = $3
      RETURNING
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      `,
      [
        is_read,
        notificationId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: is_read
        ? "Notification marked as read."
        : "Notification marked as unread.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Field Executive Notification Read Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update notification read status.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
        AND user_id = $2
      RETURNING id
      `,
      [notificationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully.",
      notification_id: result.rows[0].id,
    });
  } catch (error) {
    console.error(
      "Delete Field Executive Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete notification.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getMyNotifications,
  getNotificationById,
  createNotification,
  updateNotificationReadStatus,
  deleteNotification,
};

