const mongoose = require("mongoose");

const ReturnedAssetSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    asset_id: { type: String, required: true }, // Storing asset ID separately
    asset_name: { type: String, required: true, trim: true }, // Storing asset name separately
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employee_name: { type: String, required: true },
    return_date: { type: Date, default: Date.now },
    reason: { type: String, trim: true, required: true }, // Required return reason
    additionalNotes: { type: String, trim: true } // Optional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnedAsset", ReturnedAssetSchema);
