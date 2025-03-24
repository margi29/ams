import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setAssignedAssets(mockAssignedAssets);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturnData({ ...returnData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};
    if (!returnData.assetId) newErrors.assetId = "Asset selection is required!";
    if (!returnData.reason) newErrors.reason = "Reason is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Return Request Submitted:", returnData);
    alert("Your return request has been submitted successfully.");
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setReturnData({ assetId: "", reason: "", additionalNotes: "" });
    setErrors({});
  };

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Return Asset Request
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Submit your request to return an assigned asset.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Assigned Asset */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <select
            name="assetId"
            value={returnData.assetId}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.assetId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Choose an Asset --</option>
            {assignedAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))}
          </select>
          {errors.assetId && <p className="text-red-500 mt-1">{errors.assetId}</p>}
        </div>

        {/* Reason for Return */}
        <div>
          <label className="block font-medium">
            Reason for Return <span className="text-red-500">*</span>
          </label>
          <select
            name="reason"
            value={returnData.reason}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.reason ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Choose a Reason --</option>
            <option value="No Longer Needed">No Longer Needed</option>
            <option value="Replacement Required">Replacement Required</option>
            <option value="Other">Other</option>
          </select>
          {errors.reason && <p className="text-red-500 mt-1">{errors.reason}</p>}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block font-medium">Additional Notes</label>
          <textarea
            name="additionalNotes"
            value={returnData.additionalNotes}
            onChange={handleChange}
            placeholder="Optional notes..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
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

export default ReturnRequest;
