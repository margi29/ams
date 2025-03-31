const express = require("express");
const router = express.Router();
const {
  createMaintenanceRequest,
  getAllMaintenanceRequests,
  updateMaintenanceStatus,
} = require("../controllers/maintenanceController");
const { protect } = require("../middleware/authMiddleware");
const { ensureEmployee, ensureAdmin } = require("../middleware/roleMiddleware");

// Employee can submit a maintenance request
router.post("/", protect, ensureEmployee, createMaintenanceRequest);

// Admin can view all maintenance requests
router.get("/", protect, ensureAdmin, getAllMaintenanceRequests);

// Admin can update maintenance request status
router.put("/:id/status", protect, ensureAdmin, updateMaintenanceStatus);

module.exports = router;
