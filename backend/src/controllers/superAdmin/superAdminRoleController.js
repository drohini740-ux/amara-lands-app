const pool = require("../../config/db");

// GET ALL ROLES
const getAllRoles = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        role_name
      FROM roles
      ORDER BY id ASC
    `);

    return res.json({
      success: true,
      roles: result.rows,
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN GET ROLES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles.",
    });
  }
};

// GET ROLE BY ID
const getRoleById = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        role_name
      FROM roles
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    return res.json({
      success: true,
      role: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN GET ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch role.",
    });
  }
};

// CREATE ROLE
const createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: "Role name is required.",
      });
    }

    const existingRole = await pool.query(
      `
      SELECT id
      FROM roles
      WHERE LOWER(role_name) = LOWER($1)
      `,
      [role_name.trim()]
    );

    if (existingRole.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Role already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO roles (role_name)
      VALUES ($1)
      RETURNING
        id,
        role_name
      `,
      [role_name.trim()]
    );

    return res.status(201).json({
      success: true,
      message: "Role created successfully.",
      role: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN CREATE ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create role.",
    });
  }
};

// UPDATE ROLE
const updateRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: "Role name is required.",
      });
    }

    const roleExists = await pool.query(
      `
      SELECT id
      FROM roles
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (roleExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    const duplicateRole = await pool.query(
      `
      SELECT id
      FROM roles
      WHERE LOWER(role_name) = LOWER($1)
        AND id != $2
      `,
      [
        role_name.trim(),
        req.params.id,
      ]
    );

    if (duplicateRole.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Another role already has this name.",
      });
    }

    const result = await pool.query(
      `
      UPDATE roles
      SET role_name = $1
      WHERE id = $2
      RETURNING
        id,
        role_name
      `,
      [
        role_name.trim(),
        req.params.id,
      ]
    );

    return res.json({
      success: true,
      message: "Role updated successfully.",
      role: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN UPDATE ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update role.",
    });
  }
};

// DELETE ROLE
const deleteRole = async (req, res) => {
  try {
    const roleId = Number(req.params.id);

    // Check whether users are using this role
    const usersResult = await pool.query(
      `
      SELECT COUNT(*) AS user_count
      FROM users u
      JOIN roles r
        ON LOWER(u.role) = LOWER(r.role_name)
      WHERE r.id = $1
      `,
      [roleId]
    );

    const userCount = Number(
      usersResult.rows[0].user_count
    );

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This role cannot be deleted because users are assigned to it.",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM roles
      WHERE id = $1
      RETURNING id, role_name
      `,
      [roleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Role not found.",
      });
    }

    return res.json({
      success: true,
      message: "Role deleted successfully.",
      role: result.rows[0],
    });
  } catch (error) {
    console.error(
      "SUPER ADMIN DELETE ROLE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete role.",
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};