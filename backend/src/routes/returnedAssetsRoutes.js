const express = require("express");
const router = express.Router();
const { getAllReturnedAssets, returnAsset } = require("../controllers/returnedAssetsController");

// 🔹 Route to fetch all returned assets
router.get("/", getAllReturnedAssets);

// 🔹 Route to return an asset
router.post("/return", returnAsset);

module.exports = router;
