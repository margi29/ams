const express = require("express");
const upload = require("../middleware/uploadMiddleware"); // Import the middleware
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", upload.single("file"), uploadImage);

module.exports = router;
