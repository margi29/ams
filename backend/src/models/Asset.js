const mongoose = require("mongoose");

// Function to format date as DD-MM-YYYY
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const AssetSchema = new mongoose.Schema({
  asset_id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  manufacturer: String,
  model_no: String,
  category: { 
    type: String, 
    required: true, 
    set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  },
  status: {
    type: String,
    enum: ["Available", "Assigned", "Under Maintenance", "Discarded"],
    default: "Available",
  },
  purchase_date: { type: Date, get: formatDate },
  warranty_expiry: { type: Date, get: formatDate },
  description: String,
  qr_code: String,
  image: { type: String }, // ✅ Store image path 

  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  assigned_date: { type: Date, default: null, get: formatDate },
  note: String, 
}, { 
  timestamps: true,
  toJSON: { getters: true }, // Enable formatting when returning JSON
  toObject: { getters: true }
});

const Asset = mongoose.model("Asset", AssetSchema);

module.exports = Asset;
