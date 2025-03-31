const Allocation = require("../models/AssetAllocation");
const Asset = require("../models/Asset");
const User = require("../models/User");
const { logHistory } = require("./assetHistoryController");

const assignAsset = async (req, res) => {
  console.log("🔹 Assign Asset Request Received:", req.body);
  const { assetId, assignedTo, assignmentDate, category, department, location, note } = req.body;

  if (!assetId || !assignedTo || !assignmentDate) {
    return res.status(400).json({ error: "Asset ID, assignedTo, and assignmentDate are required." });
  }

  try {
    // Step 1: Validate Asset
    const assetToAssign = await Asset.findById(assetId).populate("assigned_to", "name email");
    if (!assetToAssign || assetToAssign.status !== "Available") {
      return res.status(404).json({ error: "Asset not available for assignment." });
    }

    // Step 2: Validate Assigned User
    const assignedUser = await User.findOne({ email: assignedTo });
    if (!assignedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Step 3: Assign Asset
    await Asset.findByIdAndUpdate(assetId, {
      status: "Assigned",
      assigned_to: assignedUser._id,
      assigned_date: new Date(assignmentDate),
      note: note || "",
    });

    const allocation = new Allocation({
      asset: assetId,
      assignedTo: assignedUser._id,
      assignmentDate: new Date(assignmentDate),
      category,
      department,
      location,
      note: note || "",
    });

    await allocation.save();

    // Step 4: Log History (Using Admin Info from req.user)
    const assetName = assetToAssign.name || "Unknown";
    const assetIdNumber = assetToAssign.asset_id || "N/A";
    const previouslyAssignedTo = assetToAssign.assigned_to ? assetToAssign.assigned_to.name : "None";

    await logHistory(assetId, assetName, assetIdNumber, req.user._id, req.user.name, req.user.role, "Assigned", previouslyAssignedTo);

    res.status(200).json({ message: "Asset assigned successfully!", assignedTo: assignedUser.name, role: assignedUser.role });
  } catch (error) {
    console.error("Error assigning asset:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { assignAsset };
