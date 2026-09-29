const pool = require("../../config/db");

// =====================================================
// GET ALL BACKUPS
// =====================================================

const getAllBackups = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.backup_name,
        b.backup_type,
        b.backup_file,
        b.backup_size,
        b.status,
        b.started_at,
        b.completed_at,
        b.created_by,
        b.remarks,
        b.created_at,
        b.updated_at,

        u.full_name AS created_by_name,
        u.email AS created_by_email

      FROM database_backups b

      LEFT JOIN users u
        ON b.created_by = u.id

      ORDER BY b.created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Backup records fetched successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Backups Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch backup records.",
    });
  }
};

// =====================================================
// GET BACKUP BY ID
// =====================================================

const getBackupById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.backup_name,
        b.backup_type,
        b.backup_file,
        b.backup_size,
        b.status,
        b.started_at,
        b.completed_at,
        b.created_by,
        b.remarks,
        b.created_at,
        b.updated_at,

        u.full_name AS created_by_name,
        u.email AS created_by_email

      FROM database_backups b

      LEFT JOIN users u
        ON b.created_by = u.id

      WHERE b.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Backup record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Backup record fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get Backup By ID Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch backup record.",
    });
  }
};

// =====================================================
// CREATE BACKUP RECORD
// =====================================================

const createBackup = async (req, res) => {
  try {
    const {
      backup_name,
      backup_type,
      backup_file,
      backup_size,
      status,
      started_at,
      completed_at,
      remarks,
    } = req.body;

    if (!backup_name) {
      return res.status(400).json({
        success: false,
        message: "Backup name is required.",
      });
    }

    const createdBy = req.user?.id || null;

    const result = await pool.query(
      `
      INSERT INTO database_backups (
        backup_name,
        backup_type,
        backup_file,
        backup_size,
        status,
        started_at,
        completed_at,
        created_by,
        remarks
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
        $9
      )
      RETURNING *
      `,
      [
        backup_name,
        backup_type || "manual",
        backup_file || null,
        backup_size || null,
        status || "completed",
        started_at || new Date(),
        completed_at || new Date(),
        createdBy,
        remarks || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Backup record created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create Backup Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create backup record.",
    });
  }
};

// =====================================================
// UPDATE BACKUP STATUS
// =====================================================

const updateBackupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "running",
      "completed",
      "failed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: pending, running, completed, failed.",
      });
    }

    const result = await pool.query(
      `
      UPDATE database_backups
      SET
        status = $1::VARCHAR,
        completed_at =
          CASE
            WHEN $1::VARCHAR IN ('completed', 'failed')
            THEN CURRENT_TIMESTAMP
            ELSE completed_at
          END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Backup record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Backup status updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update Backup Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update backup status.",
    });
  }
};

// =====================================================
// DELETE BACKUP
// =====================================================

const deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM database_backups
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Backup record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Backup record deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete Backup Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete backup record.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllBackups,
  getBackupById,
  createBackup,
  updateBackupStatus,
  deleteBackup,
};