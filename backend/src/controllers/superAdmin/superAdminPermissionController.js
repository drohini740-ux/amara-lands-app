const pool = require("../../config/db");

// GET ALL PERMISSIONS
const getAllPermissions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        permission_name,
        description,
        created_at
      FROM permissions
      ORDER BY id ASC
    `);

    return res.json({
      success: true,
      permissions: result.rows,
    });
  } catch (error) {
    console.error("SUPER ADMIN GET PERMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions.",
    });
  }
};

// GET PERMISSIONS FOR A ROLE
const getRolePermissions = async (req, res) => {
  try {
    const roleId = Number(req.params.roleId);

    const roleResult = await pool.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE id = $1
      `,
      [roleId]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.permission_name,
        p.description
      FROM permissions p
      INNER JOIN role_permissions rp
        ON rp.permission_id = p.id
      WHERE rp.role_id = $1
      ORDER BY p.id ASC
      `,
      [roleId]
    );

    return res.json({
      success: true,
      role: roleResult.rows[0],
      permissions: result.rows,
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN GET ROLE PERMISSIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions.",
    });
  }
};

// ASSIGN PERMISSION TO ROLE
const assignPermission = async (req, res) => {
  try {
    const roleId = Number(req.params.roleId);
    const { permission_id } = req.body;

    if (!permission_id) {
      return res.status(400).json({
        success: false,
        message: "Permission ID is required.",
      });
    }

    const roleResult = await pool.query(
      `
      SELECT id, role_name
      FROM roles
      WHERE id = $1
      `,
      [roleId]
    );

    if (roleResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    const permissionResult = await pool.query(
      `
      SELECT id, permission_name
      FROM permissions
      WHERE id = $1
      `,
      [permission_id]
    );

    if (permissionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission not found.",
      });
    }

    const existingAssignment = await pool.query(
      `
      SELECT id
      FROM role_permissions
      WHERE role_id = $1
      AND permission_id = $2
      `,
      [roleId, permission_id]
    );

    if (existingAssignment.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Permission is already assigned to this role.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO role_permissions
      (role_id, permission_id)
      VALUES ($1, $2)
      RETURNING id, role_id, permission_id
      `,
      [roleId, permission_id]
    );

    return res.status(201).json({
      success: true,
      message: "Permission assigned successfully.",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN ASSIGN PERMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to assign permission.",
    });
  }
};

// REMOVE PERMISSION FROM ROLE
const removePermission = async (req, res) => {
  try {
    const roleId = Number(req.params.roleId);
    const permissionId = Number(req.params.permissionId);

    const result = await pool.query(
      `
      DELETE FROM role_permissions
      WHERE role_id = $1
      AND permission_id = $2
      RETURNING id, role_id, permission_id
      `,
      [roleId, permissionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permission assignment not found.",
      });
    }

    return res.json({
      success: true,
      message: "Permission removed successfully.",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN REMOVE PERMISSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to remove permission.",
    });
  }
};

module.exports = {
  getAllPermissions,
  getRolePermissions,
  assignPermission,
  removePermission,
};