import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Pending", "Scheduled", "Completed"];

const MaintenanceAndRepair = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");
  const [schedule, setSchedule] = useState([]);

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle missing dates
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch maintenance requests
  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/maintenance", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };

    fetchMaintenanceRequests();
  }, []);

  // Handle status change (Schedule → Scheduled, Complete → Completed)
  const handleStatusChange = async (id, newStatus) => {
    const confirmMessage =
      newStatus === "Completed"
        ? "Are you sure you want to mark this task as completed?"
        : "Are you sure you want to schedule this task?";

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch(`http://localhost:3000/api/maintenance/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      // ✅ Update frontend state after successful status change
      setSchedule((prev) =>
        prev.map((entry) =>
          entry._id === id
            ? {
                ...entry,
                status: newStatus,
                assetStatus: newStatus === "Completed" ? "Available" : entry.assetStatus,
              }
            : entry
        )
      );
    } catch (error) {
      console.error("Error updating maintenance status:", error);
    }
  };

  // Filtered data
  const filteredSchedule = schedule.filter(
    (entry) =>
      (filter === "All" || entry.status === filter) &&
      entry.assetId?.name?.toLowerCase().includes(search.toLowerCase()) // ✅ Fix applied
  );

  // Table columns
  const columns = [
    {
      header: "Requested By",
      accessor: (row) => row.employeeId?.name || "N/A",
    },
    {
      header: "Asset",
      accessor: (row) => row.assetId?.name || "N/A",
    },
    { header: "Task", accessor: "task" },
    {
      header: "Date",
      accessor: (row) => formatDate(row.createdAt),
    },
    {
      header: "Status",
      accessor: "status",
      className: (status) =>
        status === "Pending"
          ? "text-yellow-600 font-semibold"
          : status === "Scheduled"
          ? "text-[#00B4D8] font-semibold"
          : "text-green-600 font-semibold",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status === "Pending" && (
            <>
              <button
                onClick={() => handleStatusChange(row._id, "Scheduled")}
                className="bg-[#00B4D8] text-white px-3 py-1 rounded-lg hover:bg-[#0096C7] transition"
              >
                Schedule
              </button>
              <button
                onClick={() => handleStatusChange(row._id, "Completed")}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Complete
              </button>
            </>
          )}
          {row.status === "Scheduled" && (
            <button
              onClick={() => handleStatusChange(row._id, "Completed")}
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
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Maintenance and Repair</h2>

      {/* Search & Filter Bar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredSchedule}
        filename="maintenance_and_repair"
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
