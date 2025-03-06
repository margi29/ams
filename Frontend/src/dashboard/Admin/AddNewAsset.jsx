import { useState } from "react";
import { motion } from "framer-motion";

const AddNewAsset = () => {
  const [asset, setAsset] = useState({
    name: "",
    category: "",
    status: "Available",
    description: ""
  });

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Asset Added:", asset);
    setAsset({ name: "", category: "", status: "Available", description: "" });
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Add New Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Asset Name</label>
          <input 
            type="text" 
            name="name" 
            value={asset.name} 
            onChange={handleChange} 
            placeholder="Enter asset name" 
            className="w-full p-3 border rounded-lg" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <input 
            type="text" 
            name="category" 
            value={asset.category} 
            onChange={handleChange} 
            placeholder="Enter asset category" 
            className="w-full p-3 border rounded-lg" 
            required 
          />
        </div>

        <div>
          <label className="block font-medium">Status</label>
          <select 
            name="status" 
            value={asset.status} 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg"
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea 
            name="description" 
            value={asset.description} 
            onChange={handleChange} 
            placeholder="Optional description..." 
            className="w-full p-3 border rounded-lg" 
          ></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full">
          Add Asset
        </button>
      </form>
    </motion.div>
  );
};

export default AddNewAsset;
