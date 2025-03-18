const mongoose = require("mongoose");

const ReturnedAssetSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    return_date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnedAssets", ReturnedAssetSchema);
