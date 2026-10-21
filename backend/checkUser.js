require("dotenv").config({ path: "./.env" });

const { Client } = require("pg");

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function checkUser() {
  try {
    await client.connect();

    console.log("Connected database:", process.env.DB_NAME);

    const result = await client.query(
      `SELECT
         id,
         email,
         role,
         status,
         LENGTH(password) AS hash_length
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      ["drohini740@gmail.com"]
    );

    if (result.rows.length === 0) {
      console.log("RESULT: User not found in this database.");
    } else {
      console.table(result.rows);
    }
  } catch (error) {
    console.error("Database check failed:", error.message);
  } finally {
    await client.end();
  }
}

checkUser();