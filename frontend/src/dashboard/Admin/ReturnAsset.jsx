import { useState } from "react";
import { motion } from "framer-motion";
import Table from "../../components/Table";
import SearchFilterBar from "../../components/SearchFilterBar"; // Importing your custom SearchFilterBar

const ReturnAsset = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [exportFormat, setExportFormat] = useState("csv");

  const logs = [
    { id: 1, asset: "Dell Laptop", date: "2024-02-20", condition: "Good", employee: "John Doe", note: "No issues" },
    { id: 2, asset: "Office Chair", date: "2024-02-18", condition: "Minor Damage", employee: "Jane Smith", note: "Slight tear on cushion" },
    { id: 3, asset: "Projector", date: "2024-02-22", condition: "Needs Repair", employee: "Emily Davis", note: "Bulb malfunctioning" },
  ];

  const filteredLogs = logs.filter(
    (log) => (filter === "All" || log.condition === filter) && log.asset.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "Asset", accessor: "asset" },
    { header: "Return Date", accessor: "date" },
    {
      header: "Condition",
      accessor: "condition",
      className: (value) =>
        value === "Good" ? "text-green-600 font-semibold" :
        value === "Minor Damage" ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold",
    },
    { header: "Employee", accessor: "employee" },
    { header: "Notes", accessor: "note" },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Returned Asset Log</h2>

      {/* Integrated SearchFilterBar Component */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
        data={filteredLogs}
        filename="return_asset_log"
        statusOptions={["Good", "Minor Damage", "Needs Repair"]}
      />

      <Table columns={columns} data={filteredLogs} />
    </motion.div>
  );
};

export default ReturnAsset;
