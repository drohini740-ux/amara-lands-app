
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const {
  getSecurityVisits,
  getSecurityVisitById,
} = require(
  "../../controllers/security/securityVisitController"
);

// Require authentication for every route
router.use(authMiddleware);

// GET /api/v1/security/visits
router.get("/", getSecurityVisits);

// GET /api/v1/security/visits/:id
router.get("/:id", getSecurityVisitById);

module.exports = router;

