import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const roleColors = {
  Admin: "text-red-600 font-semibold",
  Employee: "text-[#00B4D8] font-semibold",
};

const roleOptions = ["Admin", "Employee"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  // 🔥 Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 Handle Edit
  const handleEdit = (user) => {
    setEditingUser({ ...user, password: "" });
    setModalOpen(true);
  };

  // 💾 Handle Save (Edit User)
  const handleSave = async () => {
    try {
      const { _id, name, email, password, role } = editingUser;
      const updatedUser = { name, email, role };
      if (password) {
        updatedUser.password = password;
      }

      await axios.put(`http://localhost:3000/api/users/${_id}`, updatedUser);
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // ❌ Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // ➕ Handle Add New User
  const handleAddUser = () => {
    setIsAdding(true);
    setNewUser({ name: "", email: "", password: "", role: "Employee" });
  };

  // ✅ Handle Save New User
  const handleSaveNewUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", newUser);
      fetchUsers();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  };

  // 🔍 Filtered Users
  const filteredUsers = users.filter(
    (user) =>
      (filterRole === "All" || user.role === filterRole) &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      className: (value) => roleColors[value] || "",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-[#00B4D8] text-white px-3 py-1 rounded"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        User Management
      </h2>

      {/* 🔹 Search, Filter & Add User Button */}
      <div className="flex flex-wrap">
        <div className="flex-1">
          <SearchFilterBar
            search={search}
            setSearch={setSearch}
            filter={filterRole}
            setFilter={setFilterRole}
            statusOptions={["All", ...roleOptions]}
          />
        </div>

        <button
          className="bg-green-500 text-white px-6 ml-2 flex items-center gap-2 rounded-lg h-[50px] hover:bg-green-700 transition"
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>

      <Table columns={columns} data={filteredUsers} />

      {/* Edit User Modal */}
{modalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-lg w-96"
    >
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <label className="block mb-2">Name</label>
      <input
        type="text"
        value={editingUser.name}
        onChange={(e) =>
          setEditingUser({ ...editingUser, name: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-3"
      />
      <label className="block mb-2">Email</label>
      <input
        type="email"
        value={editingUser.email}
        onChange={(e) =>
          setEditingUser({ ...editingUser, email: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-3"
      />
      <label className="block mb-2">Role</label>
      <select
        value={editingUser.role}
        onChange={(e) =>
          setEditingUser({ ...editingUser, role: e.target.value })
        }
        className="w-full p-2 border rounded-lg mb-4"
      >
        {roleOptions.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg"
          onClick={() => setModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  </div>
)}

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <label className="block mb-1">Name</label>
            <input
              className="w-full p-2 border rounded mb-1"
              placeholder="Enter name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <label className="block mb-1">Email</label>
            <input
              className="w-full p-2 border rounded mb-1"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded mb-1"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <label className="block mb-1">Role</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={newUser.role}
              onChange={(e) =>
                setNewUser({ ...newUser, role: e.target.value })
              }
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
                onClick={handleSaveNewUser}
              >
                Add User
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;
