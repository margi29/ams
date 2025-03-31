const express = require("express");
const { assignAsset } = require("../controllers/allocationController");
const { protect } = require("../middleware/authMiddleware"); // Authentication middleware
const { ensureAdmin } = require("../middleware/roleMiddleware"); // Role-based access control

const router = express.Router();

// ✅ Protect route (authentication) + Restrict to Admins only
router.post("/assign", protect, ensureAdmin, assignAsset);

module.exports = router;
