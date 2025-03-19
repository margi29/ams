const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Fixed import
const Asset = require("../models/Asset"); // Ensure this import is present
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc Add a new user
// @route POST /api/users
// @access Private/Admin
const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role });
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
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      if (password) {
        user.password = await bcrypt.hash(password, 10); // Hash new password
      }

      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json({ message: "User updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Unassign assets linked to this user and reset assigned details
    await Asset.updateMany(
      { assigned_to: user._id },
      {
        $set: {
          assigned_to: null,
          assigned_date: null,
          note: "",
          status: "Available", // ✅ Reset asset status to Available
        },
      }
    );

    // Delete the user
    await user.deleteOne();

    res.json({ message: "User deleted, assets unassigned, and status updated successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};


module.exports = { getUsers, addUser, updateUser, deleteUser };
