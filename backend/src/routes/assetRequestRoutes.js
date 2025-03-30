const express = require("express");
const { 
  requestAsset, 
  getAssetRequests, 
  updateRequestStatus 
} = require("../controllers/assetRequestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, requestAsset); // Submit request
router.get("/", protect, getAssetRequests); // Get all requests
router.put("/:id", protect, updateRequestStatus); // Update request status

module.exports = router;