import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar";

const statusOptions = ["Assigned", "Returned", "Under Maintenance"];

const AssetHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");

  const history = [
    { id: 1, asset: "Dell Laptop", action: "Assigned", date: "2024-02-15", user: "John Doe" },
    { id: 2, asset: "HP Printer", action: "Returned", date: "2024-02-18", user: "Jane Smith" },
    { id: 3, asset: "Office Desk", action: "Under Maintenance", date: "2024-02-20", user: "Mark Lee" },
    { id: 4, asset: "Projector", action: "Assigned", date: "2024-02-21", user: "Emily Davis" },
  ];

  const filteredHistory = history.filter(
    (entry) =>
      (filter === "All" || entry.action === filter) &&
      entry.asset.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Asset", accessor: "asset" },
    { 
      header: "Action", 
      accessor: "action", 
      className: (value) => 
        value === "Assigned" ? "text-[#00B4D8] font-semibold" : 
        value === "Returned" ? "text-green-600 font-semibold" : 
        "text-red-600 font-semibold"
    },
    { header: "Date", accessor: "date" },
    { header: "User", accessor: "user" }
  ];

  return (
    <motion.div 
      className="p-6 mt-16 bg-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Asset History
      </h2>

      {/* Search & Filter Bar (Now passing `data` and `filename`) */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredHistory} // ✅ Fixed: Passing filtered data for export
        filename="asset_history" // ✅ Fixed: Added mandatory filename prop
        statusOptions={statusOptions}
      />

      {/* Display Table or No Data Message */}
      {filteredHistory.length > 0 ? (
        <Table columns={columns} data={filteredHistory} />
      ) : (
        <p className="text-center text-gray-500 mt-4">No history records found.</p>
      )}
    </motion.div>
  );
};

export default AssetHistory;
