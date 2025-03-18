import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

// Mock Data for Requests with Status
const mockRequestData = [
  { id: "R001", assetName: "Laptop - HP ProBook 450", status: "Pending" },
  { id: "R002", assetName: "Monitor - Dell 27-inch", status: "Approved" },
  { id: "R003", assetName: "Furniture - Chair", status: "Denied" },
];

const ViewRequestStatus = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  useEffect(() => {
    setRequests(mockRequestData); // Fetching Mock Data
  }, []);

  // Filter requests based on search input
  const filteredRequests = requests.filter((req) =>
    req.assetName.toLowerCase().includes(search.toLowerCase())
  );

  // Table Columns Configuration
  const columns = [
    { header: "Request ID", accessor: "id" },
    { header: "Asset Name", accessor: "assetName" },
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
