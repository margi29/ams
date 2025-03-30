const mongoose = require("mongoose");

const assetRequestSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date, default: null }, // Tracks when request is resolved
  },
  { timestamps: true } // Enables createdAt and updatedAt
);

const AssetRequest = mongoose.model("AssetRequest", assetRequestSchema);
module.exports = AssetRequest;