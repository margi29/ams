const Asset = require("../models/Asset");

const assignAsset = async (req, res) => {
    console.log("🔹 Assign Asset Request Received:", req.body);
  
    const { assetId, assignedTo, assignmentDate, note } = req.body;
  
    if (!assetId || !assignedTo || !assignmentDate) {
      console.log("❌ Missing Fields:", { assetId, assignedTo, assignmentDate });
      return res.status(400).json({ error: "Asset ID, assignedTo, and assignmentDate are required." });
    }
  
    try {
      const assetToAssign = await Asset.findById(assetId);
  
      if (!assetToAssign || assetToAssign.status !== "Available") {
        console.log("❌ Asset Not Found or Unavailable:", assetId);
        return res.status(404).json({ error: "Asset not found or unavailable." });
      }
  
      // ✅ Convert assignedTo to ObjectId if needed
      const mongoose = require("mongoose");
      const assignedToObjectId = new mongoose.Types.ObjectId(assignedTo);
  
      // ✅ Update asset status and assignment details
      assetToAssign.status = "Assigned";
      assetToAssign.assigned_to = assignedToObjectId; // ✅ Assign as ObjectId
      assetToAssign.assigned_date = new Date(assignmentDate); // ✅ Convert to Date
      assetToAssign.note = note || "";
  
      await assetToAssign.save();
  
      res.status(200).json({ message: "✅ Asset assigned successfully!", asset: assetToAssign });
    } catch (error) {
      console.error("❌ Error assigning asset:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };  
  
module.exports = { assignAsset };
