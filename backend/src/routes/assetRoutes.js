const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");

// Get all assets
router.get("/", async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
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
  

module.exports = router;