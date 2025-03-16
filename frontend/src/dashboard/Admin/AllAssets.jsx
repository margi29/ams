import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-[#00B4D8] font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 font-semibold",
};

// Define status options specific to this page
const statusOptions = ["Available", "Assigned", "Under Maintenance", "Retired"];

const AllAssets = () => {
  const [assets, setAssets] = useState([
    { id: 1, name: "Dell Laptop", category: "Electronics", status: "Assigned" },
    { id: 2, name: "HP Printer", category: "Office Equipment", status: "Available" },
    { id: 3, name: "Office Desk", category: "Furniture", status: "Under Maintenance" },
    { id: 4, name: "Projector", category: "Electronics", status: "Available" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (asset) => {
    setEditingAsset({ ...asset });
    setModalOpen(true);
  };

  const handleSave = () => {
    setAssets((prevAssets) =>
      prevAssets.map((a) => (a.id === editingAsset.id ? editingAsset : a))
    );
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filter === "All" || asset.status === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
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
      className="p-6 mt-16 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        All Assets
      </h2>

      {/* Search, Filter, and Export Bar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredAssets} // Pass the filtered data for exporting
        filename="All_Assets_Report" // 🔹 Dynamic filename
        statusOptions={statusOptions}
      />

      {/* Asset Table */}
      <Table columns={columns} data={filteredAssets} />

      {/* Edit Asset Modal */}
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
            <label className="block mb-2">Category</label>
            <input
              type="text"
              value={editingAsset.category}
              onChange={(e) =>
                setEditingAsset({ ...editingAsset, category: e.target.value })
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
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
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
                className="px-4 py-2 bg-[#00B4D8] text-white rounded-lg"
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
