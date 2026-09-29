
const pool = require("../../config/db");

// =====================================================
// GET ALL APPOINTMENTS
// =====================================================

const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.property_id,
        a.user_id,
        a.customer_name,
        a.phone,
        a.appointment_date,
        a.appointment_time,
        a.purpose,
        a.status,
        a.remarks,
        a.created_at,
        a.service_type,
        a.payment_status,

        p.property_name,
        p.survey_number,
        p.address,
        p.city,
        p.state,
        p.pincode,

        u.email AS customer_email,
        u.full_name AS registered_customer_name,
        u.mobile AS registered_customer_mobile

      FROM appointments a

      LEFT JOIN properties p
        ON a.property_id = p.id

      LEFT JOIN users u
        ON a.user_id = u.id

      ORDER BY
        a.appointment_date DESC,
        a.appointment_time DESC,
        a.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal Team appointments fetched successfully.",
      appointments: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Appointments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
      error: error.message,
    });
  }
};

// =====================================================
// GET APPOINTMENT BY ID
// =====================================================

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.property_id,
        a.user_id,
        a.customer_name,
        a.phone,
        a.appointment_date,
        a.appointment_time,
        a.purpose,
        a.status,
        a.remarks,
        a.created_at,
        a.service_type,
        a.payment_status,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,
        p.latitude,
        p.longitude,
        p.verification_status,

        u.email AS customer_email,
        u.full_name AS registered_customer_name,
        u.mobile AS registered_customer_mobile

      FROM appointments a

      LEFT JOIN properties p
        ON a.property_id = p.id

      LEFT JOIN users u
        ON a.user_id = u.id

      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Legal Team Appointment By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
};

