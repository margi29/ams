import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const AssetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [exportFormat, setExportFormat] = useState("csv");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token");
      console.log("Fetching asset requests...");

      try {
        const response = await fetch("http://localhost:3000/api/asset-requests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error: ${response.status} - ${errorText}`);
          setError("Failed to fetch asset requests.");
          return;
        }

        const data = await response.json();
        console.log("Fetched data:", JSON.stringify(data, null, 2));

        // Debugging: Check for missing status
        data.forEach((req, index) => {
          if (!req.status) {
            console.warn(`Warning: Missing status for request at index ${index}`, req);
          }
        });

        if (Array.isArray(data)) {
          setRequests([...data]); // Ensure state updates with a new array reference
        } else {
          console.error("API response is not an array:", data);
          setError("Invalid API response format.");
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError("Error fetching asset requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusChange = async (_id, newStatus) => {
    const confirmation = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this request?`);
    if (!confirmation) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3000/api/asset-requests/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request status");
      }

      // Update request list in UI
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === _id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  };

  const filteredRequests = requests.filter(
    (req) => req.assetId?.name && req.assetId.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Asset Id", accessor: (row) => row?.assetId?.asset_id || "N/A" },
    { header: "Asset", accessor: (row) => row?.assetId?.name || "N/A" },
    { header: "Requested By", accessor: (row) => row?.requestedBy?.name || "N/A" },
    { header: "Reason", accessor: (row) => row?.reason || "N/A" },
    {
      header: "Request Date",
      accessor: (row) => {
        const date = row?.requestedAt ? new Date(row.requestedAt) : null;
        return date && !isNaN(date) ? date.toLocaleString() : "Invalid Date";
      },
    },
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
          {row?.status || "Unknown"}
        </span>
      ),
    },    
    {
      header: "Actions",
      render: (row) =>
        row && row.status === "Pending" ? (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleStatusChange(row._id, "Approved")}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusChange(row._id, "Rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-gray-400">No Actions</span>
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
        Asset Requests
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <SearchFilterBar
            search={search}
            setSearch={setSearch}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            data={filteredRequests}
            filename="asset_requests"
            columns={columns}
          />

          {filteredRequests.length > 0 ? (
            <Table columns={columns} data={filteredRequests} />
          ) : (
            <p className="text-center text-gray-500 mt-4">No asset requests found.</p>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AssetRequests;