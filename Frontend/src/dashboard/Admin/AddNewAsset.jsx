import { useState } from "react";

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
    // Add API call to save asset
  };

  return (
    <div className="p-6 mt-16 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Asset Name</label>
          <input 
            type="text" 
            name="name" 
            value={asset.name} 
            onChange={handleChange} 
            className="border p-2 w-full" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input 
            type="text" 
            name="category" 
            value={asset.category} 
            onChange={handleChange} 
            className="border p-2 w-full" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select 
            name="status" 
            value={asset.status} 
            onChange={handleChange} 
            className="border p-2 w-full"
          >
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea 
            name="description" 
            value={asset.description} 
            onChange={handleChange} 
            className="border p-2 w-full" 
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AddNewAsset;
