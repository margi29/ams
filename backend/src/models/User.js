const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Employee"], default: "Employee" },
    department: { type: String, required: true, set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
