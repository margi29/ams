const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Asset = require("../models/Asset");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { google } = require("googleapis");

// 🔹 OAuth2 Client Setup
const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// 🔹 Function to Send Email
const sendEmail = async (email, password) => {
  try {
    const accessToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
      tls: { rejectUnauthorized: false },
    });

    const mailOptions = {
      from: `"Asset Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account Details - Asset Management System",
      text: `Hello,\n\nWelcome to the Asset Management System!\n\nYour account has been created successfully.\n\n🔹 Email: ${email}\n🔹 Temporary Password: ${password}\n\nPlease log in and change your password as soon as possible.\n\nIf you have any questions, contact IT support.\n\nBest regards,\nAsset Management Team`,
    };    

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// @desc Get all users (Admins + Employees)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
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
    console.error("❌ Error fetching employees:", error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// @desc Add a new user (Admin/Employee) and email password
// @route POST /api/users
// @access Private/Admin
const addUser = async (req, res) => {
  const { name, email, role, department } = req.body;

  try {
    const userExists = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Generate a random password
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = new User({ name, email, password: hashedPassword, role, department });
    await user.save();

    // 🔹 Send email with login credentials
    await sendEmail(email, tempPassword);

    res.status(201).json({ message: "User added successfully. Login details sent via email." });
  } catch (error) {
    console.error("❌ Error adding user:", error);
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
    console.error("❌ Error updating user:", error);
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

    // 🔹 Unassign user's assets
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
    console.error("❌ Error deleting user:", error);
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
    console.error("❌ Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

module.exports = { getUsers, getEmployees, addUser, updateUser, deleteUser, getDepartments };
