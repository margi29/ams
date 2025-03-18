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
  getAvailableAssets // ✅ Import assignAsset function
} = require("../controllers/assetController");

// ✅ Route to fetch all assets
router.get("/", getAllAssets);

// ✅ Route to fetch only available assets for assignment
router.get("/available", getAvailableAssets);


// ✅ Route to fetch unique categories and their assets
router.get("/categories", getCategoriesWithAssets);

router.get("/all-ids", async (req, res) => {
  try {
    const assets = await Asset.find({}, { asset_id: 1, _id: 0 }); // Fetch all asset IDs
    const assetIds = assets.map((asset) => asset.asset_id); // Extract IDs
    res.json({ assetIds });
  } catch (error) {
    console.error("❌ Error fetching asset IDs:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// FIX: Move this to the top before `router.get("/:id")`
router.get("/last-id", async (req, res) => {
  try {
    const lastAsset = await Asset.findOne().sort({ asset_id: -1 }).select("asset_id");

    if (!lastAsset || !lastAsset.asset_id) {
      return res.json({ lastAssetId: "A01" }); // If no assets exist, start from A01
    }

    console.log("Last Asset ID from DB:", lastAsset.asset_id); // Debugging Log

    const lastId = lastAsset.asset_id.trim(); // Remove any extra spaces
    const prefix = lastId.charAt(0); // Extracts "A"
    const numericPart = parseInt(lastId.substring(1), 10); // Extracts "03" → 3

    const nextId = prefix + (numericPart + 1).toString().padStart(2, "0"); // A03 → A04

    console.log("Next Asset ID Generated:", nextId); // Debugging Log

    res.json({ lastAssetId: nextId });

  } catch (error) {
    console.error("Error fetching last Asset ID:", error);
    res.status(500).json({ message: "Error fetching last Asset ID" });
  }
});





// Get a single asset by ID
router.get("/:id", async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    res.json(asset);
});

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
