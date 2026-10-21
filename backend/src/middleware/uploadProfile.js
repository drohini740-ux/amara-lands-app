
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Always use the same upload directory as server.js.
const uploadDir = path.join(__dirname, "../uploads");

// Create the directory if it does not exist.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    cb(null, `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

// Only allow common image formats.
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, WEBP, and GIF images are allowed.")
      );
    }

    cb(null, true);
  },
});

module.exports = upload;
