const pool = require("../../config/db");
const razorpay = require("../../config/razorpay");
const crypto = require("crypto");
// ==========================================
// Get All Refund Requests - Admin
// ==========================================
const getAllRefundRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.payment_id,
        r.user_id,
        r.reason,
        r.refund_amount,
        r.status,
        r.admin_remarks,
        r.requested_at,
        r.reviewed_at,

        p.amount AS payment_amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.razorpay_payment_id,
        p.payment_date,

        pr.property_name,

        u.full_name,
        u.email

      FROM refund_requests r

      LEFT JOIN payments p
        ON r.payment_id = p.id

      LEFT JOIN properties pr
        ON p.property_id = pr.id

      LEFT JOIN users u
        ON r.user_id = u.id

      ORDER BY r.requested_at DESC
    `);

    res.json({
      success: true,
      refunds: result.rows,
    });
  } catch (error) {
    console.error("Admin get refund requests error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get Single Refund Request - Admin
// ==========================================
const getRefundRequestById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        r.*,

        p.amount AS payment_amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.razorpay_payment_id,
        p.payment_date,

        pr.property_name,

        u.full_name,
        u.email

      FROM refund_requests r

      LEFT JOIN payments p
        ON r.payment_id = p.id

      LEFT JOIN properties pr
        ON p.property_id = pr.id

      LEFT JOIN users u
        ON r.user_id = u.id

      WHERE r.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Refund Request Not Found",
      });
    }

    res.json({
      success: true,
      refund: result.rows[0],
    });
  } catch (error) {
    console.error("Get refund request error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Approve Refund - Admin
// ==========================================
const approveRefund = async (req, res) => {
  const client = await pool.connect();

  try {
    const { admin_remarks = "" } = req.body;

    await client.query("BEGIN");

    // ------------------------------------------
    // Get refund request
    // ------------------------------------------
    const refundResult = await client.query(
      `
      SELECT
        r.*,
        p.amount AS payment_amount,
        p.payment_status,
        p.razorpay_payment_id
      FROM refund_requests r
      LEFT JOIN payments p
        ON r.payment_id = p.id
      WHERE r.id = $1
      FOR UPDATE
      `,
      [req.params.id]
    );

    if (refundResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Refund Request Not Found",
      });
    }

    const refund = refundResult.rows[0];

    // ------------------------------------------
    // Check refund status
    // ------------------------------------------
    if (refund.status !== "Pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: `Refund request is already ${refund.status}`,
      });
    }

    // ------------------------------------------
    // Check Razorpay payment ID
    // ------------------------------------------
    if (!refund.razorpay_payment_id) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Razorpay Payment ID not found",
      });
    }

    // ------------------------------------------
    // Check payment status
    // ------------------------------------------
    if (refund.payment_status !== "Success") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Only successful payments can be refunded",
      });
    }

    // ------------------------------------------
    // Refund amount in paise
    // ₹3000 = 300000 paise
    // ------------------------------------------
    const refundAmount = Math.round(
      Number(refund.refund_amount) * 100
    );

    // ------------------------------------------
    // Create actual Razorpay refund
    // ------------------------------------------
    const razorpayRefund = await razorpay.payments.refund(
      refund.razorpay_payment_id,
      {
        amount: refundAmount,
        speed: "normal",
        notes: {
          refund_request_id: String(refund.id),
          payment_id: String(refund.payment_id),
        },
      }
    );

    console.log("Razorpay refund created:", razorpayRefund.id);

    // ------------------------------------------
    // Update refund request
    // ------------------------------------------
    const finalRemarks =
      admin_remarks?.trim() ||
      "Refund approved by admin.";

    const updatedRefund = await client.query(
      `
      UPDATE refund_requests
      SET
        status = 'Approved',
        admin_remarks = $1,
        razorpay_refund_id = $2,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
      `,
      [
        finalRemarks,
        razorpayRefund.id,
        req.params.id,
      ]
    );

    // ------------------------------------------
    // Update payment status
    // ------------------------------------------
    await client.query(
      `
      UPDATE payments
      SET
        payment_status = 'Refunded',
        remarks = $1
      WHERE id = $2
      `,
      [
        `Refund approved by admin. Refund amount: ${refund.refund_amount}`,
        refund.payment_id,
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Refund Approved Successfully",
      refund: updatedRefund.rows[0],
      razorpay_refund_id: razorpayRefund.id,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Approve refund error:", error);

    res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.description ||
        error.message ||
        "Unable to process refund",
    });
  } finally {
    client.release();
  }
};

// ==========================================
// Reject Refund - Admin
// ==========================================
const rejectRefund = async (req, res) => {
  const client = await pool.connect();

  try {
    const { admin_remarks = "" } = req.body;

    await client.query("BEGIN");

    // ------------------------------------------
    // Get refund request
    // ------------------------------------------
    const refundResult = await client.query(
      `
      SELECT *
      FROM refund_requests
      WHERE id = $1
      FOR UPDATE
      `,
      [req.params.id]
    );

    if (refundResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Refund Request Not Found",
      });
    }

    const refund = refundResult.rows[0];

    // ------------------------------------------
    // Check status
    // ------------------------------------------
    if (refund.status !== "Pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: `Refund request is already ${refund.status}`,
      });
    }

    // ------------------------------------------
    // Update refund request
    // ------------------------------------------
    const finalRemarks =
      admin_remarks || "Refund rejected by admin.";

    const updatedRefund = await client.query(
      `
      UPDATE refund_requests
      SET
        status = 'Rejected',
        admin_remarks = $1,
        reviewed_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [finalRemarks, req.params.id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Refund Rejected Successfully",
      refund: updatedRefund.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Reject refund error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllRefundRequests,
  getRefundRequestById,
  approveRefund,
  rejectRefund,
};