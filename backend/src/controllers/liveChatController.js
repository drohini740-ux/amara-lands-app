const pool = require("../config/db");

// Get Messages
const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM live_chat
       WHERE user_id=$1
       ORDER BY created_at ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching chat." });
  }
};

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    const result = await pool.query(
      `INSERT INTO live_chat(user_id,sender,message)
       VALUES($1,$2,$3)
       RETURNING *`,
      [req.user.id, "User", message]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message." });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};