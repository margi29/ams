import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Pending", "Scheduled", "Completed"];

const MaintenanceRequests = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/maintenance", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this task as ${newStatus}?`)) return;
    
    try {
      const response = await fetch(`/api/maintenance/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      setRequests((prev) =>
        prev.map((entry) =>
          entry._id === id ? { ...entry, status: newStatus } : entry
        )
      );
    } catch (error) {
      console.error("Error updating maintenance status:", error);
    }
  };

  const filteredRequests = requests
  .filter(
    (entry) =>
      (filter === "All" || entry.status === filter) &&
      entry.assetId?.name?.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by newest first

  const columns = [
     { header: "Asset Id", accessor: (row) => row.assetId?.asset_id },
    { header: "Asset", accessor: (row) => row.assetId?.name || "N/A" },
    { header: "Requested By", accessor: (row) => row.employeeId?.name || "N/A" },
    { header: "Task", accessor: "task" },
    { header: "Date", accessor: (row) => new Date(row.createdAt).toLocaleString() },
    {
      header: "Status",
      accessor: "status",
      className: (status) =>
        status === "Pending"
          ? "text-yellow-600 font-semibold"
          : status === "Scheduled"
          ? "text-blue-500 font-semibold"
          : "text-green-600 font-semibold",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status === "Pending" && (
            <>
              <button
                onClick={() => handleStatusChange(row._id, "Scheduled")}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                Schedule
              </button>
              <button
                onClick={() => handleStatusChange(row._id, "Completed")}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Complete
              </button>
            </>
          )}
          {row.status === "Scheduled" && (
            <button
              onClick={() => handleStatusChange(row._id, "Completed")}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Maintenance Requests</h2>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredRequests}
        filename="maintenance_requests"
        statusOptions={statusOptions}
      />

      {filteredRequests.length > 0 ? (
        <Table columns={columns} data={filteredRequests} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No maintenance tasks found.</p>
      )}
    </motion.div>
  );
};

export default MaintenanceRequests;
