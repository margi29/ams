import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar"; // Import the new component

const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-blue-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 font-semibold",
};

const AllAssets = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Fetch assets from backend
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets");
        const data = await response.json();
        console.log("Fetched Data:", data); // ✅ Log response data
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  // ✅ Edit asset in backend
  const handleEdit = (asset) => {
    setEditingAsset({ ...asset });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // Check if the status is changed to "Available"
      if (editingAsset.status === "Available") {
        editingAsset.assigned_to = null;
        editingAsset.assigned_date = null;
        editingAsset.note = "";
      }
  
      const response = await fetch(`http://localhost:3000/api/assets/${editingAsset._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAsset),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update asset");
      }
  
      const updatedAsset = await response.json();
  
      setAssets((prevAssets) =>
        prevAssets.map((a) => (a._id === editingAsset._id ? updatedAsset.asset : a))
      );
  
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to update asset!");
    }
  };  

  // ✅ Delete asset from backend
  const handleDelete = async (asset_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this asset?"
    );
    if (!confirmDelete) return; // ❌ User canceled deletion
  
    try {
      console.log("Sending DELETE request for Asset ID:", asset_id);
  
      const response = await fetch(`http://localhost:3000/api/assets/${asset_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
      console.log("Delete response:", result); // ✅ Debug log
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to delete asset");
      }
  
      // ✅ Remove deleted asset from state
      setAssets((prevAssets) => prevAssets.filter((asset) => asset._id !== asset_id));
  
      // ✅ Success message
      alert("Asset deleted successfully!");
    } catch (error) {
      console.error("Error deleting asset:", error.message);
      alert("Failed to delete asset!");
    }
  };

  

  const filteredAssets = assets
  .filter(
    (asset) =>
      (filter === "All" || asset.status === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    const numA = parseInt(a.asset_id.substring(1)); // Extract numeric part
    const numB = parseInt(b.asset_id.substring(1));
    return numA - numB; // Sort numerically
  });


  const columns = [
    { header: "Asset ID", accessor: "asset_id" },
    { header: "Asset Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Status",
      accessor: "status",
      className: (value) => statusColors[value] || "",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
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
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        All Assets
      </h2>

      {/* Integrating SearchFilterBar Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredAssets}
        filename="all_assets"
        statusOptions={["Available", "Assigned", "Under Maintenance", "Retired"]}
      />

      <Table columns={columns} data={filteredAssets} />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h2 className="text-xl font-semibold mb-4">Edit Asset</h2>
            <label className="block mb-2">Asset Name</label>
            <input
              type="text"
              value={editingAsset.name}
              onChange={(e) =>
                setEditingAsset({ ...editingAsset, name: e.target.value })
              }
              className="w-full p-2 border rounded-lg mb-3"
            />
            <label className="block mb-2">Status</label>
            <select
              value={editingAsset.status}
              onChange={(e) =>
                setEditingAsset({ ...editingAsset, status: e.target.value })
              }
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AllAssets;
