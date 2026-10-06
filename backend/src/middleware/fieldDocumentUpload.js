
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// =====================================================
// UPLOAD DIRECTORY
// =====================================================

const uploadDirectory = path.join(
  __dirname,
  "../uploads/fieldDocuments"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// =====================================================
// STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname);

    const baseName =
      path
        .basename(
          file.originalname,
          extension
        )
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "_"
        );

    const uniqueName =
      `${Date.now()}-${baseName}${extension}`;

    cb(null, uniqueName);
  },
});

// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "application/pdf",

    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",

    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, JPEG, PNG, WEBP, DOC, DOCX, XLS and XLSX files are allowed."
      ),
      false
    );
  }
};

// =====================================================
// MULTER
// =====================================================

const fieldDocumentUpload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

module.exports =
  fieldDocumentUpload;

