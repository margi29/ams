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
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            // Fetch assigned assets
            const assignedResponse = await fetch("http://localhost:3000/api/assets/my-assets", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const assignedData = await assignedResponse.json();

            if (!assignedResponse.ok) {
                throw new Error("Failed to fetch assigned assets.");
            }

            console.log(" Assigned Assets:", assignedData);

            setAssets(assignedData);
            setFilteredAssets(assignedData); // Update UI
        } catch (error) {
            console.error(" Error fetching assets:", error);
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

      {loading && <p className="text-center text-blue-600">Loading assets...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        statusOptions={statusOptions}
      />
      
       {/* Asset List */}
{filteredAssets.length > 0 ? (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {filteredAssets.map((asset) => (
      <div 
        key={asset._id} 
        className="border border-gray-300 p-6 rounded-lg shadow-sm bg-gray-50 flex flex-col md:flex-row items-center md:items-start"
      >
        {/* Asset Image */}
        <div className="w-35 h-35 md:w-45 md:h-45 mt-2 flex-shrink-0">
          {asset.image ? (
            <img
              src={asset.image}
              alt={asset.name || "Asset Image"}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Asset Details */}
        <div className="flex-1 ml-6">
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
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500 mt-4">No assets found.</p>
)}
    </motion.div>
  );
};

export default ViewMyAsset;