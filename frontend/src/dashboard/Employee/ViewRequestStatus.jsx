import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const ViewRequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const response = await fetch("http://localhost:3000/api/asset-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        console.log("Fetched Requests:", data);
  
        const formatDate = (date) => {
          if (!date) return "N/A";
          return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }).replace(",", ""); // Removes extra comma
        };
  
        const updatedRequests = data.map((req) => ({
          assetId: req.assetId?.asset_id || req.assetId?._id || "N/A",
          assetName: req.assetId?.name || "Unknown",
          requestedBy: req.requestedBy?.name || "Unknown User",
          requestedAt: formatDate(req.requestedAt),
          resolvedAt: formatDate(req.resolvedAt),
          status: req.status || "Unknown",
        }));
  
        setRequests(updatedRequests);
      } catch (error) {
        console.error("Error fetching asset requests:", error);
      }
    };
  
    fetchRequests();
  }, []);
  
    

  // Filter requests based on search input
  const filteredRequests = requests.filter((req) =>
    req.assetName.toLowerCase().includes(search.toLowerCase())
  );

  // Table Columns Configuration
 const columns = [
  { header: "Asset ID", accessor: (row) => row?.assetId || "N/A" },
  { header: "Asset Name", accessor: (row) => row?.assetName || "N/A" },
  { header: "Requested At", accessor: (row) => row?.requestedAt || "N/A" },
  { header: "Resolved At", accessor: (row) => row?.resolvedAt || "N/A" },
  {
    header: "Status",
    accessor: (row) => row?.status || "Unknown",
    render: (row) => (
      <span
        className={`font-semibold ${
          row?.status === "Pending"
            ? "text-yellow-600"
            : row?.status === "Approved"
            ? "text-green-600"
            : row?.status === "Rejected"
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {row?.status || "Unknown"}  {/* Now text is inside the span */}
      </span>
    ),
  },
];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
        View Request Status
      </h1>
      <p className="text-center text-gray-600 mb-4">
        Track the status of your submitted asset requests.
      </p>

      {/* Search & Export Bar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredRequests}
        filename="asset_requests"
        columns={columns}
      />

      {/* Table Section */}
      <div className="mt-2">
        {filteredRequests.length > 0 ? (
          <Table columns={columns} data={filteredRequests} />
        ) : (
          <p className="text-center text-gray-500">No asset requests found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default ViewRequestStatus;