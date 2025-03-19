const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController"); // Ensure correct path

// Define routes
router.post("/login", login);

module.exports = router;
