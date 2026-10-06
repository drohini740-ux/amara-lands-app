
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const fieldVisitMediaUpload =
  require(
    "../../middleware/fieldVisitMediaUpload"
  );

const {
  getMyVisitMedia,
  uploadVisitMedia,
  deleteVisitMedia,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveMediaController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MEDIA FOR VISIT
// =====================================================

router.get(
  "/visit/:visitId",
  getMyVisitMedia
);

// =====================================================
// UPLOAD MEDIA
// =====================================================

router.post(
  "/visit/:visitId",
  fieldVisitMediaUpload.single("file"),
  uploadVisitMedia
);

// =====================================================
// DELETE MEDIA
// =====================================================

router.delete(
  "/:id",
  deleteVisitMedia
);

module.exports = router;

