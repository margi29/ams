import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [history, setHistory] = useState([]);

  // Fetch asset history from backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/history");
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter history based on search input
  const filteredHistory = history.filter((entry) =>
    entry.actionType.toLowerCase().includes(search.toLowerCase())
  );

  // Function to generate action descriptions
  const actionSentences = (action, user, asset) => {
    const userName = user?.name || "Unknown User";
    const userRole = user?.role || "Unknown Role";
    const assetName = asset?.name || "Unknown Asset";
    const assignedTo = asset?.assigned_to?.name || "Unknown Employee";


    if (userRole === "Admin") {
      switch (action) {
        case "Created":
          return `${userName} created the asset ${assetName}.`;
        case "Updated":
          return `${userName} updated the asset ${assetName}.`;
        case "Deleted":
          return `${userName} deleted the asset ${assetName}.`;
        case "Assigned":
          return `${userName} assigned ${assetName} to ${assignedTo}.`;
        case "Scheduled for Maintenance":
          return `${userName} scheduled maintenance for ${assetName}.`;
        case "Maintenance Completed":
          return `${userName} marked maintenance as completed for ${assetName}.`;
        default:
          return `${userName} performed an action: ${action} ${assetName}.`;
      }
    } else if (userRole === "Employee") {
      switch (action) {
        case "Asset Requested":
          return `${userName} requested the asset ${assetName}.`;
        case "Returned":
          return `${userName} returned the asset ${assetName}.`;
        case "Maintenance Requested":
          return `${userName} reported an issue with ${assetName} (initiates maintenance).`;
        default:
          return `${userName} performed an action: ${action} ${assetName}.`;
      }
    }
    return `${userName} performed an action: ${action} on ${assetName}.`;
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Created":
        return "text-green-500 ";
      case "Updated":
        return "text-blue-500 ";
      case "Deleted":
        return "text-red-500";
      case "Assigned":
        return "text-purple-500 ";
      case "Scheduled for Maintenance":
      case "Maintenance Requested":
        return "text-yellow-500";
      case "Maintenance Completed":
        return "text-green-500 ";
      case "Asset Requested":
        return "text-indigo-500 ";
      case "Returned":
        return "text-gray-500 ";
      default:
        return "text-gray-700 ";
    }
  };
  
  const columns = [
    {
      header: "Date & Time",
      accessor: "timestamp",
      render: (entry) =>
        new Date(entry.timestamp).toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      header: "Action",
      accessor: "actionType",
      render: (entry) => (
        <span className="font-semibold text-gray-700">
          {actionSentences(entry.actionType, entry.userId, entry.assetId)}
        </span>
      ),
    },
    {
      header: "Action Type",
      accessor: "actionType",
      render: (entry) => (
        <span
          className={` font-semibold rounded ${getActionColor(
            entry.actionType
          )}`}
        >
          {entry.actionType}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Asset",
      accessor: "assetId",
      render: (entry) => {
        const assetName = entry.assetId?.name || "Unknown Asset";
        const assetId = entry.assetId?.asset_id || "N/A"; // Ensure the asset ID exists
        return `${assetName} (${assetId})`;
      },
      className: "text-gray-600",
    },
    {
      header: "Performed By",
      accessor: "userId",
      render: (entry) => `${entry.userId?.name} (${entry.userId?.role})`,
    },
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
        data={filteredHistory}
        filename="asset_history"
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
