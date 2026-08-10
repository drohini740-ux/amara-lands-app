const pool = require("../config/db");

// =============================
// Add Consultation
// =============================
const addConsultation = async (req, res) => {
  try {
    const {
      legal_case_id,
      consultation_date,
      consultation_time,
      meeting_type,
      reason,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO legal_consultations
      (
        user_id,
        legal_case_id,
        consultation_date,
        consultation_time,
        meeting_type,
        reason
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        req.user.id,
        legal_case_id,
        consultation_date,
        consultation_time,
        meeting_type,
        reason,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Consultation Booked Successfully",
      consultation: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Get All Consultations
// =============================
const getConsultations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          lc.*,
          l.case_title
       FROM legal_consultations lc
       LEFT JOIN legal_cases l
       ON lc.legal_case_id=l.id
       WHERE lc.user_id=$1
       ORDER BY lc.id DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      consultations: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Get Consultation By Id
// =============================
const getConsultation = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM legal_consultations
       WHERE id=$1
       AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Consultation Not Found",
      });
    }

    res.json({
      success: true,
      consultation: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Update Consultation
// =============================
const updateConsultation = async (req, res) => {
  try {
    const {
      consultation_date,
      consultation_time,
      meeting_type,
      reason,
    } = req.body;

    const result = await pool.query(
      `UPDATE legal_consultations
       SET
       consultation_date=$1,
       consultation_time=$2,
       meeting_type=$3,
       reason=$4
       WHERE id=$5
       AND user_id=$6
       RETURNING *`,
      [
        consultation_date,
        consultation_time,
        meeting_type,
        reason,
        req.params.id,
        req.user.id,
      ]
    );

    res.json({
      success: true,
      message: "Consultation Updated",
      consultation: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Delete Consultation
// =============================
const deleteConsultation = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM legal_consultations
       WHERE id=$1
       AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    res.json({
      success: true,
      message: "Consultation Deleted",
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
  addConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation,
};