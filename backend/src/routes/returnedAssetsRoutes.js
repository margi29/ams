const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getAllReturnedAssets, returnAsset } = require("../controllers/returnedAssetsController");

// Route to fetch all returned assets
router.get("/", protect ,getAllReturnedAssets);

// Route to return an asset
router.post("/return",protect , returnAsset);

module.exports = router;