import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const MaintenanceRequests = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch maintenance requests from backend with authentication
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        const response = await axios.get("http://localhost:3000/api/maintenance", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(response.data);
        setError("");
      } catch (error) {
        console.error("❌ Error fetching maintenance requests:", error);
        setError(error.response?.data?.message || error.message || "Failed to fetch maintenance requests");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // ✅ Filtering logic to include task and asset details
  const filteredRequests = requests
    .filter((req) =>
      (req.assetId?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (req.employeeId?.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (req.task?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (req.status?.toLowerCase() || "").includes(search.toLowerCase())
    )
    .map((req) => ({
      assetId: req.assetId?.asset_id || "N/A",
      assetName: req.assetId?.name || "Unknown Asset",
      employeeName: req.employeeId?.name || "Unknown Employee",
      task: req.task || "N/A",
      date: new Date(req.createdAt || Date.now()).toLocaleDateString(),
      status: req.status || "Pending",
    }));

  // ✅ Column definitions
  const columns = [
    { header: "Asset ID", accessor: "assetId" },
    { header: "Asset Name", accessor: "assetName" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Task", accessor: "task" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Maintenance Requests</h2>

      {/* Integrated SearchFilterBar Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredRequests}
        filename="maintenance_requests"
        statusOptions={["Pending", "Scheduled", "Completed"]}
        columns={columns}
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading maintenance requests...</p>
      ) : error ? (
        <div className="text-center text-red-500 mt-4 p-4 bg-red-50 rounded-lg">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please make sure you are logged in with appropriate permissions.</p>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No maintenance requests found.</p>
      ) : (
        <Table columns={columns} data={filteredRequests} />
      )}
    </motion.div>
  );
};

export default MaintenanceRequests;
