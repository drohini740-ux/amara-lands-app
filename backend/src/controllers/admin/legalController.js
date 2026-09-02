const pool = require("../../config/db");

// ==========================================
// GET ALL LEGAL CASES - ADMIN
// ==========================================

const getAllLegalCases = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        lc.id,
        lc.property_id,
        lc.user_id,
        lc.case_title,
        lc.case_number,
        lc.court_name,
        lc.advocate_name,
        lc.hearing_date,
        lc.status,
        lc.remarks,
        lc.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

      FROM legal_cases lc

      LEFT JOIN properties p
        ON lc.property_id = p.id

      LEFT JOIN users u
        ON lc.user_id = u.id

      ORDER BY lc.id DESC
    `);

    res.status(200).json({
      success: true,
      legalCases: result.rows,
    });

  } catch (error) {
    console.error("Get Admin Legal Cases Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch legal cases",
    });
  }
};


// ==========================================
// GET SINGLE LEGAL CASE - ADMIN
// ==========================================

const getLegalCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        lc.id,
        lc.property_id,
        lc.user_id,
        lc.case_title,
        lc.case_number,
        lc.court_name,
        lc.advocate_name,
        lc.hearing_date,
        lc.status,
        lc.remarks,
        lc.created_at,

        p.property_name,
        p.survey_number,
        p.property_type,
        p.area,
        p.address,
        p.city,
        p.state,
        p.pincode,

        u.full_name AS customer_name,
        u.email AS customer_email,
        u.mobile AS customer_mobile

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
        message: "Legal Case Not Found",
      });
    }

    res.status(200).json({
      success: true,
      legalCase: result.rows[0],
    });

  } catch (error) {
    console.error("Get Admin Legal Case Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch legal case",
    });
  }
};


// ==========================================
// UPDATE LEGAL CASE - ADMIN
// ==========================================

const updateLegalCase = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      case_title,
      case_number,
      court_name,
      advocate_name,
      hearing_date,
      status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE legal_cases
      SET
        case_title = $1,
        case_number = $2,
        court_name = $3,
        advocate_name = $4,
        hearing_date = $5,
        status = $6,
        remarks = $7

      WHERE id = $8

      RETURNING *
      `,
      [
        case_title,
        case_number,
        court_name,
        advocate_name,
        hearing_date,
        status,
        remarks,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Legal Case Updated Successfully",
      legalCase: result.rows[0],
    });

  } catch (error) {
    console.error("Update Admin Legal Case Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update legal case",
    });
  }
};
const assignAdvocate = async (req, res) => {
  try {
    const { id } = req.params;
    const { advocate_name } = req.body;

    if (!advocate_name || !advocate_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Advocate name is required",
      });
    }

    const result = await pool.query(
      `
      UPDATE legal_cases
      SET advocate_name = $1
      WHERE id = $2
      RETURNING *
      `,
      [advocate_name.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Advocate Assigned Successfully",
      legalCase: result.rows[0],
    });

  } catch (error) {
    console.error("Assign Advocate Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to assign advocate",
    });
  }
};


// ==========================================
// DELETE LEGAL CASE - ADMIN
// ==========================================

const deleteLegalCase = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM legal_cases
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Legal Case Deleted Successfully",
    });

  } catch (error) {
    console.error("Delete Admin Legal Case Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete legal case",
    });
  }
};
// ==========================================
// Get Case Tracking
// ==========================================

const getCaseTracking = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        lc.id,
        lc.case_title,
        lc.case_number,
        lc.court_name,
        lc.advocate_name,
        lc.hearing_date,
        lc.status,
        lc.remarks,
        lc.created_at,

        p.property_name,
        p.survey_number,

        u.full_name AS customer_name,
        u.email AS customer_email

      FROM legal_cases lc

      LEFT JOIN properties p
        ON lc.property_id = p.id

      LEFT JOIN users u
        ON lc.user_id = u.id

      ORDER BY
        lc.hearing_date ASC NULLS LAST,
        lc.id DESC
    `);

    res.status(200).json({
      success: true,
      cases: result.rows,
    });

  } catch (error) {
    console.error("Get Case Tracking Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch case tracking",
    });
  }
};


module.exports = {
  getAllLegalCases,
  getLegalCaseById,
  updateLegalCase,
  deleteLegalCase,
  assignAdvocate,
   getCaseTracking,
};