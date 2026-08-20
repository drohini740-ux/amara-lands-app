const { getIO } = require("../socket");
const pool = require("../config/db");

// ===========================
// Create Notification
// ===========================
const addNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      notification_type,
    } = req.body;

    const user_id = req.user.id;

    const result = await pool.query(
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
        user_id,
        title,
        message,
        notification_type,
      ]
    );

    const notification = result.rows[0];

    // Send real-time notification
    getIO()
      .to(`user_${user_id}`)
      .emit("newNotification", notification);

    res.status(201).json({
      success: true,
      message: "Notification Created Successfully",
      notification,
    });
  } catch (error) {
    console.error("Add Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ===========================
// Get All Notifications
// ===========================
const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({
      success: true,
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ===========================
// Get Single Notification
// ===========================
const getNotification = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM notifications
      WHERE id = $1
        AND user_id = $2
      `,
      [
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    res.json({
      success: true,
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Get Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Mark All Notifications as Read
// ===========================
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1
        AND is_read = false
      RETURNING *
      `,
      [userId]
    );

    res.json({
      success: true,
      message: "All Notifications Marked as Read",
      notifications: result.rows,
    });
  } catch (error) {
    console.error("Mark All Notifications Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ===========================
// Mark Notification as Read
// ===========================
const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [
        notificationId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    res.json({
      success: true,
      message: "Notification Marked as Read",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Mark Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ===========================
// Delete Notification
// ===========================
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM notifications
      WHERE id = $1
        AND user_id = $2
      RETURNING *
      `,
      [
        notificationId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification Not Found",
      });
    }

    res.json({
      success: true,
      message: "Notification Deleted Successfully",
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  addNotification,
  getNotifications,
  getNotification,
  markAsRead,
    markAllAsRead,
  deleteNotification,
};