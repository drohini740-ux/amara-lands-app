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
    } = req.body;

    full_name = full_name?.trim();
    mobile = mobile?.trim();
    email = email?.trim().toLowerCase();

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

    const userExists = await pool.query(
      `SELECT id FROM users WHERE email=$1 OR mobile=$2`,
      [email, mobile]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or Mobile already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Generated Hash:", hashedPassword);

    const result = await pool.query(
      `INSERT INTO users
      (full_name,mobile,email,password)
      VALUES($1,$2,$3,$4)
      RETURNING id,full_name,mobile,email,role`,
      [
        full_name,
        mobile,
        email,
        hashedPassword
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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
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
    console.log("Password:", password);

    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = result.rows[0];

    console.log("Database User:", user.email);
    console.log("Stored Hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

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
      },
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

module.exports = {
  register,
  login,
};