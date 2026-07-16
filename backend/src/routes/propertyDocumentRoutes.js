const express = require("express");

const router = express.Router();

const upload = require("../config/upload");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require("../controllers/propertyDocumentController");

// ======================================
// Upload Document
// ======================================

router.post(
  "/:propertyId",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

// ======================================
// Get All Documents
// ======================================

router.get(
  "/:propertyId",
  authMiddleware,
  getDocuments
);

// ======================================
// Delete Document
// ======================================

router.delete(
  "/:id",
  authMiddleware,
  deleteDocument
);

module.exports = router;