import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaDownload } from "react-icons/fa";
import Table from "../../components/Table";
import { exportData } from "../../utils/exportData";

const ReturnAsset= () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [logs] = useState([
    { id: 1, asset: "Dell Laptop", date: "2024-02-20", condition: "Good", employee: "John Doe", note: "No issues" },
    { id: 2, asset: "Office Chair", date: "2024-02-18", condition: "Minor Damage", employee: "Jane Smith", note: "Slight tear on cushion" },
    { id: 3, asset: "Projector", date: "2024-02-22", condition: "Needs Repair", employee: "Emily Davis", note: "Bulb malfunctioning" }
  ]);

  const filteredLogs = logs.filter(
    (log) => (filter === "All" || log.condition === filter) && log.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    exportData(filteredLogs, exportFormat, "return_asset_log");
  };

  const columns = [
    { header: "Asset", accessor: "asset" },
    { header: "Return Date", accessor: "date" },
    { 
      header: "Condition", 
      accessor: "condition", 
      className: (value) =>
        value === "Good" ? "text-green-600 font-semibold" :
        value === "Minor Damage" ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold"
    },
    { header: "Employee", accessor: "employee" },
    { header: "Notes", accessor: "note" },
  ];

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Returned Asset Log</h2>
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
          <option value="All">All Conditions</option>
          <option value="Good">Good</option>
          <option value="Minor Damage">Minor Damage</option>
          <option value="Needs Repair">Needs Repair</option>
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
      <Table columns={columns} data={filteredLogs} />
    </motion.div>
  );
};

export default ReturnAsset;
