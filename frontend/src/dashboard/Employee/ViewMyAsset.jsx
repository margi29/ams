import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusColors = {
  Assigned: "text-[#00B4D8] font-semibold",
  Returned: "text-green-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
};

const ViewMyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusOptions = ["All", "Assigned", "Returned", "Under Maintenance"];

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
  
        const response = await fetch("http://localhost:3000/api/assets/my-assets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in the request header
          },
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error("Failed to fetch assets. Please try again.");
        }
  
        setAssets(data);
        setFilteredAssets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAssets();
  }, []);
  

  // Handle Search & Filter
  useEffect(() => {
    let result = assets;
    if (filter !== "All") result = result.filter((asset) => asset.status === filter);
    if (search.trim()) result = result.filter((asset) => asset.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredAssets(result);
  }, [search, filter, assets]);

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
        My Assets
      </h2>
      <h2 className="text-xl text-gray-800 mb-4 text-center">
        View and manage your assigned assets
      </h2>

      {/* Error & Loading Messages */}
      {loading && <p className="text-center text-blue-600">Loading assets...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Search & Filter Bar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat="csv"
        data={filteredAssets}
        filename="my_assets"
        statusOptions={statusOptions}
      />

      {/* Asset List - Two per row on medium+ screens */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
  {filteredAssets.length > 0 ? (
    filteredAssets.map((asset) => (
      <div key={asset._id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">{asset.name || "Unnamed Asset"}</h3>
        <p className="text-gray-600">{asset.category || "No Category"}</p>

        <p className="text-gray-500 text-sm mt-1">
          <strong>Asset ID:</strong> {asset.asset_id || "N/A"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <strong>Model Number:</strong> {asset.model_no || "Unknown"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <strong>Assigned Date:</strong> {asset.assigned_date || "N/A"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <strong>Warranty Expiry:</strong> {asset.warranty_expiry || "N/A"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <strong>Additional Notes:</strong> {asset.note || "N/A"}
        </p>
        <p className={`mt-2 ${statusColors[asset.status] || "text-gray-500"}`}>
          <strong>Status:</strong> {asset.status || "Unknown"}
        </p>
      </div>

    ))
  ) : (
    <p className="text-center text-gray-500 mt-4">No assets found.</p>
  )}
</div>

    </motion.div>
  );
};

export default ViewMyAsset;
