import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Pending", "Scheduled", "Completed"];

const MaintenanceAndRepair = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [schedule, setSchedule] = useState([
    { id: 1, asset: "Server Rack", task: "Cooling system check", date: "2024-03-10", status: "Pending" },
    { id: 2, asset: "Printer", task: "Ink refill", date: "2024-03-15", status: "Pending" },
    { id: 3, asset: "Office AC", task: "Filter replacement", date: "2024-03-20", status: "Pending" }
  ]);

  // Handle status change with confirmation
  const handleStatusChange = (id, newStatus) => {
    const confirmationMessage = newStatus === "Scheduled"
      ? "Are you sure you want to schedule this task?"
      : "Are you sure you want to mark this task as completed?";

    if (window.confirm(confirmationMessage)) {
      setSchedule((prevSchedule) =>
        prevSchedule.map((entry) =>
          entry.id === id ? { ...entry, status: newStatus } : entry
        )
      );
    }
  };

  // Filtered data
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
        status === "Scheduled" ? "text-[#00B4D8] font-semibold" :
        "text-green-600 font-semibold"
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status === "Pending" && (
            <>
              <button
                onClick={() => handleStatusChange(row.id, "Scheduled")}
                className="bg-[#00B4D8] text-white px-3 py-1 rounded-lg hover:bg-[#0096C7] transition"
              >
                Schedule
              </button>
              <button
                onClick={() => handleStatusChange(row.id, "Completed")}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Complete
              </button>
            </>
          )}
          {row.status === "Scheduled" && (
            <button
              onClick={() => handleStatusChange(row.id, "Completed")}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div 
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Maintenance and Repair
      </h2>

      {/* Reusing SearchFilterBar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredSchedule} // ✅ Passed filtered data for export
        filename="maintenance_and_repair" // ✅ Ensures correct export filename
        statusOptions={statusOptions}
      />

      {/* Display Table or No Data Message */}
      {filteredSchedule.length > 0 ? (
        <Table columns={columns} data={filteredSchedule} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No maintenance tasks found.</p>
      )}
    </motion.div>
  );
};

export default MaintenanceAndRepair;
