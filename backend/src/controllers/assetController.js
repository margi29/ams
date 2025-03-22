const Asset = require("../models/Asset");
const QRCode = require("qrcode");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose'); // Import mongoose


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
  const prefix = lastAsset.asset_id.charAt(0); // Extract "A"
  const numericPart = parseInt(lastAsset.asset_id.substring(1), 10);
  const nextId = `${prefix}${(numericPart + 1).toString().padStart(2, "0")}`; // A03 → A04

  res.json({ lastAssetId: nextId });
});

// ✅ Get all assets
const getAllAssets = asyncHandler(async (req, res) => {
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

// ✅ Create a new asset with optional QR Code generation
const createAsset = asyncHandler(async (req, res) => {
  const assetData = req.body;

  // Generate QR Code (base64 image)
  const qrCodeData = await QRCode.toDataURL(JSON.stringify(assetData));
  const newAsset = new Asset({ ...assetData, qr_code: qrCodeData });

  await newAsset.save();
  res.status(201).json(newAsset);
});

// ✅ Update an asset
const updateAsset = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid asset ID" });
  }

  try {
    const asset = await Asset.findById(id);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // ✅ Update all fields
    asset.name = req.body.name || asset.name;
    asset.manufacturer = req.body.manufacturer || asset.manufacturer;
    asset.model_no = req.body.model_no || asset.model_no;
    asset.category = req.body.category || asset.category;
    asset.status = req.body.status || asset.status;
    asset.purchase_date = req.body.purchase_date || asset.purchase_date;
    asset.warranty_expiry = req.body.warranty_expiry || asset.warranty_expiry;
    asset.location = req.body.location || asset.location;
    asset.description = req.body.description || asset.description;
    asset.assigned_to = req.body.assigned_to || asset.assigned_to || null;

    // ✅ Convert assigned_date if present
    if (req.body.assigned_date) {
      const [day, month, year] = req.body.assigned_date.split("-");
      asset.assigned_date = new Date(`${year}-${month}-${day}`); // Convert to valid Date
    }

    asset.note = req.body.note || asset.note || "";

    console.log("Updated asset before saving:", asset); // Log updated asset

    const updatedAsset = await asset.save();
    res.status(200).json({ message: "Asset updated successfully", asset: updatedAsset });
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: "Internal server error" });
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

const getEmployeeAssets = async (req, res) => {
  try {

    if (!req.user || !req.user._id) {
      console.log("⚠️ No user ID found in request.");
      return res.status(401).json({ message: "Unauthorized access" });
    }


    const employeeAssets = await Asset.find({ assigned_to: req.user._id });


    if (!employeeAssets.length) {
      console.log("⚠️ No assets assigned to this user.");
      return res.status(200).json([]);
    }

    res.status(200).json(employeeAssets);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
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
  deleteAsset,
  getEmployeeAssets
};
