const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

// Import Routes
const assetRoutes = require("./src/routes/assetRoutes");
const userRoutes = require("./src/routes/userRoutes"); // Future user routes

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev")); // Logs HTTP requests

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/asset-management";

mongoose
  .connect(mongoURI) // ✅ Removed deprecated options
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// ✅ Base Route
app.get("/", (req, res) => {
  res.send("Asset Management API is running...");
});

// ✅ API Routes
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes); // Add user routes

// ✅ 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
