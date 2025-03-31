const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import the middleware
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect the upload route to ensure only authenticated users can upload files
router.post("/", protect, upload.single("file"), uploadImage);

module.exports = router;
