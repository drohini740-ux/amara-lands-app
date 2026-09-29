const pool = require("../../config/db");

// ======================================================
// GET ALL FAQS
// ======================================================

const getAllFaqs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        question,
        answer,
        status,
        created_at
      FROM faqs
      ORDER BY id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully.",
      faqs: result.rows,
    });
  } catch (error) {
    console.error("Get All FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs.",
      error: error.message,
    });
  }
};

// ======================================================
// GET FAQ BY ID
// ======================================================

const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        question,
        answer,
        status,
        created_at
      FROM faqs
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ fetched successfully.",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error("Get FAQ By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQ.",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE FAQ
// ======================================================

const createFaq = async (req, res) => {
  try {
    const {
      question,
      answer,
      status = "Active",
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required.",
      });
    }

    const allowedStatuses = [
      "Active",
      "Inactive",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ status.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO faqs (
        question,
        answer,
        status
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        question,
        answer,
        status,
        created_at
      `,
      [
        question.trim(),
        answer.trim(),
        status,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully.",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error("Create FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create FAQ.",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE FAQ
// ======================================================

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      question,
      answer,
      status,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required.",
      });
    }

    const allowedStatuses = [
      "Active",
      "Inactive",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE faqs
      SET
        question = $1,
        answer = $2,
        status = COALESCE($3, status)
      WHERE id = $4
      RETURNING
        id,
        question,
        answer,
        status,
        created_at
      `,
      [
        question.trim(),
        answer.trim(),
        status || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully.",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error("Update FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update FAQ.",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE FAQ STATUS
// ======================================================

const updateFaqStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Active",
      "Inactive",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FAQ status.",
      });
    }

    const result = await pool.query(
      `
      UPDATE faqs
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        question,
        answer,
        status,
        created_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ status updated successfully.",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update FAQ Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update FAQ status.",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE FAQ
// ======================================================

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM faqs
      WHERE id = $1
      RETURNING
        id,
        question,
        answer,
        status
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully.",
      faq: result.rows[0],
    });
  } catch (error) {
    console.error("Delete FAQ Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete FAQ.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  updateFaqStatus,
  deleteFaq,
};