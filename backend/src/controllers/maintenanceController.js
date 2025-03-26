const MaintenanceRequest = require("../models/MaintenanceRequest");
const Asset = require("../models/Asset");
const { logHistory } = require('../controllers/assetHistoryController');
// ✅ Create a maintenance request and update asset status
const createMaintenanceRequest = async (req, res) => {
  try {
    const { assetId, task } = req.body;
    const employeeId = req.user.id;

    if (!assetId || !task) {
      return res.status(400).json({ error: "Asset and task are required" });
    }

    // Create the maintenance request
    const maintenanceRequest = new MaintenanceRequest({ employeeId, assetId, task });
    await maintenanceRequest.save();

    // Update the asset status to "Under Maintenance"
    await Asset.findByIdAndUpdate(assetId, { status: "Under Maintenance" });
    await logHistory(assetId, req.user._id, "Maintenance Requested");
    res.status(201).json({ message: "Maintenance request submitted successfully" });
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    res.status(500).json({ error: "Failed to submit maintenance request" });
  }
};

// ✅ Get all maintenance requests
const getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("employeeId", "name email") // ✅ Fetch employee name & email
      .populate("assetId", "name status asset_id") // ✅ Fetch asset name & status
      .lean(); // ✅ Convert to plain JS objects

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    res.status(500).json({ error: "Failed to fetch maintenance requests" });
  }
};

// ✅ Update Maintenance Status (Schedule or Complete)
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const adminId = req.user._id; // Get the Admin ID from request

    if (!["Scheduled", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const maintenanceRequest = await MaintenanceRequest.findById(id);
    if (!maintenanceRequest) {
      return res.status(404).json({ error: "Maintenance request not found" });
    }

    maintenanceRequest.status = status;
    await maintenanceRequest.save();

    if (status === "Scheduled") {
      // Log "Admin scheduled maintenance for an asset."
      await logHistory(maintenanceRequest.assetId, adminId, "Scheduled for Maintenance");
    } else if (status === "Completed") {
      // Update asset status to "Available"
      await Asset.findByIdAndUpdate(maintenanceRequest.assetId, { status: "Available" });

      // Log "Admin marked maintenance as completed."
      await logHistory(maintenanceRequest.assetId, adminId, "Maintenance Completed");
    }

    res.status(200).json({ message: `Maintenance request updated to ${status}` });
  } catch (error) {
    console.error("Error updating maintenance status:", error);
    res.status(500).json({ error: "Failed to update maintenance status" });
  }
};

  

module.exports = { createMaintenanceRequest, getAllMaintenanceRequests, updateMaintenanceStatus };
