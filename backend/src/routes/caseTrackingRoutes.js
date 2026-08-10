const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getCaseTracking,
} = require("../controllers/caseTrackingController");

router.use(verifyToken);

router.get("/", getCaseTracking);

module.exports = router;