const MaintenanceRequest = require("../models/MaintenanceRequest");
const Asset = require("../models/Asset");
const User = require("../models/User"); // Fetch user details for logging
const { logHistory } = require("../controllers/assetHistoryController");

// ✅ Create a maintenance request and update asset status
const createMaintenanceRequest = async (req, res) => {
  try {
    const { assetId, task } = req.body;
    const employeeId = req.user.id;

    if (!assetId || !task) {
      return res.status(400).json({ error: "❌ Asset and task are required." });
    }

    // Check if the asset exists and is not already under maintenance
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "❌ Asset not found." });
    }
    if (asset.status === "Under Maintenance") {
      return res.status(400).json({ error: "❌ Asset is already under maintenance." });
    }

    // Prevent duplicate maintenance requests
    const existingRequest = await MaintenanceRequest.findOne({ assetId, status: { $ne: "Completed" } });
    if (existingRequest) {
      return res.status(400).json({ error: "❌ A maintenance request is already pending for this asset." });
    }

    // Fetch employee details for logging
    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ error: "❌ User not found." });
    }

    // Create the maintenance request
    const maintenanceRequest = new MaintenanceRequest({ employeeId, assetId, task });
    await maintenanceRequest.save();

    // Update asset status to "Under Maintenance"
    asset.status = "Under Maintenance";
    await asset.save();

    // ✅ Log history with asset name
    await logHistory(
      assetId,
      asset.name,
      asset.asset_id || "N/A",
      employeeId,
      user.name || "Unknown",
      user.role || "Employee",
      "Maintenance Requested"
    );

    res.status(201).json({ message: "✅ Maintenance request submitted successfully." });
  } catch (error) {
    console.error("❌ Error creating maintenance request:", error);
    res.status(500).json({ error: "❌ Failed to submit maintenance request." });
  }
};

// ✅ Get all maintenance requests
const getAllMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("employeeId", "name email") // ✅ Fetch employee name & email
      .populate("assetId", "name status asset_id") // ✅ Fetch asset details
      .lean();

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching maintenance requests:", error);
    res.status(500).json({ error: "❌ Failed to fetch maintenance requests." });
  }
};

// ✅ Update Maintenance Status (Schedule or Complete)
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const adminId = req.user.id;

    if (!["Scheduled", "Completed"].includes(status)) {
      return res.status(400).json({ error: "❌ Invalid status update." });
    }

    const maintenanceRequest = await MaintenanceRequest.findById(id);
    if (!maintenanceRequest) {
      return res.status(404).json({ error: "❌ Maintenance request not found." });
    }

    maintenanceRequest.status = status;
    maintenanceRequest.updatedBy = adminId; // Store admin ID who updated it
    await maintenanceRequest.save();

    const asset = await Asset.findById(maintenanceRequest.assetId);
    if (!asset) {
      return res.status(404).json({ error: "❌ Asset not found." });
    }

    // Fetch admin details for logging
    const adminUser = await User.findById(adminId);
    if (!adminUser) {
      return res.status(404).json({ error: "❌ Admin user not found." });
    }

    if (status === "Scheduled") {
      // ✅ Log "Admin scheduled maintenance for an asset."
      await logHistory(
        asset._id,
        asset.name,
        asset.asset_id || "N/A",
        adminId,
        adminUser.name || "Unknown",
        adminUser.role || "Admin",
        "Scheduled for Maintenance"
      );
    } else if (status === "Completed") {
      // ✅ Update asset status only if it's not already available
      if (asset.status !== "Available") {
        asset.status = "Available";
        await asset.save();
      }

      // ✅ Log "Admin marked maintenance as completed."
      await logHistory(
        asset._id,
        asset.name,
        asset.asset_id || "N/A",
        adminId,
        adminUser.name || "Unknown",
        adminUser.role || "Admin",
        "Maintenance Completed"
      );
    }

    res.status(200).json({ message: `✅ Maintenance request updated to ${status}.` });
  } catch (error) {
    console.error("❌ Error updating maintenance status:", error);
    res.status(500).json({ error: "❌ Failed to update maintenance status." });
  }
};

module.exports = { createMaintenanceRequest, getAllMaintenanceRequests, updateMaintenanceStatus };
