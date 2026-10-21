
const pool = require("../config/db");
const { createNotification } = require("../services/notificationService");

// Admin, Super Admin, and Legal Team can manage all legal cases.
const hasGlobalAccess = (req) =>
  ["admin", "super_admin", "legal_team"].includes(
    String(req.user?.role || "").toLowerCase()
  );

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

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!property_id || !case_title) {
      return res.status(400).json({
        success: false,
        message: "Property and case title are required.",
      });
    }

    // Verify property exists and enforce ownership for regular users.
    let propertyQuery = "SELECT id FROM properties WHERE id = $1";
    const propertyParams = [property_id];

    if (!hasGlobalAccess(req)) {
      propertyQuery += " AND user_id = $2";
      propertyParams.push(userId);
    }

    const propertyResult = await pool.query(
      propertyQuery,
      propertyParams
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found or access denied.",
      });
    }

    const result = await pool.query(
      `INSERT INTO legal_cases (
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
        userId,
        case_title.trim(),
        case_number || null,
        court_name || null,
        advocate_name || null,
        hearing_date || null,
        status || "Pending",
        remarks || null,
      ]
    );

    // Notification failure should not undo successful case creation.
    try {
      await createNotification(
        userId,
        "Legal Case Added",
        "Legal record has been created.",
        "Legal"
      );
    } catch (notificationError) {
      console.error(
        "Legal case notification failed:",
        notificationError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Legal case added successfully.",
      legalCase: result.rows[0],
    });
  } catch (error) {
    console.error("Add legal case error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create legal case.",
    });
  }
};

// =======================================
// Get All Legal Cases
// Admin/Super Admin/Legal Team: all cases
// Other users: their own cases
// =======================================
const getLegalCases = async (req, res) => {
  try {
    let query = `
      SELECT lc.*, p.property_name
      FROM legal_cases lc
      LEFT JOIN properties p ON lc.property_id = p.id
    `;
    const params = [];

    if (!hasGlobalAccess(req)) {
      query += " WHERE lc.user_id = $1";
      params.push(req.user.id);
    }

    query += " ORDER BY lc.id DESC";

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      legalCases: result.rows,
    });
  } catch (error) {
    console.error("Get legal cases error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal cases.",
    });
  }
};

// =======================================
// Get Single Legal Case
// =======================================
const getLegalCase = async (req, res) => {
  try {
    let query = `
      SELECT lc.*, p.property_name
      FROM legal_cases lc
      LEFT JOIN properties p ON lc.property_id = p.id
      WHERE lc.id = $1
    `;
    const params = [req.params.id];

    if (!hasGlobalAccess(req)) {
      query += " AND lc.user_id = $2";
      params.push(req.user.id);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found or access denied.",
      });
    }

    return res.json({
      success: true,
      legalCase: result.rows[0],
    });
  } catch (error) {
    console.error("Get legal case error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal case.",
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

    const { id } = req.params;

    if (!property_id || !case_title) {
      return res.status(400).json({
        success: false,
        message: "Property and case title are required.",
      });
    }

    // Confirm that the selected property is accessible.
    let propertyQuery = "SELECT id FROM properties WHERE id = $1";
    const propertyParams = [property_id];

    if (!hasGlobalAccess(req)) {
      propertyQuery += " AND user_id = $2";
      propertyParams.push(req.user.id);
    }

    const propertyResult = await pool.query(
      propertyQuery,
      propertyParams
    );

    if (propertyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found or access denied.",
      });
    }

    let query = `
      UPDATE legal_cases
      SET
        property_id = $1,
        case_title = $2,
        case_number = $3,
        court_name = $4,
        advocate_name = $5,
        hearing_date = $6,
        status = $7,
        remarks = $8
      WHERE id = $9
    `;

    const params = [
      property_id,
      case_title.trim(),
      case_number || null,
      court_name || null,
      advocate_name || null,
      hearing_date || null,
      status || "Pending",
      remarks || null,
      id,
    ];

    if (!hasGlobalAccess(req)) {
      query += " AND user_id = $10";
      params.push(req.user.id);
    }

    query += " RETURNING *";

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found or access denied.",
      });
    }

    return res.json({
      success: true,
      message: "Legal case updated successfully.",
      legalCase: result.rows[0],
    });
  } catch (error) {
    console.error("Update legal case error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update legal case.",
    });
  }
};

// =======================================
// Delete Legal Case
// =======================================
const deleteLegalCase = async (req, res) => {
  try {
    let query = "DELETE FROM legal_cases WHERE id = $1";
    const params = [req.params.id];

    if (!hasGlobalAccess(req)) {
      query += " AND user_id = $2";
      params.push(req.user.id);
    }

    query += " RETURNING id";

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Legal case not found or access denied.",
      });
    }

    return res.json({
      success: true,
      message: "Legal case deleted successfully.",
    });
  } catch (error) {
    console.error("Delete legal case error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to delete legal case.",
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
