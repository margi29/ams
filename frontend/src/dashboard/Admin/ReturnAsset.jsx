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

  // ✅ Fetch returned assets from backend
  useEffect(() => {
    const fetchReturnedAssets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/returnedassets");
        setLogs(response.data);
      } catch (error) {
        console.error("❌ Error fetching returned assets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReturnedAssets();
  }, []);

  // ✅ Ensure asset and employee names exist before filtering
  const filteredLogs = logs
    .filter((log) =>
      log.asset?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.employee?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .map((log) => ({
      assetName: log.asset?.name || "Unknown Asset",
      employeeName: log.employee?.name || "Unknown Employee",
      returnDate: log.return_date || "N/A",
    }));

  const columns = [
    { header: "Asset Name", accessor: "assetName" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Return Date", accessor: "returnDate" },
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
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading returned assets...</p>
      ) : (
        <Table columns={columns} data={filteredLogs} />
      )}
    </motion.div>
  );
};

export default ReturnAsset;
