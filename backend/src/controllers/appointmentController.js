const pool = require("../config/db");
const {
  createNotification,
} = require("../services/notificationService");
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

    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO appointments
      (
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        property_id,
        user_id,
        customer_name,
        phone,
        appointment_date,
        appointment_time,
        purpose,
        status,
        remarks,
      ]
    );
    await createNotification(
    user_id,
    "Appointment Confirmed",
    "Your appointment has been booked successfully.",
    "Appointment"
);

    res.status(201).json({
      success: true,
      message: "Appointment Added Successfully",
      appointment: result.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =======================================
// Get All Appointments
// =======================================

const getAppointments = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT
          a.*,
          p.property_name
       FROM appointments a
       JOIN properties p
       ON a.property_id = p.id
       ORDER BY a.id DESC`
    );

    res.json({
      success: true,
      appointments: result.rows,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getAppointment = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          a.*,
          p.property_name
       FROM appointments a
       JOIN properties p
       ON a.property_id = p.id
       WHERE a.id=$1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment Not Found",
      });
    }

    res.json({
      success: true,
      appointment: result.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
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

    const result = await pool.query(
      `UPDATE appointments
       SET
         property_id=$1,
         customer_name=$2,
         phone=$3,
         appointment_date=$4,
         appointment_time=$5,
         purpose=$6,
         status=$7,
         remarks=$8
       WHERE id=$9
       RETURNING *`,
      [
        property_id,
        customer_name,
        phone,
        appointment_date,
        appointment_time,
        purpose,
        status,
        remarks,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      message: "Appointment Updated Successfully",
      appointment: result.rows[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM appointments WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Appointment Deleted Successfully",
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
  addAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};