import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Pending", "Approved", "Rejected"];

const AssetRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, asset: "Dell Laptop", requestedBy: "John Doe", date: "2024-02-20", status: "Pending" },
    { id: 2, asset: "Office Chair", requestedBy: "Jane Smith", date: "2024-02-18", status: "Pending" },
    { id: 3, asset: "Projector", requestedBy: "Emily Davis", date: "2024-02-22", status: "Pending" }
  ]);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");

  const handleStatusChange = (id, newStatus) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      (filter === "All" || req.status === filter) &&
      req.asset.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Asset", accessor: "asset" },
    { header: "Requested By", accessor: "requestedBy" },
    { header: "Request Date", accessor: "date" },
    {
      header: "Status",
      accessor: "status",
      className: (status) =>
        status === "Pending" ? "text-yellow-600 font-semibold" :
        status === "Approved" ? "text-green-600 font-semibold" :
        "text-red-600 font-semibold"
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {row.status === "Pending" && (
            <>
              <button
                onClick={() => handleStatusChange(row.id, "Approved")}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusChange(row.id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div 
      className="p-6 mt-16 bg-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Asset Requests
      </h2>

      {/* Reusing SearchFilterBar */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredRequests} // ✅ Passing filtered data for export
        filename="asset_requests" // ✅ Added filename for export
        statusOptions={statusOptions}
      />

      {/* Display Table or No Data Message */}
      {filteredRequests.length > 0 ? (
        <Table columns={columns} data={filteredRequests} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No asset requests found.</p>
      )}
    </motion.div>
  );
};

export default AssetRequests;
