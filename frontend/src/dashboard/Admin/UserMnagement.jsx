import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table.jsx";
import Card from "../../components/Card.jsx";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Manager" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Employee" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Employee" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Employee" });

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role", 
      className: (value) => 
        value === "Admin" ? "text-red-600 font-semibold" : 
        value === "Manager" ? "text-blue-600 font-semibold" : 
        "text-green-600 font-semibold"
    },
    { 
      header: "Actions", 
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition" onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition" onClick={() => handleDelete(row.id)}>
            Delete
          </button>
        </div>
      )
    }
  ];

  const filteredUsers = users.filter((user) =>
    (filterRole === "All" || user.role === filterRole) &&
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSaveEdit = () => {
    setUsers(users.map(user => user.id === currentUser.id ? currentUser : user));
    setIsEditing(false);
  };

  const handleAddUser = () => {
    setNewUser({ name: "", email: "", role: "Employee" });
    setIsAdding(true);
  };

  const handleSaveNewUser = () => {
    setUsers([...users, { id: users.length + 1, ...newUser }]);
    setIsAdding(false);
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">All Users</h2>

      {/* 🔹 Filters & Actions */}
      <Card className="p-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 flex-grow border rounded-lg focus:outline-none"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      </Card>

      {/* 🔹 Users Table */}
      <Card>
        <Table columns={columns} data={filteredUsers} />
      </Card>

      {/* Edit User Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <input className="w-full p-2 border rounded mb-2" value={currentUser.name} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
            <input className="w-full p-2 border rounded mb-2" value={currentUser.email} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
            <select className="w-full p-2 border rounded mb-4" value={currentUser.role} onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAdding && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Add New User</h3>
            <input className="w-full p-2 border rounded mb-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input className="w-full p-2 border rounded mb-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <select className="w-full p-2 border rounded mb-4" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSaveNewUser}>Add</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;