const pool = require("../../config/db");

// ==========================================
// GET ALL PAYMENTS
// ==========================================
const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.property_id,
        p.user_id,
        p.amount,
        p.payment_for,
        p.payment_method,
        p.razorpay_order_id,
        p.razorpay_payment_id,
        p.transaction_id,
        p.payment_status,
        p.payment_date,
        p.remarks,
        p.created_at,
        p.refund_status,

        pr.property_name,
        pr.survey_number,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM payments p

      LEFT JOIN properties pr
        ON p.property_id = pr.id

      LEFT JOIN users u
        ON p.user_id = u.id

      ORDER BY p.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Payments fetched successfully.",
      payments: result.rows,
    });
  } catch (error) {
    console.error("Get Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
};

// ==========================================
// GET PAYMENT BY ID
// ==========================================
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.property_id,
        p.user_id,
        p.amount,
        p.payment_for,
        p.payment_method,
        p.razorpay_order_id,
        p.razorpay_payment_id,
        p.transaction_id,
        p.payment_status,
        p.payment_date,
        p.remarks,
        p.created_at,
        p.refund_status,

        pr.property_name,
        pr.survey_number,
        pr.property_type,
        pr.area,
        pr.address,
        pr.city,
        pr.state,
        pr.pincode,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM payments p

      LEFT JOIN properties pr
        ON p.property_id = pr.id

      LEFT JOIN users u
        ON p.user_id = u.id

      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment fetched successfully.",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Get Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    if (!payment_status) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE payments
      SET payment_status = $1
      WHERE id = $2
      RETURNING
        id,
        amount,
        payment_status
      `,
      [payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE REFUND STATUS
// ==========================================
const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund_status } = req.body;

    if (!refund_status) {
      return res.status(400).json({
        success: false,
        message: "Refund status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE payments
      SET refund_status = $1
      WHERE id = $2
      RETURNING
        id,
        amount,
        payment_status,
        refund_status
      `,
      [refund_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refund status updated successfully.",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Update Refund Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update refund status.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  updateRefundStatus,
};