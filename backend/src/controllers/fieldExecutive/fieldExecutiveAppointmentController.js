
const pool = require("../../config/db");

// =====================================================
// GET MY APPOINTMENTS
// =====================================================

const getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.property_id,
        a.user_id,

        a.customer_name,
        a.phone AS customer_phone,

        a.appointment_date,
        a.appointment_time,

        a.purpose,
        a.status,
        a.remarks,
        a.service_type,
        a.payment_status,
        a.created_at,

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

        u.full_name AS customer_full_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM appointments a

      INNER JOIN properties p
        ON p.id = a.property_id

      LEFT JOIN users u
        ON u.id = a.user_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = a.property_id

      WHERE sa.staff_id = $1

      ORDER BY
        a.appointment_date DESC,
        a.appointment_time DESC,
        a.id DESC
      `,
      [userId]
    );

    res.status(200).json({
      success: true,
      message:
        "Field Executive appointments fetched successfully.",
      appointments: result.rows,
    });
  } catch (error) {
    console.error(
      "Get My Appointments Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch appointments.",
    });
  }
};

// =====================================================
// GET APPOINTMENT BY ID
// =====================================================

const getAppointmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.property_id,
        a.user_id,

        a.customer_name,
        a.phone AS customer_phone,

        a.appointment_date,
        a.appointment_time,

        a.purpose,
        a.status,
        a.remarks,
        a.service_type,
        a.payment_status,
        a.created_at,

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

        u.full_name AS customer_full_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM appointments a

      INNER JOIN properties p
        ON p.id = a.property_id

      LEFT JOIN users u
        ON u.id = a.user_id

      INNER JOIN staff_assignments sa
        ON sa.property_id = a.property_id

      WHERE a.id = $1
        AND sa.staff_id = $2

      LIMIT 1
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Appointment fetched successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Appointment By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch appointment.",
    });
  }
};

// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================

const updateAppointmentStatus = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid appointment status.",
      });
    }

    // =================================================
    // CHECK APPOINTMENT ACCESS
    // =================================================

    const existingAppointment =
      await pool.query(
        `
        SELECT a.id
        FROM appointments a

        INNER JOIN staff_assignments sa
          ON sa.property_id = a.property_id

        WHERE a.id = $1
          AND sa.staff_id = $2

        LIMIT 1
        `,
        [id, userId]
      );

    if (
      existingAppointment.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found or not assigned to you.",
      });
    }

    // =================================================
    // UPDATE STATUS
    // =================================================

    const result = await pool.query(
      `
      UPDATE appointments
      SET
        status = $1,
        remarks = COALESCE(remarks, remarks)
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    res.status(200).json({
      success: true,
      message:
        "Appointment status updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Appointment Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update appointment status.",
    });
  }
};

module.exports = {
  getMyAppointments,
  getAppointmentById,
  updateAppointmentStatus,
};

