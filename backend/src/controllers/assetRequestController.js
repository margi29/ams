const AssetRequest = require("../models/AssetRequest");
const Asset = require("../models/Asset");
const { logHistory } = require("../controllers/assetHistoryController");

// ✅ Employee requests an asset (Logs "Asset Requested")
const requestAsset = async (req, res) => {
  try {
    const { assetId, reason } = req.body;
    const requestedBy = req.user.id; // Employee ID from authentication

    const newRequest = new AssetRequest({ assetId, reason, requestedBy });
    await newRequest.save();

    // Log history: "Employee requested an asset."
    await logHistory(assetId, requestedBy, "Asset Requested");

    res.status(201).json({ message: "Asset request submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error while processing request." });
  }
};


const getAssetRequests = async (req, res) => {
    try {
      const requests = await AssetRequest.find()
        .populate("assetId", "asset_id name") // ✅ Fetch only asset_id & name
        .populate("requestedBy", "name email") // ✅ Fetch only name & email of requester
        .sort({ requestedAt: -1 }); // Sort by newest requests first
  
      res.json(requests);
    } catch (error) {
      console.error("Error fetching asset requests:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
// ✅ Admin updates request status (Logs "Assigned" when Approved)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const adminId = req.user._id; // Get Admin ID from authentication

    const assetRequest = await AssetRequest.findById(requestId);
    if (!assetRequest) {
      return res.status(404).json({ error: "Asset request not found." });
    }

    if (assetRequest.status !== "Pending") {
      return res.status(400).json({ error: "Request has already been processed." });
    }

    assetRequest.status = status;
    assetRequest.resolvedAt = new Date(); // ✅ Set resolved time
    await assetRequest.save();

    if (status === "Approved") {
      const asset = await Asset.findById(assetRequest.assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found." });
      }
      if (asset.status === "Assigned") {
        return res.status(400).json({ error: "Asset is already assigned to another user." });
      }

      asset.status = "Assigned";
      asset.assigned_to = assetRequest.requestedBy;
      asset.assigned_date = new Date();
      asset.note = null;
      await asset.save();

      // Log history: "Admin assigned asset to employee."
      await logHistory(asset._id, adminId, "Assigned");
    }

    res.json({ message: `Request ${status.toLowerCase()} successfully.` });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Server error while updating status." });
  }
};

module.exports = { requestAsset, getAssetRequests, updateRequestStatus };
