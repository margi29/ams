const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Asset = require("../models/Asset");

// @desc Get all users (Admins + Employees)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc Get only employees (Optional: Filter by department)
// @route GET /api/employees
// @access Private/Admin
const getEmployees = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { role: "Employee" };

    if (department) {
      filter.department = department;
    }

    const employees = await User.find(filter).select("-password");
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// @desc Add a new user
// @route POST /api/users
// @access Private/Admin
const addUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    const userExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, department });
    await user.save();

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Failed to add user" });
  }
};

// @desc Update user details
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.department = department || user.department;
    user.role = role || user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Asset.updateMany(
      { assigned_to: user._id },
      {
        $set: {
          assigned_to: null,
          assigned_date: null,
          note: "",
          status: "Available",
        },
      }
    );

    await user.deleteOne();

    res.json({ message: "User deleted, assets unassigned, and status updated successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// @desc Get all unique departments
// @route GET /api/departments
// @access Private/Admin
const getDepartments = async (req, res) => {
  try {
    const uniqueDepartments = await User.distinct("department");
    res.json(uniqueDepartments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

module.exports = { getUsers, getEmployees, addUser, updateUser, deleteUser, getDepartments };
