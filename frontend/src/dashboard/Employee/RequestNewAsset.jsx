import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
    navigate("/employee"); // Redirect to Employee Dashboard
  };

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Request New Asset
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Select an available asset and provide a reason to submit your request.
      </p>

      {/* Asset Request Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 🔹 Select Asset */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedAsset}
            onChange={handleSelect}
            className="w-full p-3 border rounded-lg border-gray-300 mt-1"
            required
          >
            <option value="">-- Choose an Asset --</option>
            {availableAssets.map((asset) => (
              <option key={asset.id} value={asset.name}>
                {asset.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Reason for Request */}
        <div>
          <label className="block font-medium">
            Reason for Request <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={handleReasonChange}
            className="w-full p-3 border rounded-lg border-gray-300 mt-1 resize-none"
            rows="4"
            placeholder="Explain why you need this asset..."
            required
          />
        </div>

        {/* 🔹 Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold py-3 rounded-lg transition"
          >
            Submit Request
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RequestNewAsset;
