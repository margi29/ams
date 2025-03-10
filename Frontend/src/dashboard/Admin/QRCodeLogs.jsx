import { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { exportData } from "../../utils/exportData";
import Table from "../../components/Table";

const mockLogs = [
  { id: 1, assetId: "12345", assetName: "Dell Laptop", scannedBy: "John Doe", date: "2024-02-20" },
  { id: 2, assetId: "67890", assetName: "HP Printer", scannedBy: "Jane Smith", date: "2024-02-21" },
  { id: 3, assetId: "54321", assetName: "Office Chair", scannedBy: "Alice Brown", date: "2024-02-22" },
];

const QRCodeLogs = () => {
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  
  const columns = [
    { header: "Asset ID", accessor: "assetId" },
    { header: "Asset Name", accessor: "assetName" },
    { header: "Scanned By", accessor: "scannedBy" },
    { header: "Date", accessor: "date" },
  ];
  
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredLogs(
      mockLogs.filter(
        (log) =>
          log.assetName.toLowerCase().includes(value) ||
          log.scannedBy.toLowerCase().includes(value) ||
          log.date.includes(value)
      )
    );
  };

  const handleExport = () => {
    exportData(filteredLogs, exportFormat, "QR_Logs");
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">QR Code Logs</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={handleSearch}
          className="p-3 flex-grow border rounded-lg focus:outline-none"
        />
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

export default QRCodeLogs;