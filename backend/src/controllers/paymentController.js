const pool = require("../config/db");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const { createNotification } = require("../services/notificationService");
const { sendPaymentReceipt } = require("../services/emailService");
const addPayment = async (req, res) => {
  try {
    const {
      property_id,
      amount,
      payment_for,
      payment_method,
      payment_status,
      payment_date,
      remarks,
    } = req.body;

    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO payments
      (
        property_id,
        user_id,
        amount,
        payment_for,
        payment_method,
        payment_status,
        payment_date,
        remarks
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`,
      [
        property_id,
        user_id,
        amount,
        payment_for,
        payment_method,
        payment_status,
        payment_date,
        remarks,
      ],
    );
    await createNotification(
  user_id,
  "Payment Successful",
 `Payment of Rs.${amount} received successfully.`,
  "Payment"
);

    res.status(201).json({
      success: true,
      message: "Payment Added Successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          pay.*,
          p.property_name
       FROM payments pay
       JOIN properties p
       ON pay.property_id = p.id
       ORDER BY pay.id DESC`,
    );

    res.json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await pool.query(
      `SELECT COUNT(*) FROM payments`
    );

    const totalRevenue = await pool.query(
      `SELECT COALESCE(SUM(amount),0) AS total
       FROM payments
       WHERE payment_status='Success'`
    );

    const successfulPayments = await pool.query(
      `SELECT COUNT(*) FROM payments
       WHERE payment_status='Success'`
    );

    const pendingPayments = await pool.query(
      `SELECT COUNT(*) FROM payments
       WHERE payment_status='Pending'`
    );

    const failedPayments = await pool.query(
      `SELECT COUNT(*) FROM payments
       WHERE payment_status='Failed'`
    );

    res.json({
      success: true,
      stats: {
        totalPayments: Number(totalPayments.rows[0].count),
        totalRevenue: Number(totalRevenue.rows[0].total),
        successfulPayments: Number(successfulPayments.rows[0].count),
        pendingPayments: Number(pendingPayments.rows[0].count),
        failedPayments: Number(failedPayments.rows[0].count),
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getPayment = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          pay.*,
          p.property_name
       FROM payments pay
       JOIN properties p
       ON pay.property_id = p.id
       WHERE pay.id=$1`,
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    res.json({
      success: true,
      payment: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updatePayment = async (req, res) => {
  try {
    const {
      property_id,
      amount,
      payment_for,
      payment_method,
      payment_status,
      payment_date,
      remarks,
    } = req.body;

    const result = await pool.query(
      `UPDATE payments
       SET
         property_id=$1,
         amount=$2,
         payment_for=$3,
         payment_method=$4,
         payment_status=$5,
         payment_date=$6,
         remarks=$7
       WHERE id=$8
       RETURNING *`,
      [
        property_id,
        amount,
        payment_for,
        payment_method,
        payment_status,
        payment_date,
        remarks,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      message: "Payment Updated Successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deletePayment = async (req, res) => {
  try {
    await pool.query("DELETE FROM payments WHERE id=$1", [req.params.id]);

    res.json({
      success: true,
      message: "Payment Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to create Razorpay Order",
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_id,
    } = req.body;

    // Verify Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    // Update Payment
    await pool.query(
      `
      UPDATE payments
      SET
        razorpay_order_id = $1,
        razorpay_payment_id = $2,
        razorpay_signature = $3,
        payment_status = 'Success'
      WHERE id = $4
      `,
      [
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        payment_id,
      ]
    );
    // Fetch payment and user details
const paymentResult = await pool.query(
  `
  SELECT
    p.*,
    pr.property_name,
    u.full_name,
    u.email
  FROM payments p
  JOIN properties pr ON p.property_id = pr.id
  JOIN users u ON p.user_id = u.id
  WHERE p.id = $1
  `,
  [payment_id]
);

const payment = paymentResult.rows[0];

// Temporary PDF content
const pdfBuffer = Buffer.from(
  `
Amara Lands Payment Receipt

Receipt No: ${payment.id}
Property: ${payment.property_name}
Amount: Rs. ${payment.amount}
Purpose: ${payment.payment_for}
Status: ${payment.payment_status}
`
);

// Send email
await sendPaymentReceipt(
  payment.email,
  payment.full_name,
  payment,
  pdfBuffer
);

// Send email
await sendPaymentReceipt(
  payment.email,
  payment.name,
  payment,
  pdfBuffer
);

    res.json({
      success: true,
      message: "Payment Verified Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};
const PDFDocument = require("pdfkit");

const downloadReceipt = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        pr.property_name
      FROM payments p
      JOIN properties pr
      ON p.property_id = pr.id
      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const payment = result.rows[0];

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${payment.id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(22).text("Amara Lands", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(18).text("Payment Receipt");

    doc.moveDown();

    doc.fontSize(13).text(`Receipt No : ${payment.id}`);
    doc.text(`Property : ${payment.property_name}`);
    doc.text(`Amount : ₹${payment.amount}`);
    doc.text(`Payment For : ${payment.payment_for}`);
    doc.text(`Payment Method : ${payment.payment_method}`);
    doc.text(`Status : ${payment.payment_status}`);
    doc.text(`Payment Date : ${payment.payment_date}`);

    doc.moveDown();

    doc.text(`Razorpay Order ID : ${payment.razorpay_order_id || "-"}`);
    doc.text(`Payment ID : ${payment.razorpay_payment_id || "-"}`);

    doc.moveDown(2);

    doc.text("Thank you for choosing Amara Lands.");

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getRecentPayments = async (req, res) => {
  try {
  const result = await pool.query(`
  SELECT
    p.id,
    pr.property_name,
    p.amount,
    p.payment_status,
    p.payment_method,
    p.transaction_id,
    p.created_at
  FROM payments p
  LEFT JOIN properties pr
    ON p.property_id = pr.id
  ORDER BY p.created_at DESC
  LIMIT 5
`);

    res.json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getPaymentMethodStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        payment_method,
        COUNT(*) AS total
      FROM payments
      GROUP BY payment_method
      ORDER BY total DESC
    `);

    res.json({
      success: true,
      methods: result.rows,
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
  addPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  createOrder,
  verifyPayment,
  downloadReceipt,
  getPaymentStats,
  getRecentPayments,
  getPaymentMethodStats,
};