const pool = require("../../config/db");

// =====================================================
// GET ALL LEGAL CASES
// GET /api/v1/legal-team/cases
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,

        p.property_name,
        p.survey_number,
        p.address,
        p.city,
        p.state,
        p.pincode

      FROM legal_cases lc

      LEFT JOIN users u
        ON lc.user_id = u.id

      LEFT JOIN properties p
        ON lc.property_id = p.id

      ORDER BY lc.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Legal cases fetched successfully.",
      cases: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Legal Team Cases Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal cases.",
    });
  }
};

// =====================================================
// GET LEGAL CASE BY ID
// GET /api/v1/legal-team/cases/:id
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

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile,

        p.property_name,
        p.survey_number,
        p.address,
        p.city,
        p.state,
        p.pincode

      FROM legal_cases lc

      LEFT JOIN users u
        ON lc.user_id = u.id

      LEFT JOIN properties p
        ON lc.property_id = p.id

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
    console.error(
      "Get Legal Case By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal case.",
    });
  }
};

module.exports = {
  getAllLegalCases,
  getLegalCaseById,
};