const mongoose = require("mongoose");

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    task: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Scheduled", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);
