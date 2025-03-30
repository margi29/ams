const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const assetRoutes = require("./src/routes/assetRoutes");
const userRoutes = require("./src/routes/userRoutes");
const allocationRoutes = require("./src/routes/allocationRoutes");
const returnedAssetsRoutes = require("./src/routes/returnedAssetsRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
const assetRequestRoutes = require("./src/routes/assetRequestRoutes");
const assetHistoryRoutes = require("./src/routes/assetHistoryRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies/auth headers
  })
);
app.use(bodyParser.json());
app.use(morgan("dev")); // Logs HTTP requests

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/asset-management";

mongoose
  .connect(mongoURI) // Removed deprecated options
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Base Route
app.get("/", (req, res) => {
  res.send("Asset Management API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes); // Add user routes
app.use("/api/allocation", allocationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/returned-assets", returnedAssetsRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/asset-requests", assetRequestRoutes);
app.use("/api/history", assetHistoryRoutes);

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));