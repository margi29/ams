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



// Assign an asset
router.post("/assign", async (req, res) => {
  try {
    const { asset, user } = req.body;
    
    if (!asset || !user) {
      return res.status(400).json({ message: "Asset and user are required" });
    }

    // Update asset status in your database (if needed)
    await Asset.findOneAndUpdate({ name: asset }, { status: "Assigned" });

    // Log the action in history
    const newHistory = new AssetHistory({ asset, action: "Assigned", user });
    await newHistory.save();

    res.status(200).json({ message: "Asset assigned successfully", history: newHistory });
  } catch (err) {
    res.status(500).json({ message: "Error assigning asset", error: err.message });
  }
});

// Return an asset
router.post("/return", async (req, res) => {
  try {
    const { asset, user } = req.body;
    
    if (!asset || !user) {
      return res.status(400).json({ message: "Asset and user are required" });
    }

    await Asset.findOneAndUpdate({ name: asset }, { status: "Available" });

    const newHistory = new AssetHistory({ asset, action: "Returned", user });
    await newHistory.save();

    res.status(200).json({ message: "Asset returned successfully", history: newHistory });
  } catch (err) {
    res.status(500).json({ message: "Error returning asset", error: err.message });
  }
});

// Mark an asset as under maintenance
router.post("/maintenance", async (req, res) => {
  try {
    const { asset, user } = req.body;
    
    if (!asset || !user) {
      return res.status(400).json({ message: "Asset and user are required" });
    }

    await Asset.findOneAndUpdate({ name: asset }, { status: "Under Maintenance" });

    const newHistory = new AssetHistory({ asset, action: "Under Maintenance", user });
    await newHistory.save();

    res.status(200).json({ message: "Asset marked as under maintenance", history: newHistory });
  } catch (err) {
    res.status(500).json({ message: "Error updating maintenance status", error: err.message });
  }
});





// ✅ Add a new asset with QR Code generation
router.post("/assets", async (req, res) => {
  try {
    const assetData = req.body;

    // Generate QR Code (base64 image)
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(assetData));

    // Save asset with QR Code
    const newAsset = new Asset({ ...assetData, qr_code: qrCodeData });
    await newAsset.save();

    res.status(201).json(newAsset);
  } catch (error) {
    console.error("Error adding asset:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Fetch all assets (for QR Code List)
router.get("/assets", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});





console.log("Asset Model:", Asset);

module.exports = router;
