const express = require("express");
const router = express.Router();
const { assignAsset } = require("../controllers/allocationController");

// ✅ Route to assign an asset
router.post("/assign", assignAsset);

module.exports = router;
