const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadProfile");

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);
router.post(
  "/profile/upload",
  authMiddleware,
  upload.single("profile"),
  uploadProfileImage,
);
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);
module.exports = router;
