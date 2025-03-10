import { useState } from "react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import Table from "../../components/Table";
import { exportData } from "../../utils/exportData";

const AssetRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      asset: "Dell Laptop",
      requestedBy: "John Doe",
      date: "2024-02-20",
      status: "Pending",
    },
    {
      id: 2,
      asset: "Office Chair",
      requestedBy: "Jane Smith",
      date: "2024-02-18",
      status: "Pending",
    },
    {
      id: 3,
      asset: "Projector",
      requestedBy: "Emily Davis",
      date: "2024-02-22",
      status: "Pending",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  const handleStatusChange = (id, newStatus) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      (filter === "All" || req.status === filter) &&
      req.asset.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    exportData(filteredRequests, exportFormat, "asset_requests");
  };

  const columns = [
    { header: "Asset", accessor: "asset" },
    { header: "Requested By", accessor: "requestedBy" },
    { header: "Request Date", accessor: "date" },
    {
      header: "Status",
      accessor: "status",
      className: (status) =>
        status === "Pending"
          ? "text-yellow-600 font-semibold"
          : status === "Approved"
          ? "text-green-600 font-semibold"
          : "text-red-600 font-semibold",
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status !== "Approved" && (
            <button
              onClick={() => handleStatusChange(row.id, "Approved")}
              className="bg-green-500 text-white px-3 py-1 rounded-lg"
            >
              Approve
            </button>
          )}
          {row.status !== "Rejected" && (
            <button
              onClick={() => handleStatusChange(row.id, "Rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Reject
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
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Asset Requests
      </h2>
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
        </select>
        <button
          className="bg-blue-500 text-white px-4 flex items-center gap-2 rounded-lg"
          onClick={handleExport}
        >
          <FaDownload /> Export
        </button>
      </div>
      <Table columns={columns} data={filteredRequests} />
    </motion.div>
  );
};

export default AssetRequests;