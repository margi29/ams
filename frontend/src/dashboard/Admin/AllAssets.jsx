import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-blue-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 font-semibold",
};

const AllAssets = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [deletingAssetId, setDeletingAssetId] = useState(null); // Track deletion state

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/assets", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized: Check authentication.");
          return;
        }

        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []);

  const handleEdit = (asset) => {
    navigate("/admin/add-asset", { state: { asset, editMode: true } });
  };

  const handleDelete = async (asset_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this asset?");
    if (!confirmDelete) return;

    setDeletingAssetId(asset_id); // Set deleting state

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/assets/${asset_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete asset");
      }

      setAssets((prevAssets) => prevAssets.filter((asset) => asset._id !== asset_id));
      alert("Asset deleted successfully!");
    } catch (error) {
      console.error("Error deleting asset:", error.message);
      alert("Failed to delete asset!");
    } finally {
      setDeletingAssetId(null); // Reset deleting state
    }
  };

  const filteredAssets = assets
    .filter(
      (asset) =>
        (filter === "All" || asset.status === filter) &&
        asset.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const numA = parseInt(a.asset_id.substring(1));
      const numB = parseInt(b.asset_id.substring(1));
      return numA - numB;
    });

  const columns = [
    {
      header: "Image",
      render: (row) => (
        <div className="flex justify-center">
          <img
            src={row.image || "/placeholder.png"}
            alt={row.name}
            className="w-16 h-16 object-cover rounded-lg shadow"
          />
        </div>
      ),
    },
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
            className={`px-3 py-1 rounded ${
              deletingAssetId === row._id ? "bg-gray-400 cursor-not-allowed" : "bg-red-500"
            } text-white`}
            onClick={() => handleDelete(row._id)}
            disabled={deletingAssetId === row._id} // Disable button while deleting
          >
            {deletingAssetId === row._id ? "Deleting..." : "Delete"}
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
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">All Assets</h2>

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
        columns={columns}
      />

      <Table columns={columns} data={filteredAssets} />
    </motion.div>
  );
};

export default AllAssets;
