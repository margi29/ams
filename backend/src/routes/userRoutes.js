const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  getEmployees,
  updateUser,
  deleteUser,
  getDepartments
} = require("../controllers/userController");

// Route to fetch all users
router.get("/", getUsers);

// Route to add a new user
router.post("/", addUser);

// Route to update user details
router.put("/:id", updateUser);

// Route to delete a user
router.delete("/:id", deleteUser);

//Route to fetch all departments
router.get("/departments", getDepartments);

//Route to fetch all employees
router.get("/employees", getEmployees);

module.exports = router;
