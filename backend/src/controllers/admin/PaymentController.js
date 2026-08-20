const pool = require("../../config/db");
const PDFDocument = require("pdfkit");

// ==========================================
// Get All Payments - Admin
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
        p.payment_status,
        p.payment_date,
        p.remarks,
        p.transaction_id,
        p.razorpay_order_id,
        p.razorpay_payment_id,
        p.created_at,
        pr.property_name,
        u.full_name,
        u.email
      FROM payments p
      LEFT JOIN properties pr
        ON p.property_id = pr.id
      LEFT JOIN users u
        ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.error("Admin get payments error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get Single Payment - Admin
// ==========================================
const getPaymentById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        pr.property_name,
        u.full_name,
        u.email
      FROM payments p
      LEFT JOIN properties pr
        ON p.property_id = pr.id
      LEFT JOIN users u
        ON p.user_id = u.id
      WHERE p.id = $1
      `,
      [req.params.id]
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
    console.error("Admin get payment error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Payment Dashboard Statistics - Admin
// ==========================================
const getPaymentStats = async (req, res) => {
  try {
    const { filter = "month" } = req.query;

    let dateCondition = "";

    switch (filter) {
      case "today":
        dateCondition = `
          AND DATE(created_at) = CURRENT_DATE
        `;
        break;

      case "week":
        dateCondition = `
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        `;
        break;

      case "year":
        dateCondition = `
          AND created_at >= DATE_TRUNC('year', CURRENT_DATE)
        `;
        break;

      case "month":
      default:
        dateCondition = `
          AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
        `;
        break;
    }

    const totalPayments = await pool.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE 1=1
      ${dateCondition}
    `);

    const totalRevenue = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payments
      WHERE payment_status = 'Success'
      ${dateCondition}
    `);

    const successfulPayments = await pool.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE payment_status = 'Success'
      ${dateCondition}
    `);

    const pendingPayments = await pool.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE payment_status = 'Pending'
      ${dateCondition}
    `);

    const failedPayments = await pool.query(`
      SELECT COUNT(*) AS count
      FROM payments
      WHERE payment_status = 'Failed'
      ${dateCondition}
    `);

    res.json({
      success: true,
      filter,
      stats: {
        totalPayments: Number(totalPayments.rows[0].count),
        totalRevenue: Number(totalRevenue.rows[0].total),
        successfulPayments: Number(
          successfulPayments.rows[0].count
        ),
        pendingPayments: Number(
          pendingPayments.rows[0].count
        ),
        failedPayments: Number(
          failedPayments.rows[0].count
        ),
      },
    });
  } catch (error) {
    console.error("Admin payment stats error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Recent Payments - Admin
// ==========================================
const getRecentPayments = async (req, res) => {
  try {
    const { filter = "month" } = req.query;

    let dateCondition = "";

    switch (filter) {
      case "today":
        dateCondition = `
          WHERE DATE(p.created_at) = CURRENT_DATE
        `;
        break;

      case "week":
        dateCondition = `
          WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 days'
        `;
        break;

      case "year":
        dateCondition = `
          WHERE p.created_at >= DATE_TRUNC('year', CURRENT_DATE)
        `;
        break;

      case "month":
      default:
        dateCondition = `
          WHERE p.created_at >= DATE_TRUNC('month', CURRENT_DATE)
        `;
        break;
    }

    const result = await pool.query(`
      SELECT
        p.id,
        p.property_id,
        p.user_id,
        p.amount,
        p.payment_for,
        p.payment_status,
        p.payment_method,
        p.payment_date,
        p.transaction_id,
        p.created_at,
        pr.property_name,
        u.full_name,
        u.email
      FROM payments p
      LEFT JOIN properties pr
        ON p.property_id = pr.id
      LEFT JOIN users u
        ON p.user_id = u.id
      ${dateCondition}
      ORDER BY p.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      payments: result.rows,
    });
  } catch (error) {
    console.error("Admin recent payments error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Payment Method Statistics
// ==========================================
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
    console.error(
      "Admin payment method stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Monthly Revenue
// ==========================================
const getMonthlyRevenue = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        EXTRACT(MONTH FROM created_at) AS month_number,
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
    console.error(
      "Admin monthly revenue error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Update Payment - Admin
// ==========================================
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
      `
      UPDATE payments
      SET
        property_id = $1,
        amount = $2,
        payment_for = $3,
        payment_method = $4,
        payment_status = $5,
        payment_date = $6,
        remarks = $7
      WHERE id = $8
      RETURNING *
      `,
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    res.json({
      success: true,
      message: "Payment Updated Successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error("Admin update payment error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Delete Payment - Admin
// ==========================================
const deletePayment = async (req, res) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM payments
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    res.json({
      success: true,
      message: "Payment Deleted Successfully",
    });
  } catch (error) {
    console.error("Admin delete payment error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ==========================================
// Download Payment Receipt - Admin
// ==========================================
const getPaymentReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.amount,
        p.payment_for,
        p.payment_method,
        p.payment_status,
        p.payment_date,
        p.remarks,
        p.transaction_id,
        p.razorpay_order_id,
        p.razorpay_payment_id,
        p.created_at,
        pr.property_name,
        u.full_name,
        u.email
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
        message: "Payment Not Found",
      });
    }

    const payment = result.rows[0];

    // ------------------------------------------
    // PDF
    // ------------------------------------------

    const PDFDocument = require("pdfkit");

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Receipt-${payment.id}.pdf"`
    );

    doc.pipe(res);

    // ------------------------------------------
    // Header
    // ------------------------------------------

    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("AMARA LANDS", {
        align: "center",
      });

    doc
      .moveDown(0.5)
      .fontSize(16)
      .text("Payment Receipt", {
        align: "center",
      });

    doc.moveDown(2);

    // ------------------------------------------
    // Payment Details
    // ------------------------------------------

    doc
      .fontSize(11)
      .font("Helvetica");

    doc.text(
      `Receipt ID: ${payment.id}`
    );

    doc.text(
      `Customer: ${payment.full_name || "-"}`
    );

    doc.text(
      `Email: ${payment.email || "-"}`
    );

    doc.text(
      `Property: ${payment.property_name || "-"}`
    );

    doc.moveDown();

    doc.text(
      `Payment For: ${payment.payment_for || "-"}`
    );

    doc.text(
      `Payment Method: ${payment.payment_method || "-"}`
    );

    doc.text(
      `Payment Status: ${payment.payment_status || "-"}`
    );

    doc.text(
      `Amount: ₹${payment.amount || 0}`
    );

    doc.text(
      `Transaction ID: ${
        payment.transaction_id ||
        payment.razorpay_payment_id ||
        "-"
      }`
    );

    doc.text(
      `Razorpay Order ID: ${
        payment.razorpay_order_id || "-"
      }`
    );

    doc.text(
      `Payment Date: ${
        payment.payment_date
          ? new Date(
              payment.payment_date
            ).toLocaleString()
          : "-"
      }`
    );

    doc.text(
      `Created At: ${
        payment.created_at
          ? new Date(
              payment.created_at
            ).toLocaleString()
          : "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Remarks: ${payment.remarks || "-"}`
    );

    doc.moveDown(2);

    // ------------------------------------------
    // Footer
    // ------------------------------------------

    doc
      .fontSize(10)
      .text(
        "Thank you for using Amara Lands.",
        {
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.error(
      "Admin payment receipt error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate payment receipt",
      });
    }
  }
};
// ==========================================
// Download Payment Receipt - Admin
// ==========================================
const downloadPaymentReceipt = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        p.*,
        pr.property_name,
        u.full_name,
        u.email
      FROM payments p
      LEFT JOIN properties pr
        ON p.property_id = pr.id
      LEFT JOIN users u
        ON p.user_id = u.id
      WHERE p.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Payment Not Found",
      });
    }

    const payment = result.rows[0];

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Receipt-${payment.id}.pdf"`
    );

    doc.pipe(res);

    // ==============================
    // HEADER
    // ==============================

    doc
      .fontSize(22)
      .text("AMARA LANDS", {
        align: "center",
      });

    doc
      .moveDown()
      .fontSize(16)
      .text("Payment Receipt", {
        align: "center",
      });

    doc.moveDown(2);

    // ==============================
    // PAYMENT DETAILS
    // ==============================

    doc.fontSize(11);

    doc.text(`Receipt No: RCPT-${payment.id}`);

    doc.moveDown();

    doc.text(
      `Payment Date: ${
        payment.payment_date
          ? new Date(
              payment.payment_date
            ).toLocaleDateString()
          : "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Customer: ${payment.full_name || "-"}`
    );

    doc.text(
      `Email: ${payment.email || "-"}`
    );

    doc.moveDown();

    doc.text(
      `Property: ${
        payment.property_name || "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Purpose: ${
        payment.payment_for || "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Payment Method: ${
        payment.payment_method || "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Amount: ₹${payment.amount || 0}`
    );

    doc.moveDown();

    doc.text(
      `Status: ${
        payment.payment_status || "-"
      }`
    );

    doc.moveDown();

    doc.text(
      `Transaction ID: ${
        payment.transaction_id ||
        payment.razorpay_payment_id ||
        "-"
      }`
    );

    if (payment.razorpay_order_id) {
      doc.moveDown();

      doc.text(
        `Razorpay Order ID: ${
          payment.razorpay_order_id
        }`
      );
    }

    doc.moveDown();

    doc.text(
      `Remarks: ${payment.remarks || "-"}`
    );

    // ==============================
    // FOOTER
    // ==============================

    doc.moveDown(4);

    doc
      .fontSize(10)
      .text(
        "This is a system generated payment receipt.",
        {
          align: "center",
        }
      );

    doc.end();
  } catch (error) {
    console.error(
      "Admin payment receipt error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to generate payment receipt",
    });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentStats,
  getRecentPayments,
  getPaymentMethodStats,
  getMonthlyRevenue,
  updatePayment,
  deletePayment,
  getPaymentReceipt,
   downloadPaymentReceipt,
};