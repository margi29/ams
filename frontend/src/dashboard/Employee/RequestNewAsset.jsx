import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

// Mock Data for Available Assets
const mockAvailableAssets = [
  { id: "A200", name: "Laptop - HP ProBook 450" },
  { id: "A201", name: "Monitor - Dell 27-inch" },
  { id: "A202", name: "Tablet - iPad Air" },
  { id: "A203", name: "Phone - iPhone 14 Pro" },
];

const RequestNewAsset = () => {
  const [availableAssets, setAvailableAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setAvailableAssets(mockAvailableAssets);
  }, []);

  // Handle Asset Selection
  const handleSelect = (e) => {
    setSelectedAsset(e.target.value);
  };

  // Handle Reason Input
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  // Submit Request
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAsset || !reason.trim()) {
      alert("Please select an asset and provide a reason for your request.");
      return;
    }
    console.log("Asset Request Submitted:", { selectedAsset, reason });
    alert(`Your request for ${selectedAsset} has been submitted.\nReason: ${reason}`);
    navigate("/employee"); // Redirect to the Employee Dashboard
  };

  return (
    <div className="p-6 min-h-screen overflow-auto">
      <h1 className="text-4xl font-semibold text-center text-[var(--primary-dark)]">
        Request New Asset
      </h1>
      <h2 className="text-xl text-center mt-2 text-gray-600">
        Select an available asset and provide a reason to submit your request
      </h2>

      <Card title="Asset Request Form" className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔹 Select Asset */}
          <div>
            <label className="block text-gray-700 font-semibold">Select Asset</label>
            <select
              value={selectedAsset}
              onChange={handleSelect}
              className="w-full p-3 border rounded-lg mt-1"
              required
            >
              <option value="">Select an Asset</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.name}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Reason for Request */}
          <div>
            <label className="block text-gray-700 font-semibold">Reason for Request</label>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className="w-full p-3 border rounded-lg mt-1 resize-none"
              rows="4"
              placeholder="Explain why you need this asset..."
              required
            />
          </div>

          {/* 🔹 Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#673AB7] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#5E35B1] transition"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RequestNewAsset;
