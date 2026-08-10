const express = require("express");
const router = express.Router();

const {
  addConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);

router.post("/", addConsultation);
router.get("/", getConsultations);
router.get("/:id", getConsultation);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;