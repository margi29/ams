const express = require("express");
const { login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

// Authentication Routes
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
