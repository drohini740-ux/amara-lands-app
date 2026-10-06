
const express = require("express");

const router = express.Router();

const {
  getLegalReports,
} = require("../../controllers/legalTeam/legalTeamReportController");

const authMiddleware = require("../../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getLegalReports);

module.exports = router;

