const Asset = require('../models/Asset');

const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find(); // Fetch all assets from MongoDB
        res.status(200).json(assets);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { getAllAssets };
