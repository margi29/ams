const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { ensureEmployee, ensureAdmin } = require("../middleware/roleMiddleware");
const { getAllReturnedAssets, returnAsset } = require("../controllers/returnedAssetsController");

// Admin can fetch all returned assets
router.get("/", protect, ensureAdmin, getAllReturnedAssets);

// Employee can return an asset
router.post("/", protect, ensureEmployee, returnAsset);

module.exports = router;
