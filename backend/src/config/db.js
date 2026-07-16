const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

console.log("Loaded ENV:", process.env.DB_HOST);

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch((err) => console.error(err));

module.exports = pool;