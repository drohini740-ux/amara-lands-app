
const pool = require("../../config/db");

// GET: Fetch notifications for the logged-in user
const getSecurityNotifications = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User information is missing from the authentication token.",
      });
    }

    const result = await pool.query(
      `SELECT id, user_id, title, message, is_read, created_at
       FROM notifications
       WHERE user_id = $1 OR user_id IS NULL
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get security notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// PATCH: Mark a notification as read
const markSecurityNotificationRead = async (req, res) => {
  try {
    const userId = req.user?.id ?? req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User information is missing from the authentication token.",
      });
    }

    const result = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1
         AND (user_id = $2 OR user_id IS NULL)
       RETURNING id, title, message, is_read, created_at`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

module.exports = {
  getSecurityNotifications,
  markSecurityNotificationRead,
};
