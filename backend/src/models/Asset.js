const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  asset_id: { type: String, required: true, unique: true },
  name: String,
  manufacturer: String,
  model_no: String,
  category: String,
  status: String,
  purchase_date: Date,
  warranty_expiry: Date,
  location: String,
  description: String,
  qr_code: String, // 🆕 Stores the base64-encoded QR code
});

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;
