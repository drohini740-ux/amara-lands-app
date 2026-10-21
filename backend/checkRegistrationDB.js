
require("dotenv").config({ path: "./.env" });

const pool = require("./src/config/db");

async function checkDatabase() {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        inet_server_addr() AS server_address,
        inet_server_port() AS server_port
    `);

    console.log("Backend database connection:");
    console.table(result.rows);

    const users = await pool.query(
      `SELECT id, email, role, status,
              LENGTH(password) AS hash_length
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      ["drohini740@gmail.com"]
    );

    console.log("Registration account:");
    console.table(users.rows);
  } catch (error) {
    console.error("Database check failed:", error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();
