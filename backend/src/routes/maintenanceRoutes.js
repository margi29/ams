const express = require("express");
const router = express.Router();
const {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");
const {protect} = require("../middleware/authMiddleware");

router.post("/", protect, createMaintenanceRequest);
router.get("/", protect, getAllMaintenanceRequests);
router.put("/:id/status", protect , updateMaintenanceStatus);

module.exports = router;
