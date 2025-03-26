const ReturnedAssets = require("../models/ReturnedAssets");
const Asset = require("../models/Asset");
const { logHistory } = require('../controllers/assetHistoryController');
// 🔹 Fetch all returned asset logs
const getAllReturnedAssets = async (req, res) => {
  try {
    const returns = await ReturnedAssets.find().populate("asset employee", "name asset_id");
    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returned assets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Record a returned asset
const returnAsset = async (req, res) => {
  try {
    const { assetId, reason, additionalNotes } = req.body;
    const userId = req.user.id; // Extract user ID from token

    // Validate request
    if (!assetId || !reason) {
      return res.status(400).json({ message: "Asset ID and reason are required." });
    }

    // Find the asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    // Ensure the asset is assigned to the current employee
    if (!asset.assigned_to || asset.assigned_to.toString() !== userId) {
      return res.status(403).json({ message: "You are not assigned to this asset." });
    }

    // Create return record
    const returnedAsset = new ReturnedAssets({
      asset: assetId,
      employee: userId,
      reason,
      additionalNotes,
    });
    await returnedAsset.save();

    // Update asset status to "Available" and remove assigned_to
    asset.status = "Available";
    asset.assigned_to = null;
    asset.assigned_date = null;
    await asset.save();
    await logHistory(assetId, req.user._id, "Returned");
    res.status(200).json({ message: "Asset return request processed successfully." });
  } catch (error) {
    console.error("Return asset error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// 🔹 Export the functions
module.exports = { getAllReturnedAssets, returnAsset };