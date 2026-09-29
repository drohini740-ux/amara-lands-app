const pool = require("../../config/db");

// =====================================================
// GET ALL LEGAL CONSULTATIONS
// GET /api/v1/legal-team/consultations
// =====================================================

const getAllConsultations = async (req, res) => {
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,

        c.case_number,
        c.case_title,
        c.status AS case_status,

        p.property_name,
        p.survey_number

      FROM legal_consultations lc

      LEFT JOIN users u
        ON lc.user_id = u.id

      LEFT JOIN legal_cases c
        ON lc.legal_case_id = c.id

      LEFT JOIN properties p
        ON c.property_id = p.id

      ORDER BY
        lc.consultation_date DESC,
        lc.consultation_time DESC,
        lc.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal consultations fetched successfully.",
      consultations: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Consultations Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal consultations.",
    });
  }
};

// =====================================================
// GET CONSULTATION BY ID
// GET /api/v1/legal-team/consultations/:id
// =====================================================

const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,

        c.case_number,
        c.case_title,
        c.description AS case_description,
        c.status AS case_status,
        c.advocate_name,
        c.court_name,
        c.hearing_date,
        c.remarks AS case_remarks,

        p.property_name,
        p.survey_number,
        p.address,
        p.city,
        p.state,
        p.pincode

      FROM legal_consultations lc

      LEFT JOIN users u
        ON lc.user_id = u.id

      LEFT JOIN legal_cases c
        ON lc.legal_case_id = c.id

      LEFT JOIN properties p
        ON c.property_id = p.id

      WHERE lc.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal consultation not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Legal consultation fetched successfully.",
      consultation: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Legal Consultation By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal consultation.",
    });
  }
};

module.exports = {
  getAllConsultations,
  getConsultationById,
};