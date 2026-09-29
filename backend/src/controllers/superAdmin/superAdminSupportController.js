const pool = require("../../config/db");

// =====================================================
// GET ALL SUPPORT TICKETS
// =====================================================
const getAllSupportTickets = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        st.id,
        st.user_id,
        st.subject,
        st.description,
        st.status,
        st.priority,
        st.created_at,
        st.updated_at,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email,
        u.role AS user_role

      FROM support_tickets st

      LEFT JOIN users u
        ON st.user_id = u.id

      ORDER BY st.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Support tickets fetched successfully.",
      tickets: result.rows,
    });
  } catch (error) {
    console.error("Get Support Tickets Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SUPPORT TICKET BY ID
// =====================================================
const getSupportTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        st.id,
        st.user_id,
        st.subject,
        st.description,
        st.status,
        st.priority,
        st.created_at,
        st.updated_at,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email,
        u.role AS user_role

      FROM support_tickets st

      LEFT JOIN users u
        ON st.user_id = u.id

      WHERE st.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket fetched successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error("Get Support Ticket By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch support ticket.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TICKET STATUS
// =====================================================
const updateSupportTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE support_tickets
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        user_id,
        subject,
        description,
        status,
        priority,
        created_at,
        updated_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket status updated successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Support Ticket Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update support ticket status.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TICKET PRIORITY
// =====================================================
const updateSupportTicketPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!priority) {
      return res.status(400).json({
        success: false,
        message: "Priority is required.",
      });
    }

    const allowedPriorities = [
      "Low",
      "Medium",
      "High",
      "Critical",
    ];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority.",
      });
    }

    const result = await pool.query(
      `
      UPDATE support_tickets
      SET
        priority = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        user_id,
        subject,
        description,
        status,
        priority,
        created_at,
        updated_at
      `,
      [priority, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Support ticket not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Support ticket priority updated successfully.",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Support Ticket Priority Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update support ticket priority.",
      error: error.message,
    });
  }
};

// =====================================================
// GET WHATSAPP SUPPORT
// =====================================================
const getWhatsAppSupport = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        support_name,
        phone_number,
        welcome_message,
        status,
        created_at
      FROM whatsapp_support
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "WhatsApp support details fetched successfully.",
      support: result.rows,
    });
  } catch (error) {
    console.error(
      "Get WhatsApp Support Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch WhatsApp support details.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE WHATSAPP SUPPORT
// =====================================================
const updateWhatsAppSupport = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      support_name,
      phone_number,
      welcome_message,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE whatsapp_support
      SET
        support_name = COALESCE($1, support_name),
        phone_number = COALESCE($2, phone_number),
        welcome_message = COALESCE($3, welcome_message),
        status = COALESCE($4, status)
      WHERE id = $5
      RETURNING
        id,
        support_name,
        phone_number,
        welcome_message,
        status,
        created_at
      `,
      [
        support_name,
        phone_number,
        welcome_message,
        status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "WhatsApp support record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "WhatsApp support updated successfully.",
      support: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update WhatsApp Support Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update WhatsApp support.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  updateSupportTicketPriority,
  getWhatsAppSupport,
  updateWhatsAppSupport,
};