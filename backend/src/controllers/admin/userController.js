const pool = require("../../config/db");

// ===========================
// Get All Users
// ===========================
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        full_name,
        mobile,
        email,
        role,
        status,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ===========================
// Update User Status
// ===========================
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET status=$1,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING *`,
      [status, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      message: "User Status Updated",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Update User Role
// ===========================
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET role=$1,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING *`,
      [role, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      message: "User Role Updated",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          id,
          full_name,
          email,
          mobile,
          role,
          status,
          created_at
       FROM users
       WHERE id=$1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const bcrypt = require("bcryptjs");

const addUser = async (req, res) => {
  try {
    const {
      full_name,
      mobile,
      email,
      password,
      role,
      status,
    } = req.body;
    const existingUser = await pool.query(
  `SELECT id FROM users
   WHERE email = $1 OR mobile = $2`,
  [email, mobile]
);

if (existingUser.rows.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Email or Mobile already exists",
  });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (
        full_name,
        mobile,
        email,
        password,
        role,
        status
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        full_name,
        mobile,
        email,
        hashedPassword,
        role,
        status,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User Added Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      mobile,
      role,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET
         full_name=$1,
         email=$2,
         mobile=$3,
         role=$4,
         status=$5,
         updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [
        full_name,
        email,
        mobile,
        role,
        status,
        req.params.id,
      ]
    );

    res.json({
      success: true,
      message: "User Updated Successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM users
       WHERE id=$1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
};