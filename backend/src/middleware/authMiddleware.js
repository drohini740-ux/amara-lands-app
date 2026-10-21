
const jwt = require("jsonwebtoken");

// =====================================================
// AUTHENTICATION MIDDLEWARE
// Verifies the JWT token for protected API routes.
// =====================================================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check whether the Authorization header exists.
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // Require the format: Bearer <token>
  const parts = authHeader.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    !parts[1]
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  // Ensure the JWT secret is configured.
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Authentication service is not configured.",
    });
  }

  try {
    // Verify the token's signature and expiration.
    const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);

    // Make the authenticated user's information available
    // to controllers and other middleware.
    req.user = decoded;

    return next();
 } catch (error) {
  console.error("JWT verification failed:", {
    name: error.name,
    message: error.message,
  });

  return res.status(401).json({
    success: false,
    message: "Invalid or expired authentication token.",
  });
}
};

module.exports = authMiddleware;
