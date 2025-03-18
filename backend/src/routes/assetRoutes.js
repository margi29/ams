const express = require("express");
const router = express.Router();
const {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getCategoriesWithAssets,
  checkAssetId,
  getAvailableAssets, // ✅ Import new function
  assignAsset, // ✅ Import assignAsset function
} = require("../controllers/assetController");

// ✅ Route to fetch all assets
router.get("/", getAllAssets);

// ✅ Route to fetch only available assets for assignment
router.get("/available", getAvailableAssets);

// ✅ Route to fetch unique categories and their assets
router.get("/categories", getCategoriesWithAssets);

// ✅ Route to fetch a single asset by ID
router.get("/:id", getAssetById);

// ✅ Route to create a new asset
router.post("/", createAsset);

// ✅ Route to check if asset ID is unique
router.get("/check-id/:id", checkAssetId);

// ✅ Route to update an asset
router.put("/:id", updateAsset);

// ✅ Route to delete an asset
router.delete("/:id", deleteAsset);

// ✅ Route to assign an asset to a user
router.post("/assign", assignAsset);

module.exports = router;
