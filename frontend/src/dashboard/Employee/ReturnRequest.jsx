import { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import { motion } from "framer-motion";

const ReturnRequest = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null); // Track selected asset
  const [returnData, setReturnData] = useState({
    assetId: "",
    reason: "",
    additionalNotes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch assigned assets
  useEffect(() => {
    const fetchAssignedAssets = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");

        const response = await fetch("/api/assets/my-assets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch assets. Please try again.");

        const data = await response.json();
        const assigned = data.filter((asset) => asset.status === "Assigned");
        setAssignedAssets(assigned);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedAssets();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturnData({ ...returnData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Handle asset selection change (react-select)
  const handleAssetChange = (selectedOption) => {
    setSelectedAsset(selectedOption);
    setReturnData({ ...returnData, assetId: selectedOption ? selectedOption.value : "" });
    setErrors({ ...errors, assetId: "" });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!returnData.assetId) newErrors.assetId = "Asset selection is required!";
    if (!returnData.reason) newErrors.reason = "Reason is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const response = await fetch("/api/returned-assets/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(returnData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to submit request.");

      alert("Your return request has been submitted successfully.");
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setReturnData({ assetId: "", reason: "", additionalNotes: "" });
    setSelectedAsset(null); // This line is crucial - it clears the react-select value
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

      {loading ? (
        <p className="text-center text-blue-500">Loading assigned assets...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Assigned Asset */}
          <div>
            <label className="block font-medium">
              Select Asset <span className="text-red-500">*</span>
            </label>
            <Select
              options={assignedAssets.map((asset) => ({
                value: asset._id,
                label: `${asset.name} (${asset.asset_id})`,
              }))}
              onChange={handleAssetChange}
              value={selectedAsset} // This line ensures the Select component displays the correct value
              placeholder="Search and select an asset..."
              isSearchable
              className="basic-single"
              isClearable={true} // Added for better UX
            />
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
              <option value="Task Completed">Task Completed</option>
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
              className="bg-[#673AB7] hover:bg-[#5E35B1] text-white px-6 py-2 rounded-lg"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ReturnRequest;