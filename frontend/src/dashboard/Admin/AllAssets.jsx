import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import Table from "../../components/Table";

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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets");
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleEdit = (asset) => {
    setEditingAsset({ ...asset });
    setSelectedImage(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in editingAsset) {
        formData.append(key, editingAsset[key]);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(
        `http://localhost:3000/api/assets/${editingAsset._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

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

  const handleDelete = async (asset_id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/assets/${asset_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== asset_id)
      );
    } catch (error) {
      console.error("Error deleting asset:", error.message);
      alert("Failed to delete asset!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filter === "All" || asset.status === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  );

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
      header: "Image",
      render: (row) => (
        <img
          src={`http://localhost:3000/${row.image}`}
          alt={row.name}
          className="w-16 h-16 object-cover"
        />
      ),
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
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
      </div>

      <Table columns={columns} data={filteredAssets} />

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
            <label className="block mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg mb-4"
            />
            {editingAsset.image && !selectedImage && (
              <img
                src={`http://localhost:3000/${editingAsset.image}`}
                alt="Asset"
                className="w-20 h-20 object-cover mb-4"
              />
            )}
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Asset"
                className="w-20 h-20 object-cover mb-4"
              />
            )}
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