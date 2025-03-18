const User = require("../models/User");

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc Add a new user
// @route POST /api/users
// @access Private/Admin
const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add user" });
  }
};

// @desc Update user details
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password; // Only update password if provided
      }
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json({ message: "User updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
