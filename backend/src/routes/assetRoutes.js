const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");

// Route to get all assets
router.get("/", async (req, res) => {
    console.log("GET /api/assets called 🚀");
    
    try {
        const assets = await Asset.find();
        console.log("Fetched Assets:", assets); // Log what is fetched

        res.json(assets);
    } catch (err) {
        console.error("Error fetching assets:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get a single asset by ID
router.get("/:id", async (req, res) => {
    const asset = await Asset.findById(req.params.id);
    res.json(asset);
});

// Create a new asset
router.post("/", async (req, res) => {
    try {
      const newAsset = new Asset(req.body);
      await newAsset.save();
      res.status(201).json(newAsset);
    } catch (error) {
      res.status(500).json({ message: "Error adding asset", error });
    }
  });

// Check if asset ID is unique
router.get("/check-id/:id", async (req, res) => {
  const assetId = req.params.id;
  
  try {
    // Check if the asset ID already exists in the database
    const existingAsset = await Asset.findOne({ asset_id: assetId });

    if (existingAsset) {
      return res.json({ isUnique: false }); // Asset ID already exists
    } else {
      return res.json({ isUnique: true }); // Asset ID is unique
    }
  } catch (err) {
    console.error("Error checking asset ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Update an asset
router.put("/:id", async (req, res) => {
    try {
      const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      if (!updatedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
  
      res.json({ message: "Asset updated successfully", asset: updatedAsset });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

// Delete an asset
router.delete("/:id", async (req, res) => {
    try {
      const deletedAsset = await Asset.findByIdAndDelete(req.params.id);
      if (!deletedAsset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json({ message: "Asset deleted successfully", asset: deletedAsset });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  

console.log("Asset Model:", Asset);

module.exports = router;