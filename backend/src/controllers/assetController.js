const Asset = require("../models/Asset");
const QRCode = require("qrcode");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose'); // Import mongoose
const { logHistory } = require('../controllers/assetHistoryController');


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

// Now, let's fix the asset creation function with better logging and truly sequential IDs
const createAsset = async (req, res) => {
  try {
    const { name, manufacturer, model_no, category, status, purchase_date, warranty_expiry, description, image, qr_code } = req.body;
    let { asset_id } = req.body;
    let { quantity = 1 } = req.body;

    // Process image
    let imagePath = image || null;
    if (req.file && !imagePath) {
      try {
        console.log("Uploading image to Cloudinary...");
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "asset_images",
          use_filename: true,
          unique_filename: false
        });
        imagePath = uploadedImage.secure_url;
        console.log("Image uploaded:", imagePath);
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Determine prefix and fetch existing asset IDs
    const prefix = asset_id && asset_id.length > 0 ? asset_id.charAt(0) : "A";
    const allAssets = await Asset.find({}).lean();
    const existingIds = allAssets
      .filter(a => a.asset_id && a.asset_id.startsWith(prefix))
      .map(a => parseInt(a.asset_id.substring(1), 10))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    // Identify gaps in sequence
    let gaps = [];
    for (let i = 1; i < Math.max(...existingIds, 0) + 1; i++) {
      if (!existingIds.includes(i)) {
        gaps.push(i);
      }
    }

    let createdAssets = [];
    let currentNumber = gaps.length > 0 ? gaps.shift() : Math.max(...existingIds, 0) + 1;

    for (let i = 0; i < quantity; i++) {
      const newAssetId = `${prefix}${String(currentNumber).padStart(2, '0')}`;

      const newAsset = new Asset({
        asset_id: newAssetId,
        name,
        manufacturer,
        model_no,
        category,
        status,
        purchase_date,
        warranty_expiry,
        description,
        image: imagePath,
        qr_code: qr_code || null,
      });

      try {
        const savedAsset = await newAsset.save();
        createdAssets.push(savedAsset);

        // Log the history after asset creation
        await logHistory(savedAsset._id,  req.user._id , "Created");

      } catch (error) {
        console.error(`Error creating asset ${newAssetId}:`, error);
        return res.status(500).json({ error: "Asset creation failed" });
      }

      // Assign next number, filling gaps first
      currentNumber = gaps.length > 0 ? gaps.shift() : currentNumber + 1;
    }

    res.status(201).json({ message: "Assets added successfully", assets: createdAssets });
  } catch (error) {
    console.error("❌ Error adding assets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


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
    
    console.log("Incoming update request:", req.body);
    
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
      asset.assigned_date = new Date(`${year}-${month}-${day}`);
    }
    
    asset.note = req.body.note || asset.note || "";
    
    // ✅ Handle Image Update - support both methods
    if (req.file) {
      // Method 1: Direct file upload via multer
      const cloudinary = require("cloudinary").v2;
      
      // Upload image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "assets",
      });
      
      console.log("Uploaded Image URL:", uploadedImage.secure_url);
      asset.image = uploadedImage.secure_url;
    } else if (req.body.image && req.body.image !== asset.image) {
      // Method 2: Image URL is provided directly from frontend
      // Only update if the image URL has changed
      console.log("Updating image URL from request body:", req.body.image);
      asset.image = req.body.image;
    }
    
    console.log("Updated asset before saving:", asset);
    
    const updatedAsset = await asset.save();
    await logHistory(updatedAsset._id, req.user._id, "Updated");
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
    await logHistory(deletedAsset._id, req.user._id, "Deleted");
    res.json({ message: "Asset deleted successfully", asset: deletedAsset });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getEmployeeAssets = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Fetch only assets assigned to the employee with status "Assigned"
    const employeeAssets = await Asset.find({ assigned_to: req.user._id, status: "Assigned" });

    res.status(200).json(employeeAssets);
  } catch (error) {
    console.error("Error fetching employee assets:", error);
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
