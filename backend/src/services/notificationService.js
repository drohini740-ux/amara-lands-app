const pool = require("../config/db");

const createNotification = async (
  userId,
  title,
  message,
  notificationType
) => {
  try {
    await pool.query(
      `INSERT INTO notifications
      (user_id, title, message, notification_type)
      VALUES ($1,$2,$3,$4)`,
      [userId, title, message, notificationType]
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNotification,
};