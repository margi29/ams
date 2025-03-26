const Allocation = require('../models/AssetAllocation'); // Import the Allocation model
const Asset = require('../models/Asset'); // Import the Asset model
const User = require('../models/User'); // Import the User model
const mongoose = require('mongoose'); // Import mongoose
const { logHistory } = require("./assetHistoryController");

const assignAsset = async (req, res) => {
  console.log("🔹 Assign Asset Request Received:", req.body);

  const { assetId, assignedTo, assignmentDate, category, department, location, note } = req.body;

  if (!assetId || !assignedTo || !assignmentDate) {
    console.log("❌ Missing Fields:", { assetId, assignedTo, assignmentDate });
    return res.status(400).json({ error: "Asset ID, assignedTo, and assignmentDate are required." });
  }

  try {
    // 🔹 Step 1: Lock Asset by Changing Status Immediately
    const assetToAssign = await Asset.findByIdAndUpdate(
      assetId,
      { status: "Processing" }, // Temporary status to prevent race conditions
      { new: true }
    );

    if (!assetToAssign || assetToAssign.status !== "Processing") {
      console.log("❌ Asset Not Found or Already Assigned:", assetId);
      return res.status(404).json({ error: "Asset not found or already assigned." });
    }

    // 🔹 Step 2: Validate User Exists
    const user = await User.findOne({ email: assignedTo });
    if (!user) {
      console.log("❌ User Not Found:", assignedTo);
      return res.status(404).json({ error: "User not found." });
    }

    // 🔹 Step 3: Finalize Assignment
    assetToAssign.status = "Assigned";
    assetToAssign.assigned_to = user._id;
    assetToAssign.assigned_date = new Date(assignmentDate);
    assetToAssign.note = note || "";

    await assetToAssign.save();

    const allocation = new Allocation({
      asset: assetId,
      assignedTo: user._id,
      assignmentDate: new Date(assignmentDate),
      category,
      department,
      location,
      note: note || "",
    });

    await allocation.save();

    // ✅ Step 4: Log History
    if (!req.user || !req.user.id) {
      console.log("❌ User ID missing in request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    await logHistory(assetId, req.user.id, "Assigned");

    res.status(200).json({ message: "✅ Asset assigned successfully!", asset: assetToAssign });
  } catch (error) {
    console.error("❌ Error assigning asset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { assignAsset };
