const mongoose = require("mongoose");

const ReturnedAssetSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    return_date: { type: Date, default: Date.now },
    reason: { type: String, trim: true, required: true }, // Required return reason
    additionalNotes: { type: String, trim: true } // Optional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnedAsset", ReturnedAssetSchema);