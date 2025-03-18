const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  asset_id: { type: String, unique: true, required: true }, // ✅ Unique asset identifier
  name: { type: String, required: true }, // ✅ Asset name is required
  manufacturer: String,
  model_no: String,
  category: { type: String, required: true }, // ✅ Category is required
  status: {
    type: String,
    enum: ["Available", "Assigned", "Under Maintenance", "Discarded"],
    default: "Available",
  }, // ✅ Better status management with enums
  purchase_date: Date,
  warranty_expiry: Date,
  location: String,
  description: String,
  qr_code: String, // 🆕 Stores the base64-encoded QR code

  // ✅ Assigned details
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }, // Reference to the User ObjectId
  assigned_date: { type: Date, default: null }, // ✅ Date when assigned
  note: String, // ✅ Optional note for assignment details

  // ✅ Timestamps to track changes
}, { timestamps: true });

const Asset = mongoose.model("Asset", AssetSchema);

module.exports = Asset;
