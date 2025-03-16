const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  asset_id: { type: String, unique: true, required: true }, // ✅ Ensure asset_id is unique
  name: String,
  manufacturer: String,
  model_no: String,
  category: String,
  status: String,
  purchase_date: Date,
  warranty_expiry: Date,
  location: String,
  description: String,
  qr_code: String
});

module.exports = mongoose.model("Asset", AssetSchema);