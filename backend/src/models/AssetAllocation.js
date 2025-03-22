const mongoose = require('mongoose');

// Assuming you have an Asset model
const Asset = require('./Asset');

const allocationSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true }, // Asset reference
  assignedTo: { type: String, required: true },
  assignmentDate: { type: Date, required: true },
  category: { type: String },
  department: { type: String },
  location: { type: String },
  note: { type: String },
});

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;
