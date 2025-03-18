const express = require("express");
const AssetHistory = require("../models/AssetHistory");

const router = express.Router();

// Get all asset history
router.get("/", async (req, res) => {
  try {
    const history = await AssetHistory.find().sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
});

// Log an asset action (Assign, Return, Maintenance)
router.post("/", async (req, res) => {
  try {
    const { asset, action, user } = req.body;

    if (!asset || !action || !user) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newHistory = new AssetHistory({ asset, action, user });
    await newHistory.save();

    res.status(201).json({ message: "Asset history updated", history: newHistory });
  } catch (err) {
    res.status(500).json({ message: "Error saving history", error: err.message });
  }
});

module.exports = router;
