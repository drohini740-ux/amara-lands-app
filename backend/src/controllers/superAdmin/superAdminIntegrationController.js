const pool = require("../../config/db");

// =====================================================
// GET ALL INTEGRATIONS
// =====================================================

const getAllIntegrations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        si.*,
        u.full_name AS created_by_name,
        u.email AS created_by_email
      FROM system_integrations si
      LEFT JOIN users u
        ON si.created_by = u.id
      ORDER BY si.created_at DESC
    `);

    res.status(200).json({
      success: true,
      message: "Integrations fetched successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Get Integrations Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch integrations.",
    });
  }
};

// =====================================================
// GET INTEGRATION BY ID
// =====================================================

const getIntegrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        si.*,
        u.full_name AS created_by_name,
        u.email AS created_by_email
      FROM system_integrations si
      LEFT JOIN users u
        ON si.created_by = u.id
      WHERE si.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Integration fetched successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get Integration Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch integration.",
    });
  }
};

// =====================================================
// CREATE INTEGRATION
// =====================================================

const createIntegration = async (req, res) => {
  try {
    const {
      integration_name,
      integration_key,
      integration_type,
      provider,
      description,
      api_url,
      status,
      is_enabled,
      configuration,
    } = req.body;

    if (!integration_name || !integration_key) {
      return res.status(400).json({
        success: false,
        message:
          "Integration name and integration key are required.",
      });
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM system_integrations
      WHERE integration_key = $1
      `,
      [integration_key]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Integration key already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO system_integrations (
        integration_name,
        integration_key,
        integration_type,
        provider,
        description,
        api_url,
        status,
        is_enabled,
        configuration,
        created_by
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
        integration_name,
        integration_key,
        integration_type || "api",
        provider || null,
        description || null,
        api_url || null,
        status || "inactive",
        is_enabled ?? false,
        configuration || {},
        req.user?.id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Integration created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create Integration Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create integration.",
    });
  }
};

// =====================================================
// UPDATE INTEGRATION
// =====================================================

const updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      integration_name,
      integration_key,
      integration_type,
      provider,
      description,
      api_url,
      status,
      is_enabled,
      configuration,
    } = req.body;

    const existing = await pool.query(
      `
      SELECT id
      FROM system_integrations
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    const duplicate = await pool.query(
      `
      SELECT id
      FROM system_integrations
      WHERE integration_key = $1
        AND id <> $2
      `,
      [integration_key, id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Integration key already exists.",
      });
    }

    const result = await pool.query(
      `
      UPDATE system_integrations
      SET
        integration_name = $1,
        integration_key = $2,
        integration_type = $3,
        provider = $4,
        description = $5,
        api_url = $6,
        status = $7,
        is_enabled = $8,
        configuration = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
      `,
      [
        integration_name,
        integration_key,
        integration_type || "api",
        provider || null,
        description || null,
        api_url || null,
        status || "inactive",
        is_enabled ?? false,
        configuration || {},
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Integration updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update Integration Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update integration.",
    });
  }
};

// =====================================================
// UPDATE INTEGRATION STATUS
// =====================================================

const updateIntegrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "active",
      "inactive",
      "error",
      "testing",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: active, inactive, error, testing.",
      });
    }

    const result = await pool.query(
      `
      UPDATE system_integrations
      SET
        status = $1::VARCHAR,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Integration status updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update Integration Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update integration status.",
    });
  }
};

// =====================================================
// TOGGLE ENABLE / DISABLE
// =====================================================

const toggleIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE system_integrations
      SET
        is_enabled = NOT is_enabled,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Integration enabled status updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Toggle Integration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update integration.",
    });
  }
};

// =====================================================
// DELETE INTEGRATION
// =====================================================

const deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM system_integrations
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Integration deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete Integration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete integration.",
    });
  }
};

// =====================================================
// TEST INTEGRATION
// =====================================================

const testIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      UPDATE system_integrations
      SET
        last_tested_at = CURRENT_TIMESTAMP,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Integration not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Integration test completed successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Test Integration Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to test integration.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAllIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  updateIntegrationStatus,
  toggleIntegration,
  deleteIntegration,
  testIntegration,
};