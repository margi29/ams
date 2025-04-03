import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";
import CreatableSelect from 'react-select/creatable';

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: "", 
    email: "", 
    role: "Employee", 
    departmentOption: null
  });
  
  // Convert departments array to options format for react-select
  const departmentOptions = departments.map(dept => ({ value: dept, label: dept }));

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [usersRes, deptsRes] = await Promise.all([
        axios.get("/api/users"),
        axios.get("/api/users/departments")
      ]);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handle opening modal for editing
  const handleEdit = (user) => {
    setIsEditMode(true);
    setCurrentUser({ 
      _id: user._id,
      name: user.name, 
      email: user.email, 
      role: user.role, 
      departmentOption: { value: user.department, label: user.department }
    });
    setModalOpen(true);
  };  

  // Handle opening modal for adding new user
  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser({ 
      name: "", 
      email: "", 
      role: "Employee", 
      departmentOption: null 
    });
    setModalOpen(true);
  };

  // Save user (add or update)
  const handleSaveUser = async () => {
    const department = currentUser.departmentOption?.value || "";
    
    if (!currentUser.name || !currentUser.email || !department) {
      alert("Please fill all required fields");
      return;
    }
  
    // Check if email already exists
    if (!isEditMode && users.some(user => user.email === currentUser.email)) {
      alert("This email is already in use.");
      return;
    }
  
    try {
      if (isEditMode) {
        const { _id, name, email, role } = currentUser;
        await axios.put(`/api/users/${_id}`, { name, email, role, department });
      } else {
        await axios.post("/api/users", { name: currentUser.name, email: currentUser.email, role: currentUser.role, department });
      }
  
      if (department && !departments.includes(department)) {
        setDepartments(prev => [...prev, department]);
      }
  
      fetchData();
      setModalOpen(false);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} user:`, error);
    }
  };
  
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  
  // Handle creating a new department option
  const handleCreateDepartment = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue };
    setDepartments(prev => [...prev, inputValue]);
    return newOption;
  };

  // Filtered Users
  const filteredUsers = users.filter(
    (user) =>
      (filterRole === "All" || user.role === filterRole) &&
      user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Table columns configuration
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
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
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">User Management</h2>

      {/* Search, Filter & Add User Button */}
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

      {/* Single Modal for Add/Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg mt-20 w-96"
          >
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit User" : "Add New User"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block mb-2">Department</label>
                <CreatableSelect
                  isClearable
                  placeholder="Select or create a department..."
                  value={currentUser.departmentOption}
                  options={departmentOptions}
                  onChange={(newValue) => setCurrentUser({ ...currentUser, departmentOption: newValue })}
                  onCreateOption={(inputValue) => {
                    const newOption = handleCreateDepartment(inputValue);
                    setCurrentUser({ ...currentUser, departmentOption: newOption });
                  }}
                />
              </div>
  
              <div>
                <label className="block mb-2">Role</label>
                <select
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  className="w-full p-2 border rounded-lg appearance-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  onClick={handleSaveUser}
                >
                  {isEditMode ? "Save Changes" : "Add User"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;