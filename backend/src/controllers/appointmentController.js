
const pool = require("../config/db");
const {
  createNotification,
} = require("../services/notificationService");

// Only Admin and Super Admin can view/manage all appointments.
const hasGlobalAccess = (req) =>
  ["admin", "super_admin"].includes(
    String(req.user?.role || "").toLowerCase()
  );

// =======================================
// Add Appointment
// =======================================
const addAppointment = async (req, res) => {
  try {
    const {
      property_id,
      customer_name,
      phone,
      appointment_date,
      appointment_time,
      purpose,
      status,
      remarks,
    } = req.body;

    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      !property_id ||
      !customer_name ||
      !appointment_date ||
      !appointment_time
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Property, customer name, appointment date, and time are required.",
      });
    }

    // Customers can book appointments only for their own properties.
    if (!hasGlobalAccess(req)) {
      const propertyResult = await pool.query(
        "SELECT id FROM properties WHERE id = $1 AND user_id = $2",
        [property_id, user_id]
      );

      if (propertyResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You can only book appointments for your own properties.",
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO appointments (
        property_id,
        user_id,
        customer_name,
        phone,
        appointment_date,
        appointment_time,
        purpose,
        status,
        remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        property_id,
        user_id,
        customer_name,
        phone || null,
        appointment_date,
        appointment_time,
        purpose || null,
        status || "Pending",
        remarks || null,
      ]
    );

    // Do not report appointment creation as failed if notification fails.
    try {
      await createNotification(
        user_id,
        "Appointment Confirmed",
        "Your appointment has been booked successfully.",
        "Appointment"
      );
    } catch (notificationError) {
      console.error("Appointment notification failed:", notificationError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Appointment added successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Add appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create appointment.",
    });
  }
};

// =======================================
// Get Appointments
// Admin/Super Admin: all appointments
// Other users: their own appointments
// =======================================
const getAppointments = async (req, res) => {
  try {
    let query = `
      SELECT a.*, p.property_name
      FROM appointments a
      LEFT JOIN properties p ON a.property_id = p.id
    `;
    const params = [];

    if (!hasGlobalAccess(req)) {
      query += " WHERE a.user_id = $1";
      params.push(req.user.id);
    }

    query += " ORDER BY a.id DESC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      appointments: result.rows,
    });
  } catch (error) {
    console.error("Get appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointments.",
    });
  }
};

// =======================================
// Get One Appointment
// =======================================
const getAppointment = async (req, res) => {
  try {
    let query = `
      SELECT a.*, p.property_name
      FROM appointments a
      LEFT JOIN properties p ON a.property_id = p.id
      WHERE a.id = $1
    `;
    const params = [req.params.id];

    if (!hasGlobalAccess(req)) {
      query += " AND a.user_id = $2";
      params.push(req.user.id);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.json({
      success: true,
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Get appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch appointment.",
    });
  }
};

// =======================================
// Update Appointment
// Only the owner or Admin/Super Admin
// =======================================
const updateAppointment = async (req, res) => {
  try {
    const {
      property_id,
      customer_name,
      phone,
      appointment_date,
      appointment_time,
      purpose,
      status,
      remarks,
    } = req.body;

    const params = [
      property_id,
      customer_name,
      phone || null,
      appointment_date,
      appointment_time,
      purpose || null,
      status,
      remarks || null,
      req.params.id,
    ];

    let query = `
      UPDATE appointments
      SET
        property_id = $1,
        customer_name = $2,
        phone = $3,
        appointment_date = $4,
        appointment_time = $5,
        purpose = $6,
        status = COALESCE($7, status),
        remarks = $8
      WHERE id = $9
    `;

    if (!hasGlobalAccess(req)) {
      query += " AND user_id = $10";
      params.push(req.user.id);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you do not have permission to update it.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment updated successfully.",
      appointment: result.rows[0],
    });
  } catch (error) {
    console.error("Update appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update appointment.",
    });
  }
};

// =======================================
// Delete Appointment
// Only the owner or Admin/Super Admin
// =======================================
const deleteAppointment = async (req, res) => {
  try {
    let query = "DELETE FROM appointments WHERE id = $1";
    const params = [req.params.id];

    if (!hasGlobalAccess(req)) {
      query += " AND user_id = $2";
      params.push(req.user.id);
    }

    query += " RETURNING id";

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or you do not have permission to delete it.",
      });
    }

    return res.json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete appointment error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete appointment.",
    });
  }
};

module.exports = {
  addAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};


