
const pool = require("../config/db");

// Check the logged-in user's current role in the database.
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const result = await pool.query(
        "SELECT role, status FROM users WHERE id = $1",
        [userId]
      );

      if (
        result.rows.length === 0 ||
        result.rows[0].status !== "active"
      ) {
        return res.status(403).json({
          success: false,
          message: "Account is inactive or not authorized.",
        });
      }

      const userRole = String(result.rows[0].role || "").toLowerCase();
      const permittedRoles = allowedRoles.map((role) =>
        role.toLowerCase()
      );

      if (!permittedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You do not have permission.",
        });
      }

      req.user.role = userRole;
      return next();
    } catch (error) {
      console.error("Authorization Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to verify permissions.",
      });
    }
  };
};

module.exports = authorizeRoles;
