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

const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await pool.query(
      `SELECT pay.*, p.property_name
       FROM payments pay
       LEFT JOIN properties p ON pay.property_id = p.id
       WHERE pay.user_id = $1
       ORDER BY pay.id DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.error("Get My Payments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your payments.",
    });
  }
};

const downloadMyReceipt = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await pool.query(
      `SELECT pay.*, p.property_name
       FROM payments pay
       LEFT JOIN properties p ON pay.property_id = p.id
       WHERE pay.id = $1 AND pay.user_id = $2`,
      [req.params.id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    const payment = result.rows[0];
    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${payment.id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(22).text("Amara Lands", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text("Payment Receipt");
    doc.moveDown();
    doc.fontSize(13).text(`Receipt No: ${payment.id}`);
    doc.text(`Property: ${payment.property_name || "N/A"}`);
    doc.text(`Amount: Rs. ${payment.amount}`);
    doc.text(`Payment For: ${payment.payment_for || "N/A"}`);
    doc.text(`Payment Method: ${payment.payment_method || "N/A"}`);
    doc.text(`Status: ${payment.payment_status || "N/A"}`);
    doc.text(`Payment Date: ${payment.payment_date || payment.created_at || "N/A"}`);
    doc.moveDown();
    doc.text(`Razorpay Order ID: ${payment.razorpay_order_id || "-"}`);
    doc.text(`Razorpay Payment ID: ${payment.razorpay_payment_id || "-"}`);
    doc.moveDown(2);
    doc.text("Thank you for choosing Amara Lands.");
    doc.end();
  } catch (error) {
    console.error("Download My Receipt Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate receipt.",
      });
    }
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
    const userId = req.user?.id;
    const { property_id, amount, payment_for, remarks } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const paymentAmount = Number(amount);
    const propertyId = Number(property_id);

    if (
      !Number.isInteger(propertyId) ||
      propertyId <= 0 ||
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0 ||
      !payment_for?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid property, amount and payment purpose.",
      });
    }

    // Ensure the selected property belongs to the logged-in customer.
    const propertyResult = await pool.query(
      `SELECT id
       FROM properties
       WHERE id = $1 AND user_id = $2`,
      [propertyId, userId]
    );

    if (propertyResult.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You cannot make a payment for this property.",
      });
    }

    // Create Razorpay order.
    const order = await razorpay.orders.create({
      amount: Math.round(paymentAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save the pending payment before checkout verification.
    const paymentResult = await pool.query(
      `INSERT INTO payments (
        property_id,
        user_id,
        amount,
        payment_for,
        payment_method,
        payment_status,
        payment_date,
        remarks,
        razorpay_order_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
      RETURNING *`,
      [
        propertyId,
        userId,
        paymentAmount,
        payment_for.trim(),
        "Razorpay",
        "Pending",
        remarks || null,
        order.id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Payment order created.",
      order,
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.error("Create Payment Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payment_id,
    } = req.body;

    // 1. Check authentication.
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // 2. Validate required fields.
    if (
      !payment_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details.",
      });
    }

    // Validate the format of the supplied signature.
    if (
      typeof razorpay_signature !== "string" ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature format.",
      });
    }

    // 3. Find the payment belonging to this customer and order.
    const paymentResult = await pool.query(
      `SELECT
         p.*,
         pr.property_name,
         u.full_name,
         u.email
       FROM payments p
       LEFT JOIN properties pr ON pr.id = p.property_id
       LEFT JOIN users u ON u.id = p.user_id
       WHERE p.id = $1
         AND p.user_id = $2
         AND p.razorpay_order_id = $3`,
      [payment_id, userId, razorpay_order_id]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found for this customer or order.",
      });
    }

    const payment = paymentResult.rows[0];

    // 4. Handle repeated verification requests.
    if (payment.payment_status === "Success") {
      if (
        payment.razorpay_payment_id === razorpay_payment_id
      ) {
        return res.status(200).json({
          success: true,
          message: "Payment has already been verified.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "This payment has already been verified with different details.",
      });
    }

    if (payment.payment_status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This payment cannot be verified in its current status.",
      });
    }

    // 5. Verify the Razorpay signature.
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("Razorpay secret is not configured.");

      return res.status(500).json({
        success: false,
        message: "Payment verification is not configured.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const supplied = Buffer.from(razorpay_signature, "hex");
    const generated = Buffer.from(generatedSignature, "hex");

    if (
      supplied.length !== generated.length ||
      !crypto.timingSafeEqual(supplied, generated)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    // 6. Fetch the actual payment from Razorpay.
    let razorpayPayment;

    try {
      razorpayPayment = await razorpay.payments.fetch(
        razorpay_payment_id
      );
    } catch (razorpayError) {
      console.error(
        "Razorpay payment lookup failed:",
        razorpayError.statusCode || razorpayError.message
      );

      return res.status(502).json({
        success: false,
        message:
          "Unable to confirm payment with Razorpay. Please try again.",
      });
    }

    // 7. Confirm the payment and order IDs.
    if (
      razorpayPayment.id !== razorpay_payment_id ||
      razorpayPayment.order_id !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment or order details do not match.",
      });
    }

    // 8. Confirm amount and currency.
    const amountInRupees = Number(payment.amount);

    if (
      !Number.isFinite(amountInRupees) ||
      amountInRupees <= 0 ||
      !Number.isSafeInteger(Math.round(amountInRupees * 100))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount in the database.",
      });
    }

    const expectedAmountPaise = Math.round(
      amountInRupees * 100
    );

    if (
      Number(razorpayPayment.amount) !== expectedAmountPaise ||
      razorpayPayment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match.",
      });
    }

    // 9. Only accept a payment captured by Razorpay.
    if (
      razorpayPayment.status !== "captured" ||
      razorpayPayment.captured !== true
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Razorpay has not confirmed a captured payment.",
      });
    }

    // 10. Update only the customer's matching pending payment.
    // The WHERE conditions help prevent concurrent or unauthorized updates.
    const updateResult = await pool.query(
      `UPDATE payments
       SET razorpay_payment_id = $1,
           razorpay_signature = $2,
           payment_status = 'Success',
           payment_date = NOW()
       WHERE id = $3
         AND user_id = $4
         AND razorpay_order_id = $5
         AND payment_status = 'Pending'
       RETURNING *`,
      [
        razorpay_payment_id,
        razorpay_signature,
        payment_id,
        userId,
        razorpay_order_id,
      ]
    );

    if (updateResult.rows.length === 0) {
      return res.status(409).json({
        success: false,
        message:
          "Payment status changed. Please refresh and check history.",
      });
    }

    const verifiedPayment = {
      ...payment,
      ...updateResult.rows[0],
      payment_status: "Success",
    };

    // 11. Send the receipt email.
    // Email failure must not undo a verified payment.
    try {
      if (payment.email) {
        const pdfBuffer = Buffer.from(
          `Amara Lands Payment Receipt

Receipt No: ${payment.id}
Customer: ${payment.full_name || "Customer"}
Property: ${payment.property_name || "N/A"}
Amount: Rs. ${payment.amount}
Purpose: ${payment.payment_for || "N/A"}
Status: Success
Razorpay Payment ID: ${razorpay_payment_id}
`
        );

        await sendPaymentReceipt(
          payment.email,
          payment.full_name || "Customer",
          verifiedPayment,
          pdfBuffer
        );
      }
    } catch (emailError) {
      console.error(
        "Payment receipt email failed:",
        emailError.message
      );
    }

    // 12. Notify the customer.
    try {
      await createNotification(
        userId,
        "Payment Successful",
        `Payment of Rs. ${payment.amount} received successfully.`,
        "Payment"
      );
    } catch (notificationError) {
      console.error(
        "Payment notification failed:",
        notificationError.message
      );
    }

    // 13. Return the verified payment.
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      payment: verifiedPayment,
    });
  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};

const PDFDocument = require("pdfkit");


const downloadReceipt = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Customers can download their own receipts.
    // Admin and Super Admin can download receipts for management.
    const result = await pool.query(
      `
      SELECT
        p.*,
        pr.property_name
      FROM payments p
      LEFT JOIN properties pr ON pr.id = p.property_id
      WHERE p.id = $1
        AND (
          p.user_id = $2
          OR EXISTS (
            SELECT 1
            FROM users requester
            WHERE requester.id = $2
              AND requester.role IN ('admin', 'super_admin')
          )
        )
      `,
      [req.params.id, userId]
    );

    // Do not reveal whether another customer's payment exists.
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
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

    doc.fontSize(22).text("Amara Lands", { align: "center" });
    doc.moveDown();
    doc.fontSize(18).text("Payment Receipt");
    doc.moveDown();
    doc.fontSize(13).text(`Receipt No: ${payment.id}`);
    doc.text(`Property: ${payment.property_name || "N/A"}`);
    doc.text(`Amount: Rs. ${payment.amount}`);
    doc.text(`Payment For: ${payment.payment_for || "N/A"}`);
    doc.text(`Payment Method: ${payment.payment_method || "N/A"}`);
    doc.text(`Status: ${payment.payment_status || "N/A"}`);
    doc.text(
      `Payment Date: ${payment.payment_date || payment.created_at || "N/A"}`
    );
    doc.moveDown();
    doc.text(`Razorpay Order ID: ${payment.razorpay_order_id || "-"}`);
    doc.text(`Payment ID: ${payment.razorpay_payment_id || "-"}`);
    doc.moveDown(2);
    doc.text("Thank you for choosing Amara Lands.");
    doc.end();
  } catch (error) {
    console.error("Download Receipt Error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate receipt.",
      });
    }
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
const getMonthlyRevenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        SUM(amount)::numeric AS revenue
      FROM payments
      WHERE payment_status = 'Success'
      GROUP BY
        EXTRACT(MONTH FROM created_at),
        TO_CHAR(created_at, 'Mon')
      ORDER BY
        EXTRACT(MONTH FROM created_at)
    `);

    res.json({
      success: true,
      revenue: result.rows,
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
  getMyPayments,
  getPayment,
  updatePayment,
  deletePayment,
  createOrder,
  verifyPayment,
  downloadReceipt,
  downloadMyReceipt,
  getPaymentStats,
  getRecentPayments,
  getPaymentMethodStats,
  getMonthlyRevenue,
};