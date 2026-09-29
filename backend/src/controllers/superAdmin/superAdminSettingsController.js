
const pool = require("../../config/db");

// =====================================================
// GET ALL SETTINGS
// =====================================================

const getAllSettings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.setting_key,
        s.setting_value,
        s.setting_type,
        s.category,
        s.description,
        s.is_editable,
        s.updated_by,
        s.created_at,
        s.updated_at,

        u.full_name AS updated_by_name,
        u.email AS updated_by_email

      FROM system_settings s

      LEFT JOIN users u
        ON s.updated_by = u.id

      ORDER BY
        s.category ASC,
        s.setting_key ASC
    `);

    return res.status(200).json({
      success: true,
      message: "System settings fetched successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Get System Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system settings.",
      error: error.message,
    });
  }
};

// =====================================================
// GET SETTING BY ID
// =====================================================

const getSettingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.setting_key,
        s.setting_value,
        s.setting_type,
        s.category,
        s.description,
        s.is_editable,
        s.updated_by,
        s.created_at,
        s.updated_at,

        u.full_name AS updated_by_name,
        u.email AS updated_by_email

      FROM system_settings s

      LEFT JOIN users u
        ON s.updated_by = u.id

      WHERE s.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "System setting fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get System Setting Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch system setting.",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE SETTING
// =====================================================

const createSetting = async (req, res) => {
  try {
    const {
      setting_key,
      setting_value,
      setting_type,
      category,
      description,
      is_editable,
    } = req.body;

    if (!setting_key) {
      return res.status(400).json({
        success: false,
        message: "Setting key is required.",
      });
    }

    const existingSetting =
      await pool.query(
        `
        SELECT id
        FROM system_settings
        WHERE setting_key = $1
        `,
        [setting_key]
      );

    if (existingSetting.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "A setting with this key already exists.",
      });
    }

    const userId = req.user?.id || null;

    const result = await pool.query(
      `
      INSERT INTO system_settings (
        setting_key,
        setting_value,
        setting_type,
        category,
        description,
        is_editable,
        updated_by
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
      RETURNING *
      `,
      [
        setting_key,
        setting_value ?? null,
        setting_type || "text",
        category || "general",
        description || null,
        is_editable !== undefined
          ? is_editable
          : true,
        userId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "System setting created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create System Setting Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create system setting.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE SETTING
// =====================================================

const updateSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      setting_value,
      setting_type,
      category,
      description,
      is_editable,
    } = req.body;

    const existingResult =
      await pool.query(
        `
        SELECT *
        FROM system_settings
        WHERE id = $1
        `,
        [id]
      );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
    }

    const existingSetting =
      existingResult.rows[0];

    if (!existingSetting.is_editable) {
      return res.status(403).json({
        success: false,
        message:
          "This system setting is not editable.",
      });
    }

    const userId = req.user?.id || null;

    const result = await pool.query(
      `
      UPDATE system_settings

      SET
        setting_value = COALESCE($1, setting_value),
        setting_type = COALESCE($2, setting_type),
        category = COALESCE($3, category),
        description = COALESCE($4, description),
        is_editable = COALESCE($5, is_editable),
        updated_by = $6,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $7

      RETURNING *
      `,
      [
        setting_value !== undefined
          ? setting_value
          : null,

        setting_type !== undefined
          ? setting_type
          : null,

        category !== undefined
          ? category
          : null,

        description !== undefined
          ? description
          : null,

        is_editable !== undefined
          ? is_editable
          : null,

        userId,
        id,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "System setting updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update System Setting Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update system setting.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE SETTING
// =====================================================

const deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const existingResult =
      await pool.query(
        `
        SELECT *
        FROM system_settings
        WHERE id = $1
        `,
        [id]
      );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
    }

    if (!existingResult.rows[0].is_editable) {
      return res.status(403).json({
        success: false,
        message:
          "This system setting cannot be deleted.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM system_settings
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: "System setting deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete System Setting Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete system setting.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSettings,
  getSettingById,
  createSetting,
  updateSetting,
  deleteSetting,
};

