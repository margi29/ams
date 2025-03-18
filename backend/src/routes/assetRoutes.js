const express = require("express");
const {
  getAllAssetIds,
  getLastAssetId,
  getAllAssets,
  getAssetById,
  checkAssetId,
  createAsset,
  getAvailableAssets,
  getCategoriesWithAssets,
  updateAsset,
  deleteAsset
} = require("../controllers/assetController");

const router = express.Router();

// ✅ Fetch all asset IDs
router.get("/all-ids", getAllAssetIds);

// ✅ Get the last asset ID
router.get("/last-id", getLastAssetId);

// ✅ Get all assets
router.get("/", getAllAssets);

// ✅ Get a single asset by ID
router.get("/:id", getAssetById);

// ✅ Check if an asset ID is unique
router.get("/check-id/:id", checkAssetId);

// ✅ Create a new asset
router.post("/", createAsset);

// ✅ Get available assets (optional category filter)
router.get("/available", getAvailableAssets);

// ✅ Get asset categories and their assets
router.get("/categories", getCategoriesWithAssets);

// ✅ Update an asset
router.put("/:id", updateAsset);

// ✅ Delete an asset
router.delete("/:id", deleteAsset);

module.exports = router;