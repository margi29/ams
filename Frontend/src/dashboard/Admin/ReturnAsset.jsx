import { useState } from "react";
import { motion } from "framer-motion";

const ReturnAssetLog = () => {
  const [logs] = useState([
    { id: 1, asset: "Dell Laptop", date: "2024-02-20", condition: "Good", employee: "John Doe", note: "No issues" },
    { id: 2, asset: "Office Chair", date: "2024-02-18", condition: "Minor Damage", employee: "Jane Smith", note: "Slight tear on cushion" },
    { id: 3, asset: "Projector", date: "2024-02-22", condition: "Needs Repair", employee: "Emily Davis", note: "Bulb malfunctioning" }
  ]);

  return (
    <motion.div 
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Returned Asset Log</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3A6D8C] text-white">
              <th className="p-3 border">Asset</th>
              <th className="p-3 border">Return Date</th>
              <th className="p-3 border">Condition</th>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <motion.tr 
                  key={log.id} 
                  className="text-center bg-gray-100 hover:bg-gray-200 transition"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <td className="p-3 border">{log.asset}</td>
                  <td className="p-3 border">{log.date}</td>
                  <td className={`p-3 border font-semibold ${
                    log.condition === "Good" ? "text-green-600" :
                    log.condition === "Minor Damage" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>{log.condition}</td>
                  <td className="p-3 border">{log.employee}</td>
                  <td className="p-3 border">{log.note || "-"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">No returned assets recorded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReturnAssetLog;
