const pool = require("../config/db");

// Get All FAQs
const getFAQs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM faqs
       WHERE status='Active'
       ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching FAQs",
    });
  }
};

module.exports = {
  getFAQs,
};