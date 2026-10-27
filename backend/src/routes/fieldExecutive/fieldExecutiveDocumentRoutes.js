
const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const fieldDocumentUpload = require("../../middleware/fieldDocumentUpload");

const {
  getMyDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
} = require("../../controllers/fieldExecutive/fieldExecutiveDocumentController");

// Require authentication and Field Executive role.
router.use(authMiddleware, authorizeRoles("field_executive"));

// GET MY DOCUMENTS
router.get("/", getMyDocuments);

// UPLOAD DOCUMENT
router.post(
  "/",
  fieldDocumentUpload.single("file"),
  uploadDocument
);

// GET DOCUMENT BY ID
router.get("/:id", getDocumentById);

// DELETE DOCUMENT
router.delete("/:id", deleteDocument);

module.exports = router;
