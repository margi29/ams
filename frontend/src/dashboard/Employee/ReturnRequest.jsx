import React, { useState, useEffect } from "react";
import Card from "../../components/Card";

// Mock data for assigned assets
const mockAssignedAssets = [
  { id: "A123", name: "Laptop - Dell XPS 15" },
  { id: "A124", name: "Monitor - HP 24-inch" },
  { id: "A125", name: "Keyboard - Logitech MX" },
];

const ReturnRequest = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [returnData, setReturnData] = useState({
    assetId: "",
    reason: "",
    additionalNotes: "",
  });

  useEffect(() => {
    setAssignedAssets(mockAssignedAssets);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturnData({ ...returnData, [name]: value });
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Return Request Submitted:", returnData);
    alert("Your return request has been submitted successfully.");
    resetForm();
  };

  // Send data without submitting
  const handleSend = () => {
    if (!returnData.assetId || !returnData.reason) {
      alert("Please fill in all required fields before sending.");
      return;
    }
    console.log("Return Request Sent:", returnData);
    alert("Your return request has been sent for review.");
  };

  // Reset form
  const resetForm = () => {
    setReturnData({ assetId: "", reason: "", additionalNotes: "" });
  };

  return (
    <div className="p-6 min-h-screen overflow-auto">
    <h1 className="text-4xl font-semibold text-center text-[var(--primary-dark)]">
        Return Asset Request
      </h1>
      <h2 className="text-xl text-center mt-2 text-gray-600">
        Submit your request to return an assigned asset
      </h2>

      <Card title="Return Asset Form" className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔹 Select Assigned Asset */}
          <div>
            <label className="block text-gray-700 font-semibold">Select Asset</label>
            <select
              name="assetId"
              value={returnData.assetId}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            >
              <option value="">Select an Asset</option>
              {assignedAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>

          {/* 🔹 Reason for Return */}
          <div>
            <label className="block text-gray-700 font-semibold">Reason for Return</label>
            <select
              name="reason"
              value={returnData.reason}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mt-1"
              required
            >
              <option value="">Select a Reason</option>
              <option value="No Longer Needed">No Longer Needed</option>
              <option value="Replacement Required">Replacement Required</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 🔹 Additional Notes */}
          <div>
            <label className="block text-gray-700 font-semibold">Additional Notes (Optional)</label>
            <textarea
              name="additionalNotes"
              value={returnData.additionalNotes}
              onChange={handleChange}
              placeholder="Provide any additional information"
              className="w-full p-3 border rounded-lg mt-1"
              rows="4"
            ></textarea>
          </div>

         {/* 🔹 Submit Button Only (Centered and Purple) */}
            <div className="flex justify-center">
            <button
                type="submit"
                className="bg-[#673AB7] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#5E35B1] transition"
            >
                Submit Request
            </button>
            </div>

        </form>
      </Card>
    </div>
  );
};

export default ReturnRequest;
