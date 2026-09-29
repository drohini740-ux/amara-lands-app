const pool = require("../../config/db");

// ==========================================
// GET ALL APPOINTMENTS
// ==========================================
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

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

      FROM appointments a

      LEFT JOIN properties p
        ON a.property_id = p.id

      LEFT JOIN users u
        ON a.user_id = u.id

      ORDER BY a.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully.",
      appointments: result.rows,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
      error: error.message,
    });
  }
};

// ==========================================
// GET APPOINTMENT BY ID
// ==========================================
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

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email

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
    console.error("Get Appointment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointment.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE APPOINTMENT STATUS
// ==========================================
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Appointment status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE appointments
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        customer_name,
        appointment_date,
        appointment_time,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status.",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE APPOINTMENT REMARKS
// ==========================================
const updateAppointmentRemarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const result = await pool.query(
      `
      UPDATE appointments
      SET remarks = $1
      WHERE id = $2
      RETURNING
        id,
        customer_name,
        remarks
      `,
      [remarks || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment remarks updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Update Appointment Remarks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update appointment remarks.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointmentRemarks,
};