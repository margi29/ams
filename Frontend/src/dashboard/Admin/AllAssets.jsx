import { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import Table from "../../components/Table";
import { exportData } from "../../utils/exportData";

const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-blue-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 ont-semibold",
};

const AllAssets = () => {
  const [assets, setAssets] = useState([
    { id: 1, name: "Dell Laptop", category: "Electronics", status: "Assigned" },
    {
      id: 2,
      name: "HP Printer",
      category: "Office Equipment",
      status: "Available",
    },
    {
      id: 3,
      name: "Office Desk",
      category: "Furniture",
      status: "Under Maintenance",
    },
    { id: 4, name: "Projector", category: "Electronics", status: "Available" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [editingAsset, setEditingAsset] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setModalOpen(true);
  };

  const handleSave = () => {
    setAssets(assets.map((a) => (a.id === editingAsset.id ? editingAsset : a)));
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

  const handleExport = () => {
    exportData(filteredAssets, exportFormat, "all_assets");
  };

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
            className="bg-blue-500 text-white px-3 py-1 rounded"
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
          className="p-3 border rounded-lg "
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Retired">Retired</option>
        </select>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg"
          onClick={handleExport}
        >
          <FaDownload /> Export
        </button>
      </div>
      <Table columns={columns} data={filteredAssets} />
    </motion.div>
  );
};

export default AllAssets;
