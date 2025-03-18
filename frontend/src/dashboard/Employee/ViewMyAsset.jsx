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

  const statusOptions = ["All", "Assigned", "Returned", "Under Maintenance"];

  // Mock Data (Replace with API call later)
  useEffect(() => {
    const mockAssets = [
      { id: 1, name: "Dell Laptop", type: "Laptop", status: "Assigned", assignedDate: "2025-02-10" },
      { id: 2, name: "HP Printer", type: "Printer", status: "Returned", assignedDate: "2025-01-20" },
      { id: 3, name: "Cisco Router", type: "Router", status: "Under Maintenance", assignedDate: "2025-03-05" },
      { id: 4, name: "MacBook Pro", type: "Laptop", status: "Assigned", assignedDate: "2025-03-12" },
      { id: 1, name: "Dell Laptop", type: "Laptop", status: "Assigned", assignedDate: "2025-02-10" },
      { id: 2, name: "HP Printer", type: "Printer", status: "Returned", assignedDate: "2025-01-20" },
      { id: 3, name: "Cisco Router", type: "Router", status: "Under Maintenance", assignedDate: "2025-03-05" },
      { id: 4, name: "MacBook Pro", type: "Laptop", status: "Assigned", assignedDate: "2025-03-12" }
    ];
    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
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
            <div key={asset.id} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">{asset.name}</h3>
              <p className="text-gray-600">{asset.type}</p>
              <p className={`mt-2 ${statusColors[asset.status]}`}>{asset.status}</p>
              <p className="text-gray-500 text-sm mt-2">Assigned: {asset.assignedDate}</p>
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
