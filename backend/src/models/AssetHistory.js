const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  actionType: { type: String, required: true }, // e.g., "added", "updated"
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
