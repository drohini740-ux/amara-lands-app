
const { getIO } = require("../socket");
const pool = require("../config/db");

// Create Notification
// Create Notification
const addNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      notification_type,
    } = req.body;

    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO notifications
      (user_id, title, message, notification_type)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [
        user_id,
        title,
        message,
        notification_type,
      ]
    );

    // Send real-time notification
    getIO().emit("newNotification", result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Notification Created Successfully",
      notification: result.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// Get All Notifications
const getNotifications = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM notifications
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      notifications: result.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Get Single Notification
const getNotification = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM notifications
       WHERE id=$1`,
      [req.params.id]
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

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Mark as Read
const markAsRead = async (req, res) => {
  try {

    const result = await pool.query(
      `UPDATE notifications
       SET is_read=true
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Notification Marked as Read",
      notification: result.rows[0],
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {

    await pool.query(
      "DELETE FROM notifications WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Notification Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

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
  deleteNotification,
};