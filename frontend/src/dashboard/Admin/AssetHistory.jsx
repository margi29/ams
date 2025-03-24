import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Assigned", "Returned", "Under Maintenance"];

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [history, setHistory] = useState([]);

  // Function to fetch asset history from backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/asset-history");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching asset history:", error);
    }
  };

  // Fetch history when component mounts
  useEffect(() => {
    fetchHistory();

    // Polling every 5 seconds to check for updates (Optional: use WebSockets instead)
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to update action status dynamically
  const updateActionStatus = async (assetId, newAction) => {
    try {
      const response = await fetch(`http://localhost:3000/api/asset-history/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newAction }),
      });

      if (!response.ok) throw new Error("Failed to update action");

      // Re-fetch updated history after action change
      fetchHistory();
    } catch (error) {
      console.error("Error updating action:", error);
    }
  };

  const filteredHistory = history.filter(
    (entry) =>
      (filter === "All" || entry.action === filter) &&
      entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Asset", accessor: "asset" },
    {
      header: "Action",
      accessor: "action",
      className: (value) =>
        value === "Assigned"
          ? "text-[#00B4D8] font-semibold"
          : value === "Returned"
          ? "text-green-600 font-semibold"
          : "text-red-600 font-semibold",
      render: (entry) => (
        <select
          className="p-1 border rounded"
          value={entry.action}
          onChange={(e) => updateActionStatus(entry.id, e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    { header: "Date", accessor: "date" },
    { header: "User", accessor: "user" },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Asset History
      </h2>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredHistory}
        filename="asset_history"
        statusOptions={statusOptions}
        columns={columns}
      />

      {filteredHistory.length > 0 ? (
        <Table columns={columns} data={filteredHistory} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No history records found.</p>
      )}
    </motion.div>
  );
};

export default AssetHistory;
