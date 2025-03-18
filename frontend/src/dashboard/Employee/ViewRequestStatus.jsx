import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";
import Card from "../../components/Card";

// Mock Data for Requests with Status
const mockRequestData = [
  { id: "R001", assetName: "Laptop - HP ProBook 450", status: "Pending" },
  { id: "R002", assetName: "Monitor - Dell 27-inch", status: "Approved" },
  { id: "R003", assetName: "Furniture - chair", status: "Denied" },
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
      className="p-6 min-h-screen overflow-auto bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-semibold text-center text-[var(--primary-dark)]">
        View Request Status
      </h1>
      <h2 className="text-xl text-center mt-2 text-gray-600">
        Track the status of your submitted asset requests
      </h2>

      <Card title="Your Asset Requests" className="mt-6">
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          data={filteredRequests}
          filename="asset_requests"
        />

        {filteredRequests.length > 0 ? (
          <Table columns={columns} data={filteredRequests} />
        ) : (
          <p className="text-center text-gray-500 mt-4">No asset requests found.</p>
        )}
      </Card>
    </motion.div>
  );
};

export default ViewRequestStatus;
