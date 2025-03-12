import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const roleColors = {
  Admin: "text-red-600 font-semibold",
  Manager: "text-[#00B4D8] font-semibold",
  Employee: "text-green-600 font-semibold",
};

// Role filter options
const roleOptions = ["Admin", "Manager", "Employee"];

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Employee" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Employee" },
  ]);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Employee" });

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setModalOpen(true);
  };

  const handleSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleAddUser = () => {
    setIsAdding(true);
    setNewUser({ name: "", email: "", role: "Employee" });
  };

  const handleSaveNewUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill all fields");
      return;
    }

    const newUserEntry = {
      id: users.length + 1,
      ...newUser,
    };

    setUsers([...users, newUserEntry]);
    setIsAdding(false);
  };

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
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white"
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
            statusOptions={roleOptions}
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
<select
  value={editingUser.email}
  onChange={(e) =>
    setEditingUser({ ...editingUser, email: e.target.value })
  }
  className="w-full p-2 border rounded-lg mb-4"
>
  {users.map((user) => (
    <option key={user.email} value={user.email}>
      {user.email}
    </option>
  ))}
</select>

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
            <input className="w-full p-2 border rounded mb-1" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <label className="block mb-1">Email</label>
<select
  value={newUser.email}
  onChange={(e) =>
    setNewUser({ ...newUser, email: e.target.value })
  }
  className="w-full p-2 border rounded-lg mb-1"
>
  {users.map((user) => (
    <option key={user.email} value={user.email}>
      {user.email}
    </option>
  ))}
</select>
<label className="block mb-1">Role</label>
            <select className="w-full p-2 border rounded mb-4" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setIsAdding(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg" onClick={handleSaveNewUser}>Add</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;
