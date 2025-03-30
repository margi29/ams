const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true }, // MongoDB _id
  assetName: { type: String, required: true }, // Asset name
  assetIdNumber: { type: String, required: true }, // Custom asset_id (e.g., laptop(01))
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  actionType: { type: String, required: true }, // Action type (Added, Deleted, etc.)
  userName: { type: String, required: true }, // Employee/Admin Name
  userRole: { type: String, required: true }, // Employee/Admin Role
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
