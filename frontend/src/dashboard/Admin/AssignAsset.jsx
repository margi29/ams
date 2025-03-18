import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AssignAsset = () => {
  const [category, setCategory] = useState("");
  const [asset, setAsset] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState({});
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ✅ Fetch Categories from Asset Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
      }
    };

    const fetchEmployees = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get("http://localhost:3000/api/users");
        const employeeUsers = res.data.filter((user) => user.role === "Employee");
        setUsers(employeeUsers);
      } catch (error) {
        console.error("❌ Error fetching employees:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchCategories();
    fetchEmployees();
  }, []);

  // ✅ Handle Category Selection and Fetch Assets
  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setAsset("");
    setUser("");
    setErrors({ ...errors, category: "" });

    if (!selectedCategory) {
      setAssets([]);
      return;
    }

    setLoadingAssets(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/assets/available?category=${selectedCategory}`);
      setAssets(res.data);
    } catch (error) {
      console.error("❌ Error fetching available assets:", error);
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  // ✅ Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!category) newErrors.category = "Category is required!";
    if (!asset) newErrors.asset = "Asset is required!";
    if (!user) newErrors.user = "Employee selection is required!";
    if (!date) newErrors.date = "Assignment date is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!asset || !user) {
      alert("Invalid asset or user selection.");
      return;
    }

    try {
      const payload = {
        assetId: asset,
        assignedTo: user,
        assignmentDate: date,
        note,
      };

      await axios.post("http://localhost:3000/api/allocation/assign", payload);
      alert("✅ Asset assigned successfully!");
      resetForm();
    } catch (error) {
      console.error("❌ Error assigning asset:", error);
      alert("Failed to assign asset.");
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setCategory("");
    setAsset("");
    setUser("");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setErrors({});
  };

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Assign Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* ✅ Select Category */}
        <div>
          <label className="block font-medium">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className={`w-full p-3 border rounded-lg ${errors.category ? "border-red-500" : ""}`}
          >
            <option value="">-- Choose a Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 mt-1">{errors.category}</p>}
        </div>

        {/* ✅ Select Asset */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.asset ? "border-red-500" : ""}`}
            disabled={!category || loadingAssets || assets.length === 0}
          >
            <option value="">-- Choose an Asset --</option>
            {loadingAssets ? <option disabled>Loading assets...</option> : null}
            {assets.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.asset && <p className="text-red-500 mt-1">{errors.asset}</p>}
        </div>

        {/* ✅ Assign To */}
        <div>
          <label className="block font-medium">
            Assign To (Employee) <span className="text-red-500">*</span>
          </label>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.user ? "border-red-500" : ""}`}
            disabled={loadingUsers || users.length === 0}
          >
            <option value="">-- Choose an Employee --</option>
            {loadingUsers ? <option disabled>Loading employees...</option> : null}
            {users.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.user && <p className="text-red-500 mt-1">{errors.user}</p>}
        </div>

        {/* ✅ Assignment Date */}
        <div>
          <label className="block font-medium">
            Assignment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.date ? "border-red-500" : ""}`}
          />
          {errors.date && <p className="text-red-500 mt-1">{errors.date}</p>}
        </div>

        {/* ✅ Additional Notes */}
        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional notes..."
            className="w-full p-3 border rounded-lg"
          ></textarea>
        </div>

        {/* ✅ Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
            Assign Asset
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AssignAsset;
