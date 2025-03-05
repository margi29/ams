
import { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const mockLogs = [
  { id: 1, assetId: "12345", assetName: "Dell Laptop", scannedBy: "John Doe", date: "2024-02-20" },
  { id: 2, assetId: "67890", assetName: "HP Printer", scannedBy: "Jane Smith", date: "2024-02-21" },
  { id: 3, assetId: "54321", assetName: "Office Chair", scannedBy: "Alice Brown", date: "2024-02-22" },
];

const QRCodeLogs = () => {
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [filteredLogs, setFilteredLogs] = useState(mockLogs);
  
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
    if (exportFormat === "csv") {
      let data = "Asset ID,Asset Name,Scanned By,Date\n";
      filteredLogs.forEach(log => {
        data += `${log.assetId},${log.assetName},${log.scannedBy},${log.date}\n`;
      });
      const blob = new Blob([data], { type: "text/csv" });
      downloadFile(blob, "QR_Logs.csv");
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("QR Code Logs", 14, 10);
      autoTable(doc, {
        head: [["Asset ID", "Asset Name", "Scanned By", "Date"]],
        body: filteredLogs.map(({ assetId, assetName, scannedBy, date }) => [assetId, assetName, scannedBy, date]),
      });
      doc.save("QR_Logs.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredLogs);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "QR Code Logs");
      XLSX.writeFile(wb, "QR_Logs.xlsx");
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      className="p-6 bg-white shadow-lg rounded-xl max-w-4xl mx-auto text-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800">QR Code Logs</h2>
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
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Asset ID</th>
            <th className="p-2 border">Asset Name</th>
            <th className="p-2 border">Scanned By</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id}>
              <td className="p-2 border">{log.assetId}</td>
              <td className="p-2 border">{log.assetName}</td>
              <td className="p-2 border">{log.scannedBy}</td>
              <td className="p-2 border">{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default QRCodeLogs;
