
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const fieldVisitMediaUpload = require("../../middleware/fieldVisitMediaUpload");

const {
  getMyVisitMedia,
  uploadVisitMedia,
  deleteVisitMedia,
} = require("../../controllers/fieldExecutive/fieldExecutiveMediaController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MEDIA FOR VISIT
router.get("/visit/:visitId", getMyVisitMedia);

// UPLOAD MEDIA
router.post(
  "/visit/:visitId",
  fieldVisitMediaUpload.single("file"),
  uploadVisitMedia
);

// DELETE MEDIA
router.delete("/:id", deleteVisitMedia);

module.exports = router;
