
const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../../middleware/authMiddleware"
);

const fieldDocumentUpload =
  require(
    "../../middleware/fieldDocumentUpload"
  );

const {
  getMyDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
} = require(
  "../../controllers/fieldExecutive/fieldExecutiveDocumentController"
);

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authMiddleware);

// =====================================================
// GET MY DOCUMENTS
// =====================================================

router.get(
  "/",
  getMyDocuments
);

// =====================================================
// UPLOAD DOCUMENT
// =====================================================

router.post(
  "/",
  fieldDocumentUpload.single("file"),
  uploadDocument
);

// =====================================================
// GET DOCUMENT BY ID
// =====================================================

router.get(
  "/:id",
  getDocumentById
);

// =====================================================
// DELETE DOCUMENT
// =====================================================

router.delete(
  "/:id",
  deleteDocument
);

module.exports = router;

