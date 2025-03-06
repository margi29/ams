import { useState } from "react";
import { FaClipboardList, FaSearch, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const ScheduledMaintenance = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [schedule] = useState([
    { id: 1, asset: "Server Rack", task: "Cooling system check", date: "2024-03-10", status: "Scheduled" },
    { id: 2, asset: "Printer", task: "Ink refill", date: "2024-03-15", status: "Pending" },
    { id: 3, asset: "Office AC", task: "Filter replacement", date: "2024-03-20", status: "Completed" },
  ]);

  const filteredSchedule = schedule.filter(
    (entry) =>
      (filter === "All" || entry.status === filter) &&
      entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    if (exportFormat === "csv") {
      const data = [
        ["Asset", "Task", "Date", "Status"],
        ...filteredSchedule.map(({ asset, task, date, status }) => [asset, task, date, status])
      ].map((e) => e.join(",")).join("\n");
      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "scheduled_maintenance.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.text("Scheduled Maintenance", 14, 10);
      autoTable(doc, {
        head: [["Asset", "Task", "Date", "Status"]],
        body: filteredSchedule.map(({ asset, task, date, status }) => [asset, task, date, status]),
      });
      doc.save("scheduled_maintenance.pdf");
    } else if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredSchedule);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Scheduled Maintenance");
      XLSX.writeFile(wb, "scheduled_maintenance.xlsx");
    } else if (exportFormat === "word") {
      const content = "Scheduled Maintenance\n\n" +
        filteredSchedule.map(({ asset, task, date, status }) => `${asset}\t${task}\t${date}\t${status}`).join("\n");
      const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "scheduled_maintenance.docx";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Scheduled Maintenance</h2>
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
          <option value="All">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
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
      <motion.table 
        className="w-full border-collapse border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <thead>
          <tr className="bg-[#3A6D8C] text-white">
            <th className="p-3 border">Asset</th>
            <th className="p-3 border">Task</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedule.map((entry) => (
            <motion.tr 
              key={entry.id} 
              className="text-center bg-gray-100 hover:bg-gray-200 transition"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <td className="p-3 border">{entry.asset}</td>
              <td className="p-3 border">{entry.task}</td>
              <td className="p-3 border">{entry.date}</td>
              <td className={`p-3 border font-semibold ${
                entry.status === "Pending" ? "text-yellow-600" :
                entry.status === "Scheduled" ? "text-blue-600" :
                "text-green-600"
              }`}>
                {entry.status}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default ScheduledMaintenance;
