
const pool = require("../../config/db");

// =====================================================
// GET ALL AUDIT LOGS
// =====================================================

const getAllAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.user_id,
        a.action,
        a.module,
        a.entity_type,
        a.entity_id,
        a.description,
        a.old_values,
        a.new_values,
        a.ip_address,
        a.user_agent,
        a.created_at,

        u.full_name,
        u.email,
        u.role

      FROM audit_logs a

      LEFT JOIN users u
        ON a.user_id = u.id

      ORDER BY a.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      message: "Audit logs fetched successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Get Audit Logs Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs.",
      error: error.message,
    });
  }
};

// =====================================================
// GET AUDIT LOG BY ID
// =====================================================

const getAuditLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.user_id,
        a.action,
        a.module,
        a.entity_type,
        a.entity_id,
        a.description,
        a.old_values,
        a.new_values,
        a.ip_address,
        a.user_agent,
        a.created_at,

        u.full_name,
        u.email,
        u.role

      FROM audit_logs a

      LEFT JOIN users u
        ON a.user_id = u.id

      WHERE a.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit log fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get Audit Log Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit log.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE AUDIT LOG
// =====================================================

const createAuditLog = async (req, res) => {
  try {
    const {
      action,
      module,
      entity_type,
      entity_id,
      description,
      old_values,
      new_values,
      ip_address,
      user_agent,
    } = req.body;

    if (!action || !module) {
      return res.status(400).json({
        success: false,
        message:
          "Action and module are required.",
      });
    }

    const userId = req.user?.id || null;

    const result = await pool.query(
      `
      INSERT INTO audit_logs (
        user_id,
        action,
        module,
        entity_type,
        entity_id,
        description,
        old_values,
        new_values,
        ip_address,
        user_agent
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10
      )
      RETURNING *
      `,
      [
        userId,
        action,
        module,
        entity_type || null,
        entity_id || null,
        description || null,
        old_values || null,
        new_values || null,
        ip_address ||
          req.ip ||
          null,
        user_agent ||
          req.get("user-agent") ||
          null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Audit log created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create Audit Log Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create audit log.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE AUDIT LOG
// =====================================================

const deleteAuditLog = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM audit_logs
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Audit log deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete Audit Log Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete audit log.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogById,
  createAuditLog,
  deleteAuditLog,
};
