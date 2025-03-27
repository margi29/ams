const express = require("express");
const { getAllHistory, getHistoryByAsset } = require("../controllers/assetHistoryController");

const router = express.Router();

router.get("/", getAllHistory); // Get all history records
router.get("/:assetId", getHistoryByAsset); // Get history for a specific assets

module.exports = router;

