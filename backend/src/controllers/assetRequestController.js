const AssetRequest = require("../models/AssetRequest");
const Asset = require("../models/Asset");
const User = require("../models/User"); // We need to fetch user details for logging
const { logHistory } = require("../controllers/assetHistoryController");

// ✅ Employee requests an asset (Logs "Asset Requested")
const requestAsset = async (req, res) => {
  try {
    const { assetId, reason } = req.body;
    const requestedBy = req.user.id; // Employee ID from authentication

    // Validate Asset
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found." });
    }

    // Fetch user details (for logging)
    const user = await User.findById(requestedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // ✅ Check if the employee has already requested this asset
    const existingRequest = await AssetRequest.findOne({
      assetId,
      requestedBy,
      status: "Pending", // Ensure it's still pending
    });

    if (existingRequest) {
      return res.status(400).json({ error: "You have already requested this asset. Please wait for approval." });
    }

    // ✅ Create a new asset request
    const newRequest = new AssetRequest({
      assetId,
      reason,
      requestedBy,
      status: "Pending", // Default status
    });

    await newRequest.save();

    // ✅ Log history: "Employee requested an asset."
    await logHistory(
      assetId,
      asset.name || "Unknown",
      asset.asset_id || "N/A",
      requestedBy,
      user.name || "Unknown",
      user.role || "Employee",
      "Asset Requested"
    );

    res.status(201).json({ message: "✅ Asset request submitted successfully!" });
  } catch (error) {
    console.error("❌ Error in requestAsset:", error.message);
    res.status(500).json({ error: "Server error while processing request." });
  }
};


// ✅ Fetch all asset requests (Admin)
const getAssetRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.find()
      .populate("assetId", "asset_id name") // ✅ Fetch only asset_id & name
      .populate("requestedBy", "name email") // ✅ Fetch only name & email of requester
      .sort({ requestedAt: -1 }); // Sort by newest requests first

    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching asset requests:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Admin updates request status (Logs "Assigned" when Approved)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const adminId = req.user.id; // Get Admin ID from authentication

    const assetRequest = await AssetRequest.findById(requestId);
    if (!assetRequest) {
      return res.status(404).json({ error: "Asset request not found." });
    }

    if (assetRequest.status !== "Pending") {
      return res.status(400).json({ error: "Request has already been processed." });
    }

    // ✅ Update Request Status
    await AssetRequest.findByIdAndUpdate(requestId, {
      status,
      resolvedAt: new Date(),
    });

    if (status === "Approved") {
      const asset = await Asset.findById(assetRequest.assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found." });
      }
      if (asset.status === "Assigned") {
        return res.status(400).json({ error: "Asset is already assigned to another user." });
      }

      // ✅ Assign Asset
      await Asset.findByIdAndUpdate(assetRequest.assetId, {
        status: "Assigned",
        assigned_to: assetRequest.requestedBy,
        assigned_date: new Date(),
        note: null,
      });

      // Fetch Admin details (who accepted the request)
      const admin = await User.findById(adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found." });
      }

      // Log history: "Admin assigned asset."
      await logHistory(
        asset._id,
        asset.name || "Unknown",
        asset.asset_id || "N/A",
        adminId,
        admin.name || "Unknown", // ✅ Store the Admin who accepted the request
        admin.role || "Admin", // ✅ Store the Admin's role
        "Assigned"
      );
    }

    res.json({ message: `✅ Request ${status.toLowerCase()} successfully.` });
  } catch (error) {
    console.error("❌ Error updating request status:", error.message);
    res.status(500).json({ error: "Server error while updating status." });
  }
};


module.exports = { requestAsset, getAssetRequests, updateRequestStatus };
