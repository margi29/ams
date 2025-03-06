import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import Table from "../../components/Table.jsx";
import { exportData } from "../../utils/exportData";

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  
  const columns = [
    { header: "Asset", accessor: "asset" },
    { 
      header: "Action", 
      accessor: "action", 
      className: (value) => 
        value === "Assigned" ? "text-blue-600 font-semibold " : 
        value === "Returned" ? "text-green-600 font-semibold" : 
        "text-red-600 font-semibold"
    },
    { header: "Date", accessor: "date" },
    { header: "User", accessor: "user" }
  ];

  const history = [
    { id: 1, asset: "Dell Laptop", action: "Assigned", date: "2024-02-15", user: "John Doe" },
    { id: 2, asset: "HP Printer", action: "Returned", date: "2024-02-18", user: "Jane Smith" },
    { id: 3, asset: "Office Desk", action: "Under Maintenance", date: "2024-02-20", user: "Mark Lee" },
    { id: 4, asset: "Projector", action: "Assigned", date: "2024-02-21", user: "Emily Davis" },
  ];

  const filteredHistory = history.filter((entry) =>
    (filter === "All" || entry.action === filter) && entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    exportData(filteredHistory, exportFormat, "asset_history");
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset History</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="All">All Actions</option>
          <option value="Assigned">Assigned</option>
          <option value="Returned">Returned</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>
      <Table columns={columns} data={filteredHistory} />
    </motion.div>
  );
};

export default AssetHistory;
