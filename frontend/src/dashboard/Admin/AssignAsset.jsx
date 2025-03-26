import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Select from "react-select";

const AssignAsset = () => {
  const [category, setCategory] = useState("");
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [department, setDepartment] = useState(""); 
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const [date, setDate] = useState(formattedDate);
  
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [location, setLocation] = useState("");
  
  const fetchEmployees = async (selectedDepartment) => {
  if (!selectedDepartment) {
    setUsers([]);
    return;
  }

  setLoadingUsers(true);
  try {
    const res = await axios.get(`http://localhost:3000/api/users/employees?department=${selectedDepartment}`);
    setUsers(res.data);
  } catch (error) {
    console.error("Error fetching employees:", error);
    setUsers([]);
  } finally {
    setLoadingUsers(false);
  }
};

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/assets/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
  
    fetchCategories();
    fetchDepartments();
  }, []); // Removed `fetchEmployees()` here
  
  const fetchAssets = async (selectedCategory) => {
    setLoadingAssets(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/assets/available?category=${selectedCategory}`);
      setAssets(res.data); // Make sure each asset includes its _id
    } catch (error) {
      console.error("Error fetching available assets:", error);
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };  
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    alert("Please fill the fields correctly.");
    return;
  }

  const assignmentData = {
    assetId: asset, // replace `asset` with `assetId`
    assignedTo: user, // replace `user` with `assignedTo`
    assignmentDate: date, // replace `date` with `assignmentDate`
    category,
    department,
    location,
    note,
  };
  

  try {
    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) {
      console.error("❌ No token found. User not authenticated.");
      return;
    }
    const res = await axios.post("http://localhost:3000/api/allocation/assign", assignmentData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token in headers
        "Content-Type": "application/json",
      },
    });
    alert("Asset assigned successfully!");
    
    // Reset form fields after successful submission
    setCategory("");
    setAsset("");
    setUser("");
    setDepartment("");
    setDate(formattedDate);
    setLocation("");
    setNote("");
    setErrors({});
  } catch (error) {
    console.error("Error assigning asset:", error);
    alert("Failed to assign asset. Please try again.");
  }
};

  // Function to validate user inputs
  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
  
    if (!category) {
      newErrors.category = "Category is required!";
      isValid = false;
    }
  
   // In validateForm function:
   if (!asset) {
    newErrors.asset = "Please select a valid asset!";
    isValid = false;
  }
  
  if (!user) {
    newErrors.user = "Please select a valid employee!";
    isValid = false;
  }  

  
    if (!department) {
      newErrors.department = "Department is required!";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Assignment date is required!";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  
 const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "0.4rem",
      borderRadius: "0.5rem",
      border: state.isFocused ? "2px solid black" : "1px solid black", // Black border when active
      backgroundColor: "white", // Always white background
      boxShadow: "none",
      "&:hover": {
        border: state.isFocused ? "2px solid black" : "1px solid black", // Keeps border unchanged on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      overflow: "hidden",
      backgroundColor: "white", // Dropdown background stays white
      border: "1px solid black",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      "&:hover":{backgroundColor:"#f0f0f0"}, // Always white background
      color: "black", // Black text
      padding: "0.75rem",
      cursor: "pointer",
    }),
  };
  
  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
  {/* Grid Layout for Two Fields Per Row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Category */}
  <div>
    <label className="block font-medium">
      Select or Enter Category <span className="text-red-500">*</span>
    </label>
    <Select
      options={categories.map((cat) => ({
        value: cat.category,
        label: cat.category,
      }))}
      value={category ? { value: category, label: category } : null}
      onChange={(selectedOption) => {
        setCategory(selectedOption.value);
        setAsset(""); // Reset asset selection
        fetchAssets(selectedOption.value);
        setErrors((prev) => ({ ...prev, category: "" })); // Clear error
      }}
      styles={customStyles}
      placeholder="Type or select a category"
      isSearchable
    />
    {errors.category && <p className="text-red-500 mt-1">{errors.category}</p>}
  </div>

  {/* Asset */}
  <div>
    <label className="block font-medium">
      Select or Enter Asset <span className="text-red-500">*</span>
    </label>
   <Select
  options={assets.map((item) => ({
    value: item._id, // Use _id here
    label: item.name,
  }))}
 value={asset ? { value: asset, label: assets.find(a => a._id === asset)?.name || "Unknown" } : null}
  onChange={(selectedOption) => {
    setAsset(selectedOption.value); // Set _id as value
    setErrors((prev) => ({ ...prev, asset: "" })); // Clear error
  }}
  styles={customStyles}
  placeholder={assets.length === 0 ? "No assets available select category first" : "Type or select an asset"}
  isSearchable
  isDisabled={!category || assets.length === 0}
/>

    {errors.asset && <p className="text-red-500 mt-1">{errors.asset}</p>}
  </div>

  {/* Department */}
  <div>
    <label className="block font-medium">
      Select or Enter Department <span className="text-red-500">*</span>
    </label>
    <Select
      options={departments.map((dept) => ({
        value: dept,
        label: dept,
      }))}
      value={department ? { value: department, label: department } : null}
      onChange={(selectedOption) => {
        setDepartment(selectedOption.value);
        setUser(""); // Reset user selection
        fetchEmployees(selectedOption.value);
        setErrors((prev) => ({ ...prev, department: "" })); // Clear error
      }}
      styles={customStyles}
      placeholder="Type or select a department"
      isSearchable
    />
    {errors.department && <p className="text-red-500 mt-1">{errors.department}</p>}
  </div>

  {/* Employee */}
  <div>
    <label className="block font-medium">
      Assign To (Employee) <span className="text-red-500">*</span>
    </label>
    <Select
      options={users.map((user) => ({
        value: user.email,
        label: user.email,
      }))}
      value={user ? { value: user, label: user } : null}
      onChange={(selectedOption) => {
        setUser(selectedOption.value);
        setErrors((prev) => ({ ...prev, user: "" })); // Clear error
      }}
      styles={customStyles}
      placeholder={users.length === 0 ? "No employees available select department first" : "Type or select an employee"}
      isSearchable
      isDisabled={!department || users.length === 0}
    />
    {errors.user && <p className="text-red-500 mt-1">{errors.user}</p>}
  </div>

  {/* Date */}
  <div>
    <label className="block font-medium">
      Assignment Date <span className="text-red-500">*</span>
    </label>
    <input
      type="date"
      value={date}
      onChange={(e) => {
        setDate(e.target.value);
        setErrors((prev) => ({ ...prev, date: "" })); // Clear error
      }}
      className={`w-full p-3 border rounded-lg ${errors.date ? "border-red-500" : ""}`}
    />
    {errors.date && <p className="text-red-500 mt-1">{errors.date}</p>}
  </div>

  {/* Location */}
  <div>
    <label className="block font-medium">
      Enter Location <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={location}
      onChange={(e) => {
        setLocation(e.target.value);
        setErrors((prev) => ({ ...prev, location: "" })); // Clear error
      }}
      className="w-full p-3 border rounded-lg"
      placeholder="Enter asset location"
    />
    {errors.location && <p className="text-red-500 mt-1">{errors.location}</p>}
  </div>
</div>

{/* Full-Width Notes Field */}
<div>
  <label className="block font-medium">Additional Notes</label>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Optional notes..."
    className="w-full p-3 border rounded-lg"
  ></textarea>
</div>       

{/* Submit Button */}
<div className="flex justify-center">
  <button
    type="submit"
    className="w-full bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold py-3 rounded-lg transition"
    disabled={!category || !asset || !department || !user}
  >
    Assign Asset
  </button>
</div>
</form>
    </motion.div>
  );
};

export default AssignAsset;
