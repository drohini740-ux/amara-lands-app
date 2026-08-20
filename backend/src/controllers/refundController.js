const pool = require("../config/db");

// ==========================================
// Create Refund Request - Customer
// ==========================================
const createRefundRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, reason } = req.body;

    if (!payment_id || !reason?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and refund reason are required",
      });
    }

    // ------------------------------------------
    // Check Payment
    // ------------------------------------------

    const paymentResult = await pool.query(
      `
      SELECT
        id,
        user_id,
        amount,
        payment_status
      FROM payments
      WHERE id = $1
      `,
      [payment_id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const payment = paymentResult.rows[0];

    // ------------------------------------------
    // Make sure payment belongs to logged user
    // ------------------------------------------

    if (Number(payment.user_id) !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to refund this payment",
      });
    }

    // ------------------------------------------
    // Only successful payments can be refunded
    // ------------------------------------------

    if (payment.payment_status !== "Success") {
      return res.status(400).json({
        success: false,
        message: "Only successful payments can be refunded",
      });
    }

    // ------------------------------------------
    // Check existing refund request
    // ------------------------------------------

    const existingRefund = await pool.query(
      `
      SELECT id, status
      FROM refund_requests
      WHERE payment_id = $1
      AND status IN ('Pending', 'Approved')
      `,
      [payment_id]
    );

    if (existingRefund.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Refund request already exists for this payment",
      });
    }

    // ------------------------------------------
    // Create Refund Request
    // ------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO refund_requests
      (
        payment_id,
        user_id,
        reason,
        refund_amount,
        status
      )
      VALUES
      ($1, $2, $3, $4, 'Pending')
      RETURNING *
      `,
      [
        payment_id,
        userId,
        reason.trim(),
        payment.amount,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Refund Request Submitted Successfully",
      refund: result.rows[0],
    });
  } catch (error) {
    console.error("Create refund request error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get Customer Refund Requests
// ==========================================
const getMyRefundRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.payment_id,
        r.reason,
        r.refund_amount,
        r.status,
        r.admin_remarks,
        r.requested_at,
        r.reviewed_at,

        p.payment_method,
        p.payment_status,

        pr.property_name

      FROM refund_requests r

      LEFT JOIN payments p
        ON r.payment_id = p.id

      LEFT JOIN properties pr
        ON p.property_id = pr.id

      WHERE r.user_id = $1

      ORDER BY r.requested_at DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      refunds: result.rows,
    });
  } catch (error) {
    console.error("Get refund requests error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createRefundRequest,
  getMyRefundRequests,
};