const mongoose = require("mongoose");

const AssetHistorySchema = new mongoose.Schema({
  asset: { type: String, required: true },
  action: { type: String, enum: ["Assigned", "Returned", "Under Maintenance"], required: true },
  date: { type: Date, default: Date.now },
  user: { type: String, required: true },
});

module.exports = mongoose.model("AssetHistory", AssetHistorySchema);
