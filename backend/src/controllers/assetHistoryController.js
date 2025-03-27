const History = require("../models/AssetHistory");

// Fetch all history (no population needed, use stored values)
// Fetch all history directly from the model (no population needed)
const getAllHistory = async (req, res) => {
  try {
    const history = await History.find()
    .populate({
      path: "assetId",
      select: "assigned_to",
      populate: { path: "assigned_to", select: "name email" }, // Fetch user details if needed
    })
     // Populating assigned_to field from Asset
      .sort({ timestamp: -1 });

    // Return the history entries with the populated assigned_to
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all history", error: error.message });
  }
};

// Fetch history by asset (populate assigned_to field from Asset)
const getHistoryByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const history = await History.find({ assetId })
    .populate({
      path: "assetId",
      select: "assigned_to",
      populate: { path: "assigned_to", select: "name email" }, // Fetch user details if needed
    })
     // Populating assigned_to field from Asset
      .sort({ timestamp: -1 });

    // Return the history entries for the specific asset with populated assigned_to
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history", error: error.message });
  }
};

// Log history function (includes assetName, assetIdNumber, userName, userRole)
const logHistory = async (assetId, assetName, assetIdNumber, userId, userName, userRole, actionType) => {
  try {
    const historyEntry = new History({
      assetId,
      assetName,
      assetIdNumber,
      userId,
      userName,
      userRole,
      actionType,
      timestamp: new Date(),
    });

    // Save the history entry to the database
    await historyEntry.save();
    console.log(`✅ History logged: ${actionType} - ${assetName}`);
  } catch (error) {
    console.error("❌ Error logging history:", error);
  }
};

module.exports = { logHistory, getAllHistory, getHistoryByAsset };
