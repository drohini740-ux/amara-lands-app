const pool = require("../../config/db");
const razorpay = require("../../config/razorpay");

// =====================================================
// Get All Refund Requests - Admin
// =====================================================
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
        r.razorpay_refund_id,
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

    return res.json({
      success: true,
      refunds: result.rows,
    });
  } catch (error) {
    console.error("Admin get refund requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// Get Single Refund Request - Admin
// =====================================================
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

    return res.json({
      success: true,
      refund: result.rows[0],
    });
  } catch (error) {
    console.error("Get refund request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =====================================================
// Approve Refund - Admin
// =====================================================
const approveRefund = async (req, res) => {
  const client = await pool.connect();

  try {
    const { admin_remarks = "" } = req.body || {};

    await client.query("BEGIN");

    // =================================================
    // Get refund request + payment and lock rows
    // =================================================
    const refundResult = await client.query(
      `
      SELECT
        r.*,

        p.amount AS payment_amount,
        p.payment_status,
        p.razorpay_payment_id

      FROM refund_requests r

      INNER JOIN payments p
        ON r.payment_id = p.id

      WHERE r.id = $1

      FOR UPDATE OF r, p
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

    // =================================================
    // Check refund request status
    // =================================================
    if (refund.status !== "Pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: `Refund request is already ${refund.status}`,
      });
    }

    // =================================================
    // Check Razorpay payment ID
    // =================================================
    if (!refund.razorpay_payment_id) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Razorpay payment ID not found",
      });
    }

    // =================================================
    // Check local payment status
    // =================================================
    if (refund.payment_status !== "Success") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Only successful payments can be refunded",
      });
    }

    // =================================================
    // Validate requested refund amount
    // =================================================
    const requestedRefundAmount = Number(refund.refund_amount);

    const paymentAmount = Number(refund.payment_amount);

    if (
      !Number.isFinite(requestedRefundAmount) ||
      requestedRefundAmount <= 0
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Invalid refund amount",
      });
    }

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (requestedRefundAmount > paymentAmount) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Refund amount cannot exceed payment amount",
      });
    }

    // =================================================
    // Fetch actual Razorpay payment
    // =================================================
    console.log("");
    console.log("========== RAZORPAY PAYMENT ==========");

    const razorpayPayment = await razorpay.payments.fetch(
      refund.razorpay_payment_id
    );

    console.log("Payment ID:", razorpayPayment.id);
    console.log("Amount:", razorpayPayment.amount);
    console.log("Status:", razorpayPayment.status);
    console.log("Captured:", razorpayPayment.captured);
    console.log("Amount Refunded:", razorpayPayment.amount_refunded);
    console.log("Refund Status:", razorpayPayment.refund_status);
    console.log("Currency:", razorpayPayment.currency);
    console.log("Method:", razorpayPayment.method);

    console.log("=======================================");
    console.log("");

    // =================================================
    // Razorpay payment must be captured
    // =================================================
    if (
      razorpayPayment.status !== "captured" ||
      razorpayPayment.captured !== true
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Razorpay payment is not captured",
      });
    }

    // =================================================
    // Amount already refunded on Razorpay
    // =================================================
    const amountAlreadyRefunded =
      Number(razorpayPayment.amount_refunded || 0);

    const razorpayPaymentAmount =
      Number(razorpayPayment.amount || 0);

    // Requested refund in paise
    const requestedRefundPaise = Math.round(
      requestedRefundAmount * 100
    );

    // =================================================
    // Check available refundable amount
    // =================================================
    const remainingRefundableAmount =
      razorpayPaymentAmount - amountAlreadyRefunded;

    console.log("Requested refund:", requestedRefundPaise);
    console.log("Already refunded:", amountAlreadyRefunded);
    console.log("Remaining refundable:", remainingRefundableAmount);

    if (remainingRefundableAmount <= 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Payment has already been fully refunded",
      });
    }

    if (requestedRefundPaise > remainingRefundableAmount) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "Refund amount exceeds the remaining refundable amount",
      });
    }

    // =================================================
    // Create Razorpay refund
    // =================================================
    console.log("");
    console.log("========== CREATING RAZORPAY REFUND ==========");
    console.log("Payment ID:", refund.razorpay_payment_id);
    console.log("Refund amount:", requestedRefundPaise);
    console.log("===============================================");
    console.log("");

    const razorpayRefund = await razorpay.payments.refund(
      refund.razorpay_payment_id,
      {
        amount: requestedRefundPaise,
      }
    );

    console.log("");
    console.log("========== RAZORPAY REFUND CREATED ==========");
    console.log("Refund ID:", razorpayRefund.id);
    console.log("Amount:", razorpayRefund.amount);
    console.log("Status:", razorpayRefund.status);
    console.log("Payment ID:", razorpayRefund.payment_id);
    console.log("==============================================");
    console.log("");

    // =================================================
    // Admin remarks
    // =================================================
    const finalRemarks =
      typeof admin_remarks === "string" &&
      admin_remarks.trim()
        ? admin_remarks.trim()
        : "Refund approved by admin.";

    // =================================================
    // IMPORTANT:
    // Razorpay refund succeeded.
    // Now update our database.
    // =================================================

    const updatedRefund = await client.query(
      `
      UPDATE refund_requests
      SET
        status = 'Approved',
        admin_remarks = $1,
        razorpay_refund_id = $2,
        reviewed_at = CURRENT_TIMESTAMP

      WHERE id = $3
        AND status = 'Pending'

      RETURNING *
      `,
      [
        finalRemarks,
        razorpayRefund.id,
        req.params.id,
      ]
    );

    if (updatedRefund.rows.length === 0) {
      /*
       * Razorpay refund has already been created.
       * Do NOT create another refund.
       *
       * Rollback only the database transaction.
       */
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message:
          "Razorpay refund was created, but the refund request was already processed.",
        razorpay_refund_id: razorpayRefund.id,
      });
    }

    // =================================================
    // Determine new payment status
    // =================================================
    const totalRefundedAfterThisRefund =
      amountAlreadyRefunded + requestedRefundPaise;

    let newPaymentStatus = "Success";

    if (
      totalRefundedAfterThisRefund >= razorpayPaymentAmount
    ) {
      newPaymentStatus = "Refunded";
    }

    // =================================================
    // Update payment status
    // =================================================
    await client.query(
      `
      UPDATE payments

      SET
        payment_status = $1,
        remarks = $2

      WHERE id = $3
      `,
      [
        newPaymentStatus,
        finalRemarks,
        refund.payment_id,
      ]
    );

    // =================================================
    // COMMIT
    // =================================================
    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Refund Approved Successfully",

      refund: updatedRefund.rows[0],

      razorpay_refund_id: razorpayRefund.id,

      razorpay_refund_status: razorpayRefund.status,

      refund_amount: requestedRefundAmount,

      payment_status: newPaymentStatus,
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error("");
    console.error("========== APPROVE REFUND ERROR ==========");
    console.error(error);
    console.error("==========================================");
    console.error("");

    const razorpayDescription =
      error?.error?.description ||
      error?.response?.data?.error?.description;

    return res.status(500).json({
      success: false,
      message:
        razorpayDescription ||
        error.message ||
        "Unable to process refund",
    });
  } finally {
    client.release();
  }
};

// =====================================================
// Reject Refund - Admin
// =====================================================
const rejectRefund = async (req, res) => {
  const client = await pool.connect();

  try {
    const { admin_remarks = "" } = req.body || {};

    await client.query("BEGIN");

    // =================================================
    // Get refund request
    // =================================================
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

    // =================================================
    // Check status
    // =================================================
    if (refund.status !== "Pending") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: `Refund request is already ${refund.status}`,
      });
    }

    // =================================================
    // Admin remarks
    // =================================================
    const finalRemarks =
      typeof admin_remarks === "string" &&
      admin_remarks.trim()
        ? admin_remarks.trim()
        : "Refund rejected by admin.";

    // =================================================
    // Update refund request
    // =================================================
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
      [
        finalRemarks,
        req.params.id,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Refund Rejected Successfully",
      refund: updatedRefund.rows[0],
    });
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error(
      "Reject refund error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    client.release();
  }
};

// =====================================================
// EXPORT
// =====================================================
module.exports = {
  getAllRefundRequests,
  getRefundRequestById,
  approveRefund,
  rejectRefund,
};