const express = require("express");
const { assignAsset } = require("../controllers/allocationController");
const { protect } = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// ✅ Protect this route to ensure req.user exists
router.post("/assign", protect, assignAsset);

module.exports = router;
