const mongoose = require('mongoose');

const assetCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('AssetCategory', assetCategorySchema);
