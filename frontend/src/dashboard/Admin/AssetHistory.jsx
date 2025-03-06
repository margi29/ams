import { useState } from "react";
import { FaSearch, FaDownload, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [history] = useState([
    { id: 1, asset: "Dell Laptop", action: "Assigned", date: "2024-02-15", user: "John Doe" },
    { id: 2, asset: "HP Printer", action: "Returned", date: "2024-02-18", user: "Jane Smith" },
    { id: 3, asset: "Office Desk", action: "Under Maintenance", date: "2024-02-20", user: "Mark Lee" },
    { id: 4, asset: "Projector", action: "Assigned", date: "2024-02-21", user: "Emily Davis" },
  ]);

  const filteredHistory = history.filter((entry) =>
    (filter === "All" || entry.action === filter) && entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (exportFormat === "csv") {
      const data = [
        ["Asset", "Action", "Date", "User"],
        ...filteredHistory.map(({ asset, action, date, user }) => [asset, action, date, user])
      ].map((e) => e.join(",")).join("\n");
      const blob = new Blob([data], { type: "text/csv" });
      downloadFile(blob, "asset_history.csv");
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset History", 14, 10);
      autoTable(doc, {
        head: [["Asset", "Action", "Date", "User"]],
        body: filteredHistory.map(({ asset, action, date, user }) => [asset, action, date, user]),
      });
      doc.save("asset_history.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredHistory);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset History");
      XLSX.writeFile(wb, "asset_history.xlsx");
    } else if (exportFormat === "docx") {
      const content = `Asset History\n\n` + filteredHistory.map(({ asset, action, date, user }) => `${asset}\t${action}\t${date}\t${user}`).join("\n");
      const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      downloadFile(blob, "asset_history.docx");
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
          <option value="docx">Word</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>
      <motion.table 
        className="w-full border-collapse border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset</th>
            <th className="p-3 border">Action</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">User</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((entry) => (
              <motion.tr 
                key={entry.id} 
                className="text-center bg-gray-100 hover:bg-gray-200 transition"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <td className="p-3 border">{entry.asset}</td>
                <td className={`p-3 border font-semibold ${
                  entry.action === "Assigned" ? "text-blue-600" :
                  entry.action === "Returned" ? "text-green-600" :
                  "text-red-600"
                }`}>{entry.action}</td>
                <td className="p-3 border">{entry.date}</td>
                <td className="p-3 border">{entry.user}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">No history found</td>
            </tr>
          )}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default AssetHistory;
