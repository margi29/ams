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

// ✅ Route to fetch all asset IDs
router.get("/all-ids", getAllAssetIds);

// ✅ Route to get the last asset ID
router.get("/last-id", getLastAssetId);

// ✅ Route to fetch all assets
router.get("/", getAllAssets);

// ✅ Route to fetch only available assets for assignment
router.get("/available", getAvailableAssets);

// ✅ Route to fetch unique categories and their assets
router.get("/categories", getCategoriesWithAssets);

// ✅ Route to fetch a single asset by ID
router.get("/:id", getAssetById);

// ✅ Route to check if asset ID is unique
router.get("/check-id/:id", checkAssetId);

// ✅ Route to create a new asset
router.post("/", createAsset);

// ✅ Route to update an asset
router.put("/:id", updateAsset);

// ✅ Route to delete an asset
router.delete("/:id", deleteAsset);

module.exports = router;
