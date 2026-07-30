const pool = require("../config/db");

// ==============================
// Get All Field Visits
// ==============================
const getFieldVisits = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        fv.*,
        p.property_name,
        u.full_name AS user_name
      FROM field_visits fv
      JOIN properties p
        ON fv.property_id = p.id
      JOIN users u
        ON fv.user_id = u.id
      ORDER BY fv.created_at DESC
      `
    );

    res.json({
      success: true,
      visits: result.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Get Single Field Visit
// ==============================
const getFieldVisit = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        fv.*,
        p.property_name,
        u.full_name AS user_name
      FROM field_visits fv
      JOIN properties p
        ON fv.property_id = p.id
      JOIN users u
        ON fv.user_id = u.id
      WHERE fv.id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field Visit not found",
      });
    }

    res.json({
      success: true,
      visit: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Add Field Visit
// ==============================
const addFieldVisit = async (req, res) => {
  try {
    const {
      property_id,
      visit_date,
      check_in,
      check_out,
      visit_status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO field_visits
      (
        property_id,
        user_id,
        visit_date,
        check_in,
        check_out,
        visit_status,
        remarks
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        property_id,
        req.user.id,
        visit_date,
        check_in,
        check_out,
        visit_status,
        remarks,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Field Visit Added Successfully",
      visit: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==============================
// Update Field Visit
// ==============================
const updateFieldVisit = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      property_id,
      visit_date,
      check_in,
      check_out,
      visit_status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE field_visits
      SET
        property_id=$1,
        visit_date=$2,
        check_in=$3,
        check_out=$4,
        visit_status=$5,
        remarks=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        property_id,
        visit_date,
        check_in,
        check_out,
        visit_status,
        remarks,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field Visit not found",
      });
    }

    res.json({
      success: true,
      message: "Field Visit Updated Successfully",
      visit: result.rows[0],
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==============================
// Delete Field Visit
// ==============================
const deleteFieldVisit = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM field_visits WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Field Visit Deleted Successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getFieldVisits,
  getFieldVisit,
  addFieldVisit,
  updateFieldVisit,
  deleteFieldVisit,
};