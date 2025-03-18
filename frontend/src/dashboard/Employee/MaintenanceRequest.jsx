import React, { useState, useEffect } from "react";
import Card from "../../components/Card";

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
    <div className="p-6 min-h-screen overflow-auto">
      {/* Header Section */}
      <h1 className="text-4xl font-semibold text-center text-[var(--primary-dark)]">
        Maintenance Request
      </h1>
      <h2 className="text-xl text-center mt-2 text-gray-600">
        Submit a request to send an asset for maintenance
      </h2>

      {/* Maintenance Form */}
      <Card title="Send for Maintenance" className="mt-6">
        <div>
          {/* Select Asset Dropdown */}
          <label className="block text-gray-700 font-semibold mb-2">Select Asset</label>
          <select
            value={selectedAsset}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select an Asset</option>
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
          className="mt-6 w-full bg-[#673AB7] text-white font-bold py-3 rounded-lg hover:bg-[#5E35B1] transition"
        >
          Send for Maintenance
        </button>
      </Card>

      
    </div>
  );
};

export default MaintenanceRequest;
