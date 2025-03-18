const Asset = require("../models/Asset");

// @desc Get all assets
// @route GET /api/assets
const getAllAssets = async (req, res) => {
  console.log("GET /api/assets called 🚀");

  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    console.error("Error fetching assets:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get all available assets for assignment
// @route GET /api/assets/available
// GET available assets by category
const getAvailableAssets = async (req, res) => {
    try {
      const { category } = req.query;
  
      // Find available assets with matching category
      const query = {
        status: "Available",
      };
  
      // Add category filter only if provided
      if (category) {
        query.category = category;
      }
  
      const assets = await Asset.find(query);
      res.status(200).json(assets);
    } catch (error) {
      res.status(500).json({ message: "Error fetching available assets.", error });
    }
  };
  

// @desc Get categories and their assets
// @route GET /api/assets/categories
const getCategoriesWithAssets = async (req, res) => {
  console.log("GET /api/assets/categories called 📚");

  try {
    const assets = await Asset.find({}, "category name");
    const categoryMap = {};

    assets.forEach((asset) => {
      if (!categoryMap[asset.category]) {
        categoryMap[asset.category] = [];
      }
      categoryMap[asset.category].push(asset.name);
    });

    const result = Object.keys(categoryMap).map((category) => ({
      category,
      assets: categoryMap[category],
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// @desc Get a single asset by ID
// @route GET /api/assets/:id
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json(asset);
  } catch (err) {
    console.error("Error fetching asset:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Create a new asset
// @route POST /api/assets
const createAsset = async (req, res) => {
  try {
    const newAsset = new Asset(req.body);
    await newAsset.save();
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ message: "Error adding asset", error });
  }
};

// @desc Check if asset ID is unique
// @route GET /api/assets/check-id/:id
const checkAssetId = async (req, res) => {
  const assetId = req.params.id;

  try {
    const existingAsset = await Asset.findOne({ asset_id: assetId });
    if (existingAsset) {
      return res.json({ isUnique: false });
    } else {
      return res.json({ isUnique: true });
    }
  } catch (err) {
    console.error("Error checking asset ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Update an asset
// @route PUT /api/assets/:id
const updateAsset = async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json({ message: "Asset updated successfully", asset: updatedAsset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Delete an asset
// @route DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
  try {
    const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
    if (!deletedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.json({ message: "Asset deleted successfully", asset: deletedAsset });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// POST - Assign asset to a user
const assignAsset = async (req, res) => {
    const { category, asset, assignedTo, assignmentDate, note } = req.body;
  
    if (!category || !asset || !assignedTo || !assignmentDate) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    try {
      const assetToAssign = await Asset.findOne({
        category,
        name: asset,
        status: "Available",
      });
  
      if (!assetToAssign) {
        return res.status(404).json({ error: "Asset not found or unavailable." });
      }
  
      // ✅ Update asset status to 'Assigned'
      assetToAssign.status = "Assigned";
      assetToAssign.assignedTo = assignedTo;
      assetToAssign.assignmentDate = assignmentDate;
      assetToAssign.note = note || "";
      await assetToAssign.save();
  
      res.status(200).json({ message: "Asset assigned successfully!" });
    } catch (error) {
      console.error("Error assigning asset:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

module.exports = {
  getAllAssets,
  getAvailableAssets,
  getCategoriesWithAssets,
  getAssetById,
  createAsset,
  checkAssetId,
  updateAsset,
  deleteAsset,
  assignAsset
};
