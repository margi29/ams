import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import { exportData } from "../../utils/exportData";

const MaintenanceAndRepair = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [schedule, setSchedule] = useState([
    { id: 1, asset: "Server Rack", task: "Cooling system check", date: "2024-03-10", status: "Pending" },
    { id: 2, asset: "Printer", task: "Ink refill", date: "2024-03-15", status: "Pending" },
    { id: 3, asset: "Office AC", task: "Filter replacement", date: "2024-03-20", status: "Pending" },
  ]);

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((entry) =>
        entry.id === id ? { ...entry, status: newStatus } : entry
      )
    );
  };

  // Filter data based on search and status filter
  const filteredSchedule = schedule.filter(
    (entry) =>
      (filter === "All" || entry.status === filter) &&
      entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  // Table columns
  const columns = [
    { header: "Asset", accessor: "asset" },
    { header: "Task", accessor: "task" },
    { header: "Date", accessor: "date" },
    { 
      header: "Status", 
      accessor: "status", 
      className: (status) =>
        status === "Pending" ? "text-yellow-600 font-semibold" :
        status === "Scheduled" ? "text-blue-600 font-semibold" :
        "text-green-600 font-semibold"
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status !== "Scheduled" && (
            <button
              onClick={() => handleStatusChange(row.id, "Scheduled")}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              Scheduled
            </button>
          )}
          {row.status !== "Completed" && (
            <button
              onClick={() => handleStatusChange(row.id, "Completed")}
              className="bg-green-600 text-white px-3 py-1 rounded-lg"
            >
              Completed
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Maintenance and Repair</h2>
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
        </select>
        <button
          className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg"
          onClick={() => exportData(filteredSchedule, exportFormat, "maintenance_and_repair")}
        >
          <FaDownload /> Export
        </button>
      </div>
      <Table columns={columns} data={filteredSchedule} />
    </motion.div>
  );
};

export default MaintenanceAndRepair;
