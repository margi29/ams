const Asset = require("../models/Asset");
const QRCode = require("qrcode");
const asyncHandler = require("express-async-handler");


// ✅ Fetch all asset IDs
const getAllAssetIds = asyncHandler(async (req, res) => {
  const assets = await Asset.find({}, { asset_id: 1, _id: 0 });
  res.json({ assetIds: assets.map(asset => asset.asset_id) });
});

// ✅ Get the last asset ID and generate the next one
const getLastAssetId = asyncHandler(async (req, res) => {
  const lastAsset = await Asset.findOne().sort({ asset_id: -1 }).select("asset_id");

  if (!lastAsset || !lastAsset.asset_id) {
    return res.json({ lastAssetId: "A01" }); // If no assets exist, start from A01
  }

  console.log("📢 Last Asset ID:", lastAsset.asset_id);
  const prefix = lastAsset.asset_id.charAt(0); // Extract "A"
  const numericPart = parseInt(lastAsset.asset_id.substring(1), 10);
  const nextId = `${prefix}${(numericPart + 1).toString().padStart(2, "0")}`; // A03 → A04

  res.json({ lastAssetId: nextId });
});

// ✅ Get all assets
const getAllAssets = asyncHandler(async (req, res) => {
  console.log("📢 GET /api/assets called 🚀");
  const assets = await Asset.find();
  res.json(assets);
});

// ✅ Get all available assets for assignment (optionally filter by category)
const getAvailableAssets = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const query = { status: "Available", ...(category && { category }) };

  const assets = await Asset.find(query);
  res.json(assets);
});

// ✅ Get categories and their assets
const getCategoriesWithAssets = asyncHandler(async (req, res) => {
  console.log("📢 GET /api/assets/categories called 📚");

  const assets = await Asset.find({}, "category name");
  const categoryMap = assets.reduce((acc, asset) => {
    acc[asset.category] = acc[asset.category] || [];
    acc[asset.category].push(asset.name);
    return acc;
  }, {});

  res.json(Object.entries(categoryMap).map(([category, assets]) => ({ category, assets })));
});

// ✅ Get a single asset by ID
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
});

// ✅ Check if asset ID is unique
const checkAssetId = asyncHandler(async (req, res) => {
  const existingAsset = await Asset.findOne({ asset_id: req.params.id });
  res.json({ isUnique: !existingAsset });
});



// ✅ Create a new asset with optional QR Code and image upload
const createAsset = async (req, res) => {
  try {
      const { name, manufacturer, model_no, category, status, purchase_date, warranty_expiry, description, quantity } = req.body;
      let { asset_id } = req.body; // Initial asset ID
      const imagePath = req.file ? req.file.path : null;

      if (!name || !quantity) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const createdAssets = [];
      let numericPart = parseInt(asset_id.substring(1), 10); // Extract numeric part

      for (let i = 0; i < quantity; i++) {
          const currentAssetId = `A${String(numericPart + i).padStart(2, "0")}`; // Generate unique ID
          const newAsset = new Asset({
              asset_id: currentAssetId,
              name,
              manufacturer,
              model_no,
              category,
              status,
              purchase_date,
              warranty_expiry,
              description,
              image: imagePath,
          });

          await newAsset.save();
          createdAssets.push(newAsset);
      }

      res.status(201).json({ message: "Assets added successfully", assets: createdAssets });
  } catch (error) {
      console.error("❌ Error adding assets:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};




// ✅ Update an asset
const updateAsset = async (req, res) => {
  try {
    console.log("Updating asset with ID:", req.params.id);
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);
    console.log("Form data:", req.body);

    // ... your database and file handling logic

    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    console.log("Updated Asset:", updatedAsset);

    res.json({ message: "Asset updated successfully", asset: updatedAsset });
  } catch (error) {
    console.error("Error updating asset:", error);
    console.error("Error Stack:", error.stack); // Crucial for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// ✅ Delete an asset
const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting asset with ID:", id); // ✅ Debug log

    const deletedAsset = await Asset.findByIdAndDelete(id);

    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({ message: "Asset deleted successfully", asset: deletedAsset });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ message: "Server error", error });
  }
};






module.exports = {
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
};
