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
  getEmployeeAssets,
} = require("../controllers/assetController");

const { ensureEmployee, ensureAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public Routes (No authentication needed)
router.get("/all-ids", getAllAssetIds);
router.get("/last-id", getLastAssetId);
router.get("/available", getAvailableAssets);
router.get("/categories", getCategoriesWithAssets);
router.get("/check-id/:id", checkAssetId);

// Protected Routes
router.get("/", protect, getAllAssets);
router.get("/my-assets", protect, ensureEmployee, getEmployeeAssets);
router.get("/:id", protect, getAssetById);
router.post("/", protect, ensureAdmin, createAsset);
router.put("/:id", protect, ensureAdmin, updateAsset);
router.delete("/:id", protect, ensureAdmin, deleteAsset);

module.exports = router;
