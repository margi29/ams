const express = require("express");
const { protect } = require("../middleware/authMiddleware");
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
  deleteAsset,
  getEmployeeAssets
} = require("../controllers/assetController");

const router = express.Router();

// ✅ Route to fetch all asset IDs (No authentication needed)
router.get("/all-ids", getAllAssetIds);

// ✅ Route to get the last asset ID (No authentication needed)
router.get("/last-id", getLastAssetId);

// ✅ Route to fetch all assets (Should be protected if needed)
router.get("/", protect, getAllAssets);

// ✅ Route to fetch only available assets for assignment (No authentication needed)
router.get("/available", getAvailableAssets);

// ✅ Route to fetch unique categories and their assets (No authentication needed)
router.get("/categories", getCategoriesWithAssets);

// ✅ Route to get assets assigned to an employee (Already protected)
router.get("/my-assets", protect, getEmployeeAssets);

// ✅ Route to fetch a single asset by ID (Should be protected if needed)
router.get("/:id", protect, getAssetById);

// ✅ Route to check if asset ID is unique (No authentication needed)
router.get("/check-id/:id", checkAssetId);

// ✅ Route to create a new asset (Protected)
router.post("/", protect, createAsset);

// ✅ Route to update an asset (Protected)
router.put("/:id", protect, updateAsset);

// ✅ Route to delete an asset (Protected)
router.delete("/:id", protect, deleteAsset);

module.exports = router;
