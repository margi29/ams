import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const AssetRequests = () => {
  const [requests] = useState([
    { id: 1, asset: "Dell Laptop", requestedBy: "John Doe", date: "2024-02-20", status: "Pending" },
    { id: 2, asset: "Office Chair", requestedBy: "Jane Smith", date: "2024-02-18", status: "Pending" },
    { id: 3, asset: "Projector", requestedBy: "Emily Davis", date: "2024-02-22", status: "Approved" }
  ]);
  
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  const filteredRequests = requests.filter(req => 
    (filter === "All" || req.status === filter) &&
    req.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (exportFormat === "csv") {
      const data = [
        ["Asset", "Requested By", "Request Date", "Status"],
        ...filteredRequests.map(({ asset, requestedBy, date, status }) => [asset, requestedBy, date, status])
      ].map(e => e.join(",")).join("\n");
      const blob = new Blob([data], { type: "text/csv" });
      downloadFile(blob, "asset_requests.csv");
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Asset Requests", 14, 10);
      autoTable(doc, {
        head: [["Asset", "Requested By", "Request Date", "Status"]],
        body: filteredRequests.map(({ asset, requestedBy, date, status }) => [asset, requestedBy, date, status])
      });
      doc.save("asset_requests.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredRequests);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asset Requests");
      XLSX.writeFile(wb, "asset_requests.xlsx");
    } else if (exportFormat === "word") {
      const content = "Asset Requests\n\n" +
        filteredRequests.map(({ asset, requestedBy, date, status }) => `${asset}\t${requestedBy}\t${date}\t${status}`).join("\n");
      const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      downloadFile(blob, "asset_requests.docx");
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
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Asset Requests</h2>
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
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
          <option value="word">Word</option>
        </select>
        <button className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg" onClick={handleExport}>
          <FaDownload /> Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Requested By</th>
              <th className="p-3 border">Request Date</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <motion.tr 
                  key={req.id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <td className="p-3 border">{req.asset}</td>
                  <td className="p-3 border">{req.requestedBy}</td>
                  <td className="p-3 border">{req.date}</td>
                  <td className={`p-3 border font-semibold ${
                    req.status === "Approved" ? "text-green-600" :
                    req.status === "Rejected" ? "text-red-600" :
                    "text-yellow-600"
                  }`}>{req.status}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">No asset requests available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AssetRequests;
