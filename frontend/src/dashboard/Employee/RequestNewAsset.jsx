import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { motion } from "framer-motion";

const RequestNewAsset = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  // Fetch available assets from API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/assets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:` Bearer ${token}`, // Send token
          },
        });
        const data = await response.json();
        const availableAssets = data
          .filter((asset) => asset.status === "Available")
          .map((asset) => ({
            value: asset._id,
            label: asset.name,
          }));

        setAssets(availableAssets);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  // Handle asset selection
  const handleSelect = (selectedOption) => {
    setSelectedAsset(selectedOption);
  };

  // Handle reason input
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  // Submit request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !reason.trim()) {
      alert("Please select an asset and provide a reason.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Unauthorized. Please log in.");
      navigate("/");
      return;
    }
  
    const requestData = {
      assetId: selectedAsset.value,
      reason,
    };
  
    try {
      console.log("Submitting request:", requestData); // Debugging
  
      const response = await fetch("http://localhost:3000/api/asset-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
      const contentType = response.headers.get("content-type");
  
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.log("Backend error response:", errorData); // Debugging
          alert(`Failed to submit request: ${errorData.message || errorData.error || "Unknown error"}`);
        } else {
          console.log("Non-JSON error response:", await response.text()); // Debugging
          alert("Failed to submit request. Server returned an unexpected response.");
        }
        return;
      }
  
      alert("✅ Asset request submitted successfully!");
      navigate("/employee/view-requests");
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("An error occurred. Please try again.");
    }
  };  

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Request New Asset
      </h1>
      <p className="text-center text-gray-600 mt-2">
        Select an available asset and provide a reason to submit your request.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Select Asset using react-select */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <Select
            options={assets}
            value={selectedAsset}
            onChange={handleSelect}
            className="mt-1"
            placeholder="Choose an asset..."
            isSearchable
          />
        </div>

        {/* Reason for Request */}
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

        {/* Submit Button */}
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