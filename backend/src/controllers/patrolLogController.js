const pool = require("../config/db");

// Get All
const getPatrolLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        pl.*,
        p.property_name,
        u.full_name AS user_name
      FROM patrol_logs pl
      JOIN properties p ON pl.property_id = p.id
      JOIN users u ON pl.user_id = u.id
      ORDER BY pl.created_at DESC
    `);

    res.json({
      success: true,
      logs: result.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single
const getPatrolLog = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        pl.*,
        p.property_name,
        u.full_name AS user_name
      FROM patrol_logs pl
      JOIN properties p ON pl.property_id = p.id
      JOIN users u ON pl.user_id = u.id
      WHERE pl.id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol Log not found",
      });
    }

    res.json({
      success: true,
      log: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Add
const addPatrolLog = async (req, res) => {

  try {

    const {
      property_id,
      patrol_date,
      check_in,
      check_out,
      patrol_status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO patrol_logs
      (
        property_id,
        user_id,
        patrol_date,
        check_in,
        check_out,
        patrol_status,
        remarks
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        property_id,
        req.user.id,
        patrol_date,
        check_in,
        check_out,
        patrol_status,
        remarks,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Patrol Log Added Successfully",
      log: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Update
const updatePatrolLog = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      property_id,
      patrol_date,
      check_in,
      check_out,
      patrol_status,
      remarks,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE patrol_logs
      SET
        property_id=$1,
        patrol_date=$2,
        check_in=$3,
        check_out=$4,
        patrol_status=$5,
        remarks=$6
      WHERE id=$7
      RETURNING *
      `,
      [
        property_id,
        patrol_date,
        check_in,
        check_out,
        patrol_status,
        remarks,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Patrol Log Updated Successfully",
      log: result.rows[0],
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Delete
const deletePatrolLog = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM patrol_logs WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Patrol Log Deleted Successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getPatrolLogs,
  getPatrolLog,
  addPatrolLog,
  updatePatrolLog,
  deletePatrolLog,
};