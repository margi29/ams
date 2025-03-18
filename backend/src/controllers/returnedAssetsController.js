const ReturnedAssets = require("../models/ReturnedAssets");
const Asset = require("../models/Asset");

// 🔹 Fetch all returned asset logs
exports.getAllReturnedAssets = async (req, res) => {
  try {
    const returns = await ReturnedAssets.find().populate("asset employee", "name asset_id");
    res.status(200).json(returns);
  } catch (error) {
    console.error("Error fetching returned assets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Record a returned asset
exports.returnAsset = async (req, res) => {
  try {
    const { assetId, employeeId } = req.body;

    if (!assetId || !employeeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Create a return log
    const returnLog = new ReturnedAssets({
      asset: assetId,
      employee: employeeId,
    });

    await returnLog.save();

    // ✅ Update asset status to "Available" and reset assignment fields
    await Asset.findByIdAndUpdate(assetId, {
      status: "Available",
      assigned_to: null,
      assigned_date: null,
      note: null,
    });

    res.status(201).json({ message: "Asset returned successfully", returnLog });
  } catch (error) {
    console.error("Error returning asset:", error);
    res.status(500).json({ message: "Server error" });
  }
};
