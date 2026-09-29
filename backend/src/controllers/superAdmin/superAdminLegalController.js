const pool = require("../../config/db");

// =====================================================
// GET ALL LEGAL CASES
// =====================================================
const getAllLegalCases = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        lc.id,
        lc.property_id,
        lc.user_id,
        lc.advocate_name,
        lc.case_title,
        lc.description,
        lc.status,
        lc.created_at,
        lc.case_number,
        lc.court_name,
        lc.hearing_date,
        lc.remarks,

        p.property_name,
        p.survey_number,

        u.full_name AS owner_name,
        u.mobile AS owner_mobile,
        u.email AS owner_email

      FROM legal_cases lc

      LEFT JOIN properties p
        ON lc.property_id = p.id

      LEFT JOIN users u
        ON lc.user_id = u.id

      ORDER BY lc.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal cases fetched successfully.",
      cases: result.rows,
    });
  } catch (error) {
    console.error("Get Legal Cases Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch legal cases.",
      error: error.message,
    });
  }
};

// =====================================================
// GET LEGAL CASE BY ID
// =====================================================
const getLegalCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        lc.id,
        lc.property_id,
        lc.user_id,
        lc.advocate_name,
        lc.case_title,
        lc.description,
        lc.status,
        lc.created_at,
        lc.case_number,
        lc.court_name,
        lc.hearing_date,
        lc.remarks,

        p.property_name,
        p.survey_number,

        u.full_name AS owner_name,
        u.mobile AS owner_mobile,
        u.email AS owner_email

      FROM legal_cases lc

      LEFT JOIN properties p
        ON lc.property_id = p.id

      LEFT JOIN users u
        ON lc.user_id = u.id

      WHERE lc.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal case fetched successfully.",
      case: result.rows[0],
    });
  } catch (error) {
    console.error("Get Legal Case Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch legal case.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE LEGAL CASE STATUS
// =====================================================
const updateLegalCaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE legal_cases
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        case_title,
        case_number,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal case status updated successfully.",
      case: result.rows[0],
    });
  } catch (error) {
    console.error("Update Legal Case Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update legal case status.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE LEGAL CASE
// =====================================================
const deleteLegalCase = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM legal_cases
      WHERE id = $1
      RETURNING id, case_title, case_number
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal case deleted successfully.",
      case: result.rows[0],
    });
  } catch (error) {
    console.error("Delete Legal Case Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete legal case.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL LEGAL CONSULTATIONS
// =====================================================
const getAllLegalConsultations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        lc.id,
        lc.user_id,
        lc.legal_case_id,
        lc.consultation_date,
        lc.consultation_time,
        lc.meeting_type,
        lc.reason,
        lc.status,
        lc.created_at,

        u.full_name AS user_name,
        u.mobile AS user_mobile,
        u.email AS user_email,

        cases.case_title,
        cases.case_number

      FROM legal_consultations lc

      LEFT JOIN users u
        ON lc.user_id = u.id

      LEFT JOIN legal_cases cases
        ON lc.legal_case_id = cases.id

      ORDER BY lc.id DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal consultations fetched successfully.",
      consultations: result.rows,
    });
  } catch (error) {
    console.error("Get Legal Consultations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch legal consultations.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE CONSULTATION STATUS
// =====================================================
const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const result = await pool.query(
      `
      UPDATE legal_consultations
      SET status = $1
      WHERE id = $2
      RETURNING
        id,
        legal_case_id,
        consultation_date,
        consultation_time,
        status
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal consultation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation status updated successfully.",
      consultation: result.rows[0],
    });
  } catch (error) {
    console.error("Update Consultation Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update consultation status.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllLegalCases,
  getLegalCaseById,
  updateLegalCaseStatus,
  deleteLegalCase,
  getAllLegalConsultations,
  updateConsultationStatus,
};