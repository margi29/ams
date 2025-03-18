const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Route to fetch all users
router.get("/", getUsers);

// Route to add a new user
router.post("/", addUser);

// Route to update user details
router.put("/:id", updateUser);

// Route to delete a user
router.delete("/:id", deleteUser);

module.exports = router;
