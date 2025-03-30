import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const ReturnAsset = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch returned assets from backend with authentication
  useEffect(() => {
    const fetchReturnedAssets = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }

        // Make the request with the Authorization header
        const response = await axios.get("http://localhost:3000/api/returned-assets", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setLogs(response.data);
        setError("");
      } catch (error) {
        console.error(" Error fetching returned assets:", error);
        setError(error.response?.data?.message || error.message || "Failed to fetch returned assets");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReturnedAssets();
  }, []);

  // Enhanced filtering to include reason and additional notes
// Sort logs by return_date in descending order (most recent first)
const filteredLogs = logs
  .sort((a, b) => new Date(b.return_date) - new Date(a.return_date)) // Sorting by most recent
  .map((log) => ({
    assetName: log.asset?._id ? log.asset.name : `${log.asset_name || "Unknown Asset"} (Deleted)`,
    assetId: log.asset?._id ? log.asset.asset_id : log.asset_id || "N/A",
    employeeName: log.employee?._id ? log.employee.name : `${log.employee_name || "Unknown Employee"} (Deleted)`,
    returnDate: new Date(log.return_date || Date.now()).toLocaleDateString(),
    reason: log.reason || "N/A",
    additionalNotes: log.additionalNotes || "None",
  }))
  .filter((log) =>
    (log.assetName.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.employeeName.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.reason.toLowerCase() || "").includes(search.toLowerCase()) ||
    (log.additionalNotes.toLowerCase() || "").includes(search.toLowerCase())
  );


  // Enhanced columns to display all relevant information
  const columns = [
    { header: "Asset ID", accessor: "assetId" },
    { header: "Asset Name", accessor: "assetName" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Return Date", accessor: "returnDate" },
    { header: "Reason", accessor: "reason" },
    { header: "Additional Notes", accessor: "additionalNotes" },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Returned Asset Log</h2>

      {/* Integrated SearchFilterBar Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredLogs}
        filename="return_asset_log"
        statusOptions={[]} // Removed condition-related options
        columns={columns}
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading returned assets...</p>
      ) : error ? (
        <div className="text-center text-red-500 mt-4 p-4 bg-red-50 rounded-lg">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please make sure you are logged in with appropriate permissions.</p>
        </div>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No returned assets found.</p>
      ) : (
        <Table columns={columns} data={filteredLogs} />
      )}
    </motion.div>
  );
};

export default ReturnAsset;