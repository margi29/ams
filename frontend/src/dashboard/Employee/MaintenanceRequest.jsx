import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mock data for assigned assets
const mockAssignedAssets = [
  { id: "A123", name: "Laptop - Dell XPS 15" },
  { id: "A124", name: "Monitor - HP 24-inch" },
  { id: "A125", name: "Keyboard - Logitech MX" },
];

// Mock data for maintenance status
const initialMaintenanceData = [
  { id: "A123", name: "Laptop - Dell XPS 15", status: "Pending" },
];

const MaintenanceRequest = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState(initialMaintenanceData);
  const [selectedAsset, setSelectedAsset] = useState("");

  useEffect(() => {
    setAssignedAssets(mockAssignedAssets);
  }, []);

  // Handle asset selection
  const handleChange = (e) => {
    setSelectedAsset(e.target.value);
  };

  // Confirm and send maintenance request
  const handleSendForMaintenance = () => {
    if (!selectedAsset) {
      alert("Please select an asset before submitting.");
      return;
    }

    const confirmSend = window.confirm("Are you sure you want to send this asset for maintenance?");
    if (confirmSend) {
      const assetToSend = assignedAssets.find((asset) => asset.id === selectedAsset);
      
      // Update Maintenance Data
      setMaintenanceData((prevData) => [
        ...prevData,
        { id: assetToSend.id, name: assetToSend.name, status: "Pending" },
      ]);

      alert(`Maintenance request submitted for ${assetToSend.name}`);
      setSelectedAsset(""); // Reset selection
    }
  };

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Maintenance Request
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Submit a request to send an asset for maintenance.
      </p>

      {/* Maintenance Form */}
      <div className="mt-6 space-y-4">
        {/* Select Asset Dropdown */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedAsset}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg border-gray-300"
          >
            <option value="">-- Choose an Asset --</option>
            {assignedAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Send for Maintenance Button */}
        <button
          onClick={handleSendForMaintenance}
          className="w-full bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold py-3 rounded-lg transition"
        >
          Send for Maintenance
        </button>
      </div>
    </motion.div>
  );
};

export default MaintenanceRequest;
