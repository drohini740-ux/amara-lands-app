const pool = require("../config/db");

// =======================================
// Add Legal Case
// =======================================

const addLegalCase = async (req, res) => {
  try {
    const {
      property_id,
      case_title,
      case_number,
      court_name,
      advocate_name,
      hearing_date,
      status,
      remarks,
    } = req.body;

    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO legal_cases
      (
        property_id,
        user_id,
        case_title,
        case_number,
        court_name,
        advocate_name,
        hearing_date,
        status,
        remarks
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        property_id,
        user_id,
        case_title,
        case_number,
        court_name,
        advocate_name,
        hearing_date,
        status,
        remarks,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Legal Case Added Successfully",
      legalCase: result.rows[0],
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
// Get All Legal Cases
// =======================================

const getLegalCases = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        lc.*,
        p.property_name
      FROM legal_cases lc
      JOIN properties p
      ON lc.property_id = p.id
      ORDER BY lc.id DESC`
    );

    res.json({
      success: true,
      legalCases: result.rows,
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
// Get Single Legal Case
// =======================================

const getLegalCase = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM legal_cases
       WHERE id=$1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.json({
      success: true,
      legalCase: result.rows[0],
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
// Update Legal Case
// =======================================

const updateLegalCase = async (req, res) => {
  try {
    const {
      property_id,
      case_title,
      case_number,
      court_name,
      advocate_name,
      hearing_date,
      status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `UPDATE legal_cases
       SET
         property_id=$1,
         case_title=$2,
         case_number=$3,
         court_name=$4,
         advocate_name=$5,
         hearing_date=$6,
         status=$7,
         remarks=$8
       WHERE id=$9
       RETURNING *`,
      [
        property_id,
        case_title,
        case_number,
        court_name,
        advocate_name,
        hearing_date,
        status,
        remarks,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.json({
      success: true,
      message: "Legal Case Updated Successfully",
      legalCase: result.rows[0],
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
// Delete Legal Case
// =======================================

const deleteLegalCase = async (req, res) => {

  try {

    const result = await pool.query(
      `DELETE FROM legal_cases
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal Case Not Found",
      });
    }

    res.json({
      success: true,
      message: "Legal Case Deleted Successfully",
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
  addLegalCase,
  getLegalCases,
  getLegalCase,
  updateLegalCase,
  deleteLegalCase,
};