const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const assetController = require("../controllers/assetController");

const router = express.Router();

// Ensure all controller functions exist before using them
if (!assetController) {
  throw new Error("Asset Controller is not properly imported or defined.");
}

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
  getEmployeeAssets,
} = assetController;

// ✅ Route to fetch all asset IDs
if (getAllAssetIds) router.get("/all-ids", getAllAssetIds);
else console.error("getAllAssetIds is not defined");

// ✅ Route to get the last asset ID
if (getLastAssetId) router.get("/last-id", getLastAssetId);
else console.error("getLastAssetId is not defined");

// ✅ Route to fetch all assets
if (getAllAssets) router.get("/", getAllAssets);
else console.error("getAllAssets is not defined");

// ✅ Route to fetch only available assets for assignment
if (getAvailableAssets) router.get("/available", getAvailableAssets);
else console.error("getAvailableAssets is not defined");

// ✅ Route to fetch unique categories and their assets
if (getCategoriesWithAssets) router.get("/categories", getCategoriesWithAssets);
else console.error("getCategoriesWithAssets is not defined");

// ✅ Route to get assets assigned to an employee (Placed ABOVE `/:id` to prevent conflicts)
if (getEmployeeAssets) router.get("/my-assets", protect, getEmployeeAssets);
else console.error("getEmployeeAssets is not defined");

// ✅ Route to fetch a single asset by ID
if (getAssetById) router.get("/:id", getAssetById);
else console.error("getAssetById is not defined");

// ✅ Route to check if asset ID is unique
if (checkAssetId) router.get("/check-id/:id", checkAssetId);
else console.error("checkAssetId is not defined");

// ✅ Route to create a new asset
if (createAsset) router.post("/", createAsset);
else console.error("createAsset is not defined");

// ✅ Route to update an asset
if (updateAsset) router.put("/:id", updateAsset);
else console.error("updateAsset is not defined");

// ✅ Route to delete an asset
if (deleteAsset) router.delete("/:id", deleteAsset);
else console.error("deleteAsset is not defined");

module.exports = router;
