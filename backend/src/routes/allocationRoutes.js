const express = require("express");
const router = express.Router();
const {assignAsset} = require("../controllers/allocationController");

// Make sure the route is properly defined
router.post("/assign", assignAsset);

module.exports = router;
