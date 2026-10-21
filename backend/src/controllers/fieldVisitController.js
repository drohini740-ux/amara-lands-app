
const pool = require("../config/db");

// ==============================
// Helper: Check Property Access
// ==============================
const checkPropertyAccess = async (propertyId, userId, userRole) => {
  // Non-customer roles retain the existing access behavior.
  if (userRole !== "customer") {
    return true;
  }

  const result = await pool.query(
    `SELECT id FROM properties WHERE id = $1 AND user_id = $2`,
    [propertyId, userId]
  );

  return result.rows.length > 0;
};

// ==============================
// Get All Field Visits
// ==============================
const getFieldVisits = async (req, res) => {
  try {
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        fv.*,
        p.property_name,
        u.full_name AS user_name
      FROM field_visits fv
      JOIN properties p ON fv.property_id = p.id
      JOIN users u ON fv.user_id = u.id
    `;

    const values = [];

    // Customers see visits for their own properties only.
    if (isCustomer) {
      query += ` WHERE p.user_id = $1`;
      values.push(req.user.id);
    }

    query += ` ORDER BY fv.created_at DESC`;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      visits: result.rows,
    });
  } catch (err) {
    console.error("Get Field Visits Error:", err);

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
    const isCustomer = req.user?.role === "customer";

    let query = `
      SELECT
        fv.*,
        p.property_name,
        u.full_name AS user_name
      FROM field_visits fv
      JOIN properties p ON fv.property_id = p.id
      JOIN users u ON fv.user_id = u.id
      WHERE fv.id = $1
    `;

    const values = [id];

    if (isCustomer) {
      query += ` AND p.user_id = $2`;
      values.push(req.user.id);
    }

    const result = await pool.query(query, values);

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
    console.error("Get Field Visit Error:", err);

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

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!property_id || !visit_date) {
      return res.status(400).json({
        success: false,
        message: "Property and visit date are required",
      });
    }

    const allowed = await checkPropertyAccess(
      property_id,
      userId,
      userRole
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot create a visit for this property",
      });
    }

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
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [
        property_id,
        userId,
        visit_date,
        check_in || null,
        check_out || null,
        visit_status || "Pending",
        remarks || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Field Visit Added Successfully",
      visit: result.rows[0],
    });
  } catch (err) {
    console.error("Add Field Visit Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
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

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Ensure the existing visit is accessible.
    const existingQuery = `
      SELECT fv.id, p.user_id AS property_owner_id
      FROM field_visits fv
      JOIN properties p ON p.id = fv.property_id
      WHERE fv.id = $1
    `;

    const existing = await pool.query(existingQuery, [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field Visit not found",
      });
    }

    if (
      userRole === "customer" &&
      Number(existing.rows[0].property_owner_id) !== Number(userId)
    ) {
      return res.status(404).json({
        success: false,
        message: "Field Visit not found",
      });
    }

    const allowed = await checkPropertyAccess(
      property_id,
      userId,
      userRole
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot move this visit to another customer's property",
      });
    }

    const result = await pool.query(
      `
      UPDATE field_visits
      SET
        property_id = $1,
        visit_date = $2,
        check_in = $3,
        check_out = $4,
        visit_status = $5,
        remarks = $6
      WHERE id = $7
      RETURNING *
      `,
      [
        property_id,
        visit_date,
        check_in || null,
        check_out || null,
        visit_status,
        remarks || "",
        id,
      ]
    );

    res.json({
      success: true,
      message: "Field Visit Updated Successfully",
      visit: result.rows[0],
    });
  } catch (err) {
    console.error("Update Field Visit Error:", err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==============================
// Delete Field Visit
// ==============================
const deleteFieldVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let query = `
      DELETE FROM field_visits fv
      USING properties p
      WHERE fv.property_id = p.id
        AND fv.id = $1
    `;

    const values = [id];

    if (userRole === "customer") {
      query += ` AND p.user_id = $2`;
      values.push(userId);
    }

    query += ` RETURNING fv.id`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Field Visit not found",
      });
    }

    res.json({
      success: true,
      message: "Field Visit Deleted Successfully",
    });
  } catch (err) {
    console.error("Delete Field Visit Error:", err);

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
