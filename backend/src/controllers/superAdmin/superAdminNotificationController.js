const pool = require("../../config/db");

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getAllNotifications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        n.id,
        n.user_id,
        u.full_name,
        u.email,
        n.title,
        n.message,
        n.is_read,
        n.created_at,
        n.notification_type
      FROM notifications n
      LEFT JOIN users u
        ON n.user_id = u.id
      ORDER BY n.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully.",
      notifications: result.rows,
    });
  } catch (error) {
    console.error(
      "Get All Notifications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
      error: error.message,
    });
  }
};

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        n.id,
        n.user_id,
        u.full_name,
        u.email,
        n.title,
        n.message,
        n.is_read,
        n.created_at,
        n.notification_type
      FROM notifications n
      LEFT JOIN users u
        ON n.user_id = u.id
      WHERE n.id = $1
      `,
      [id]
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
      "Get Notification By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      title,
      message,
      notification_type,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    if (user_id) {
      const userResult = await pool.query(
        `
        SELECT id
        FROM users
        WHERE id = $1
        `,
        [user_id]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "User not found.",
        });
      }
    }

    const result = await pool.query(
      `
      INSERT INTO notifications (
        user_id,
        title,
        message,
        notification_type
      )
      VALUES ($1, $2, $3, $4)
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
        user_id || null,
        title.trim(),
        message.trim(),
        notification_type || "General",
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create notification.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE NOTIFICATION
// =====================================================

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      message,
      notification_type,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET
        title = $1,
        message = $2,
        notification_type = COALESCE(
          $3,
          notification_type
        )
      WHERE id = $4
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
        title.trim(),
        message.trim(),
        notification_type || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification updated successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification.",
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
    const { id } = req.params;
    const { is_read } = req.body;

    if (typeof is_read !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_read must be true or false.",
      });
    }

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = $1
      WHERE id = $2
      RETURNING
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      `,
      [is_read, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification read status updated successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Notification Read Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update notification read status.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
      RETURNING
        id,
        user_id,
        title,
        message,
        is_read,
        created_at,
        notification_type
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete Notification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  updateNotificationReadStatus,
  deleteNotification,
};