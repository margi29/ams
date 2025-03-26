const History = require("../models/AssetHistory");

const getAllHistory = async (req, res) => {
    try {
      const history = await History.find()
        .populate("userId", "name role") // Fetch user details
        .populate({
          path: "assetId",
          select: "name asset_id assigned_to",
          populate: { path: "assigned_to", select: "name" }, // ✅ Fetch employee name
        })
        .sort({ timestamp: -1 });
  
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all history", error: error.message });
    }
  };
  
  const getHistoryByAsset = async (req, res) => {
    try {
      const { assetId } = req.params;
      const history = await History.find({ assetId })
        .populate("userId", "name role")
        .populate({
          path: "assetId",
          select: "name asset_id assigned_to",
          populate: { path: "assigned_to", select: "name" }, // ✅ Fetch employee name
        })
        .sort({ timestamp: -1 });
  
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
  };
  

// Log history function (No changes needed)
const logHistory = async (assetId, userId, actionType) => {
  try {
    await History.create({ assetId, userId, actionType });
  } catch (error) {
    console.error("Failed to log history:", error.message);
  }
};

module.exports = { logHistory, getAllHistory, getHistoryByAsset };
