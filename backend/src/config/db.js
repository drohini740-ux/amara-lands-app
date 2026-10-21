
const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");

// Load the backend .env file.
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// Create the PostgreSQL connection pool BEFORE using it.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Check the database connection without crashing the server immediately.
pool.on("connect", () => {
  console.log("PostgreSQL connection established.");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error.message);
});

// Export the pool for controllers and other backend files.
module.exports = pool;
