import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [history, setHistory] = useState([]);

  // Fetch asset history from backend
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/history");
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();

      // Ensure assigned_to is dynamically retrieved
      const processedHistory = data.map((entry) => ({
        ...entry,
        assignedTo:
          entry.assetId?.assigned_to?.name || "Not Assigned",
      }));

      setHistory(processedHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Generate action descriptions dynamically
  const actionSentences = (action, userName, userRole, assetName, assignedTo) => {
    if (!userName || !userRole || !assetName) return "Invalid data for action.";

    switch (action) {
      case "Assigned":
        return userRole === "Admin"
          ? `${userName} assigned ${assetName} to ${assignedTo}.`
          : `${userName} was assigned ${assetName}.`;
      case "Created":
        return `${userName} created the asset ${assetName}.`;
      case "Updated":
        return `${userName} updated the asset ${assetName}.`;
      case "Deleted":
        return `${userName} deleted the asset ${assetName}.`;
      case "Scheduled for Maintenance":
        return `${userName} scheduled maintenance for ${assetName}.`;
      case "Maintenance Completed":
        return `${userName} marked maintenance as completed for ${assetName}.`;
      case "Asset Requested":
        return `${userName} requested the asset ${assetName}.`;
      case "Returned":
        return `${userName} returned the asset ${assetName}.`;
      case "Maintenance Requested":
        return `${userName} reported an issue with ${assetName}.`;
      default:
        return `${userName} performed an action: ${action} on ${assetName}.`;
    }
  };

  const getActionColor = (action) => {
    const colors = {
      Created: "text-green-500",
      Updated: "text-blue-500",
      Deleted: "text-red-500",
      Assigned: "text-purple-500",
      "Scheduled for Maintenance": "text-yellow-500",
      "Maintenance Requested": "text-yellow-500",
      "Maintenance Completed": "text-green-500",
      "Asset Requested": "text-indigo-500",
      Returned: "text-gray-500",
    };
    return colors[action] || "text-gray-700";
  };

  // Filtering logic
  const filteredHistory = history.filter((entry) => {
    const matchesSearch = entry.actionType.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || entry.actionType === filter;
    return matchesSearch && matchesFilter;
  });

  const statusOptions = [
    "All",
    "Created",
    "Updated",
    "Deleted",
    "Assigned",
    "Scheduled for Maintenance",
    "Maintenance Completed",
    "Asset Requested",
    "Returned",
    "Maintenance Requested",
  ];

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
          {actionSentences(entry.actionType, entry.userName, entry.userRole, entry.assetName, entry.assignedTo)}
        </span>
      ),
    },
    {
      header: "Action Type",
      accessor: "actionType",
      render: (entry) => (
        <span className={`font-semibold rounded ${getActionColor(entry.actionType)}`}>
          {entry.actionType}
        </span>
      ),
      className: "text-center",
    },
    {
      header: "Asset",
      accessor: "assetId",
      render: (entry) => {
        const assetName = entry.assetName || "Unknown Asset";
        const assetId = entry.assetIdNumber || "N/A";
        return `${assetName} (${assetId})`;
      },
      className: "text-gray-600",
    },
    {
      header: "Performed By",
      accessor: "userId",
      render: (entry) => {
        const userName = entry.userName || "Unknown User";
        const userRole = entry.userRole || "Unknown Role";
        return `${userName} (${userRole})`;
      },
    },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset History</h2>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredHistory}
        columns={columns}
        filename="asset_history"
        statusOptions={statusOptions}
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
