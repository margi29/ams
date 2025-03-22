const Allocation = require('../models/AssetAllocation'); // Import the Allocation model
const Asset = require('../models/Asset'); // Import the Asset model
const User = require('../models/User'); // Import the User model
const mongoose = require('mongoose'); // Import mongoose

const assignAsset = async (req, res) => {
  console.log("🔹 Assign Asset Request Received:", req.body);

  const { assetId, assignedTo, assignmentDate, category, department, location, note } = req.body;

  // Validate required fields
  if (!assetId || !assignedTo || !assignmentDate) {
    console.log("❌ Missing Fields:", { assetId, assignedTo, assignmentDate });
    return res.status(400).json({ error: "Asset ID, assignedTo, and assignmentDate are required." });
  }

  try {
    // Find the asset by ID
    const assetToAssign = await Asset.findById(assetId);
    if (!assetToAssign || assetToAssign.status !== "Available") {
      console.log("❌ Asset Not Found or Unavailable:", assetId);
      return res.status(404).json({ error: "Asset not found or unavailable." });
    }

    // Find the user by email
    const user = await User.findOne({ email: assignedTo });
    if (!user) {
      console.log("❌ User Not Found:", assignedTo);
      return res.status(404).json({ error: "User not found." });
    }

    // Update the asset's status and assignment details
    assetToAssign.status = "Assigned";
    assetToAssign.assigned_to = user._id; // Use the ObjectId of the user
    assetToAssign.assigned_date = new Date(assignmentDate); // Make sure the assignment date is valid
    assetToAssign.note = note || ""; // Optional note field

    await assetToAssign.save(); // Save the updated asset

    // Create a new allocation record
    const allocation = new Allocation({
      asset: assetId,
      assignedTo: user._id, // Use the ObjectId of the user
      assignmentDate: new Date(assignmentDate), // Ensure date format is correct
      category,
      department,
      location,
      note: note || "",
    });

    await allocation.save(); // Save the allocation record

    // Respond with a success message
    res.status(200).json({ message: "✅ Asset assigned successfully!", asset: assetToAssign });
  } catch (error) {
    console.error("❌ Error assigning asset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { assignAsset };
