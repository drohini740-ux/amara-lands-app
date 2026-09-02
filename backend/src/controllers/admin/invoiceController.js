const pool = require("../../config/db");

// ==========================================
// Get All Invoices - Admin
// ==========================================
const getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.amount,
        p.payment_status,
        p.payment_method,
        p.payment_for,
        p.transaction_id,
        p.razorpay_payment_id,
        p.created_at,

        -- Payment Property
        p.property_id,

        -- Property Details
        prop.property_name,
        prop.survey_number,
        prop.property_type,
        prop.area,
        prop.address AS property_address,
        prop.city AS property_city,
        prop.state AS property_state,
        prop.pincode AS property_pincode,
        prop.latitude,
        prop.longitude,

        -- Customer Details
        u.id AS customer_id,
        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,
        u.profile_image AS customer_profile_image

      FROM payments p

      LEFT JOIN properties prop
        ON prop.id = p.property_id

      LEFT JOIN users u
        ON u.id = p.user_id

      ORDER BY p.created_at DESC
    `);

    const invoices = result.rows.map((payment) => ({
      // ==========================================
      // Invoice
      // ==========================================
      id: payment.id,

      invoice_number: `INV-${payment.id}`,

      // ==========================================
      // Customer
      // ==========================================
      customer: {
        id: payment.customer_id,
        name: payment.customer_name || "-",
        email: payment.customer_email || "-",
        mobile: payment.customer_mobile || "-",
        profile_image:
          payment.customer_profile_image || null,
      },

      // Keep old fields for existing frontend
      customer_id: payment.customer_id,
      customer_name:
        payment.customer_name || "-",
      customer_email:
        payment.customer_email || "-",
      customer_mobile:
        payment.customer_mobile || "-",

      // ==========================================
      // Property
      // ==========================================
      property: {
        id: payment.property_id,
        name: payment.property_name || "-",
        survey_number:
          payment.survey_number || "-",
        property_type:
          payment.property_type || "-",
        area:
          payment.area !== null
            ? payment.area
            : null,
        address:
          payment.property_address || "-",
        city:
          payment.property_city || "-",
        state:
          payment.property_state || "-",
        pincode:
          payment.property_pincode || "-",
        latitude:
          payment.latitude !== null
            ? payment.latitude
            : null,
        longitude:
          payment.longitude !== null
            ? payment.longitude
            : null,
      },

      // Keep old fields for existing frontend
      property_id: payment.property_id,
      property_name:
        payment.property_name || "-",
      survey_number:
        payment.survey_number || "-",
      property_type:
        payment.property_type || "-",
      area:
        payment.area !== null
          ? payment.area
          : null,
      property_address:
        payment.property_address || "-",
      property_city:
        payment.property_city || "-",
      property_state:
        payment.property_state || "-",
      property_pincode:
        payment.property_pincode || "-",

      // ==========================================
      // Payment
      // ==========================================
      amount: payment.amount || 0,

      payment_status:
        payment.payment_status || "-",

      payment_method:
        payment.payment_method || "-",

      payment_for:
        payment.payment_for || "-",

      transaction_id:
        payment.transaction_id ||
        payment.razorpay_payment_id ||
        null,

      razorpay_payment_id:
        payment.razorpay_payment_id || null,

      payment_date:
        payment.created_at,

      created_at:
        payment.created_at,
    }));

    return res.status(200).json({
      success: true,
      invoices,
    });

  } catch (error) {
    console.error(
      "Get admin invoices error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch invoices.",
    });
  }
};

module.exports = {
  getAllInvoices,
};