const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getAllHistory, getHistoryByAsset } = require("../controllers/assetHistoryController");

const router = express.Router();

router.get("/", protect, getAllHistory); // Get all history records (Protected)
router.get("/:assetId", protect, getHistoryByAsset); // Get history for a specific asset (Protected)

module.exports = router;
