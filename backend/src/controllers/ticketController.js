const pool = require("../config/db");

// ==============================
// Get All Tickets
// ==============================
const getTickets = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        st.*,
        u.full_name AS user_name
      FROM support_tickets st
      LEFT JOIN users u
        ON st.user_id = u.id
      ORDER BY st.created_at DESC
    `);

    res.json({
      success: true,
      tickets: result.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get Single Ticket
// ==============================
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM support_tickets WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      ticket: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Add Ticket
// ==============================
const addTicket = async (req, res) => {
  try {

    const {
      subject,
      description,
      priority,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO support_tickets
      (
        user_id,
        subject,
        description,
        priority,
        status
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        req.user.id,
        subject,
        description,
        priority,
        status || "Open",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Ticket Created Successfully",
      ticket: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Update Ticket
// ==============================
const updateTicket = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      subject,
      description,
      priority,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE support_tickets
      SET
        subject=$1,
        description=$2,
        priority=$3,
        status=$4,
        updated_at=NOW()
      WHERE id=$5
      RETURNING *
      `,
      [
        subject,
        description,
        priority,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      message: "Ticket Updated Successfully",
      ticket: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// Delete Ticket
// ==============================
const deleteTicket = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM support_tickets WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      message: "Ticket Deleted Successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getTickets,
  getTicket,
  addTicket,
  updateTicket,
  deleteTicket,
};