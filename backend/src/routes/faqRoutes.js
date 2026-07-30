const express = require("express");
const router = express.Router();
const { getFAQs } = require("../controllers/faqController");

router.get("/", getFAQs);

module.exports = router;