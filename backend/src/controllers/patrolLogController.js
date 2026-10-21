
const pool = require("../config/db");

// Check whether the logged-in customer owns the property.
const checkPropertyAccess = async (propertyId, userId, userRole) => {
  if (userRole !== "customer") {
    return true;
  }

  const result = await pool.query(
    "SELECT id FROM properties WHERE id = $1 AND user_id = $2",
    [propertyId, userId]
  );

  return result.rows.length > 0;
};

// GET ALL PATROL LOGS
const getPatrolLogs = async (req, res) => {
  try {
    let query = `
      SELECT
        pl.*,
        p.property_name,
        u.full_name AS user_name
      FROM patrol_logs pl
      JOIN properties p ON pl.property_id = p.id
      JOIN users u ON pl.user_id = u.id
    `;

    const values = [];

    if (req.user.role === "customer") {
      query += " WHERE p.user_id = $1";
      values.push(req.user.id);
    }

    query += " ORDER BY pl.created_at DESC";

    const result = await pool.query(query, values);

    res.json({
      success: true,
      logs: result.rows,
    });
  } catch (err) {
    console.error("Get patrol logs error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patrol logs.",
    });
  }
};

// GET SINGLE PATROL LOG
const getPatrolLog = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      SELECT
        pl.*,
        p.property_name,
        u.full_name AS user_name
      FROM patrol_logs pl
      JOIN properties p ON pl.property_id = p.id
      JOIN users u ON pl.user_id = u.id
      WHERE pl.id = $1
    `;

    const values = [id];

    if (req.user.role === "customer") {
      query += " AND p.user_id = $2";
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol log not found.",
      });
    }

    res.json({
      success: true,
      log: result.rows[0],
    });
  } catch (err) {
    console.error("Get patrol log error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch patrol log.",
    });
  }
};

// ADD PATROL LOG
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

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required.",
      });
    }

    const hasAccess = await checkPropertyAccess(
      property_id,
      req.user.id,
      req.user.role
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You cannot add a patrol log for a property you do not own.",
      });
    }

    const result = await pool.query(
      `INSERT INTO patrol_logs (
        property_id,
        user_id,
        patrol_date,
        check_in,
        check_out,
        patrol_status,
        remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
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
      message: "Patrol log added successfully.",
      log: result.rows[0],
    });
  } catch (err) {
    console.error("Add patrol log error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to add patrol log.",
    });
  }
};

// UPDATE PATROL LOG
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

    // Check that the existing log belongs to an accessible property.
    let existingQuery = `
      SELECT pl.id
      FROM patrol_logs pl
      JOIN properties p ON pl.property_id = p.id
      WHERE pl.id = $1
    `;

    const existingValues = [id];

    if (req.user.role === "customer") {
      existingQuery += " AND p.user_id = $2";
      existingValues.push(req.user.id);
    }

    const existing = await pool.query(existingQuery, existingValues);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol log not found.",
      });
    }

    // If a new property is supplied, verify access to it too.
    if (property_id !== undefined) {
      const hasAccess = await checkPropertyAccess(
        property_id,
        req.user.id,
        req.user.role
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: "You cannot assign this log to a property you do not own.",
        });
      }
    }

    const result = await pool.query(
      `UPDATE patrol_logs
       SET
         property_id = COALESCE($1, property_id),
         patrol_date = COALESCE($2, patrol_date),
         check_in = COALESCE($3, check_in),
         check_out = COALESCE($4, check_out),
         patrol_status = COALESCE($5, patrol_status),
         remarks = COALESCE($6, remarks)
       WHERE id = $7
       RETURNING *`,
      [
        property_id ?? null,
        patrol_date ?? null,
        check_in ?? null,
        check_out ?? null,
        patrol_status ?? null,
        remarks ?? null,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Patrol log updated successfully.",
      log: result.rows[0],
    });
  } catch (err) {
    console.error("Update patrol log error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update patrol log.",
    });
  }
};

// DELETE PATROL LOG
const deletePatrolLog = async (req, res) => {
  try {
    const { id } = req.params;

    let query = `
      DELETE FROM patrol_logs pl
      USING properties p
      WHERE pl.property_id = p.id
        AND pl.id = $1
    `;

    const values = [id];

    if (req.user.role === "customer") {
      query += " AND p.user_id = $2";
      values.push(req.user.id);
    }

    query += " RETURNING pl.id";

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patrol log not found.",
      });
    }

    res.json({
      success: true,
      message: "Patrol log deleted successfully.",
    });
  } catch (err) {
    console.error("Delete patrol log error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete patrol log.",
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
