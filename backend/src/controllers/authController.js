const bcrypt = require("bcrypt");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================


const register = async (req, res) => {
  try {
    let {
      full_name,
      mobile,
      email,
      password,
      confirm_password,
      role,
    } = req.body;

    full_name = full_name?.trim();
    mobile = mobile?.trim();
    email = email?.trim().toLowerCase();

    // Public registration is for customers only.
    const requestedRole = role?.trim().toLowerCase();

    if (requestedRole && requestedRole !== "customer") {
      return res.status(403).json({
        success: false,
        message:
          "Public registration is available for customers only.",
      });
    }

    if (
      !full_name ||
      !mobile ||
      !email ||
      !password ||
      !confirm_password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Never trust the public request to assign a privileged role.
    const safeRole = "customer";

    const userExists = await pool.query(
      `SELECT id FROM users WHERE email = $1 OR mobile = $2`,
      [email, mobile]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or Mobile already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
        (full_name, mobile, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, mobile, email, role, status`,
      [
        full_name,
        mobile,
        email,
        hashedPassword,
        safeRole,
        "active",
      ]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      token,
      user,
    });
  } catch (error) {
    // Do not send internal database errors to the client.
    console.error("Customer registration failed.");

    return res.status(500).json({
      success: false,
      message: "Unable to complete registration. Please try again.",
    });
  }
};



// ================= LOGIN =================

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    console.log("============== LOGIN ==============");
    console.log("Email:", email);

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
};