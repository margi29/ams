import { useState, useEffect } from "react";
import Select from "react-select";
import { motion } from "framer-motion";

const MaintenanceRequest = () => {
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [task, setTask] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets/my-assets", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();

        // ✅ Format assets with status for react-select
        const formattedAssets = data.map((asset) => ({
          value: asset._id,
          label: `${asset.name}`, 
          status: asset.status, // Store status separately for logic
        }));

        setAssignedAssets(formattedAssets);
      } catch (error) {
        console.error("Error fetching assigned assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset || !task) {
      alert("Please select an asset and enter a task.");
      return;
    }

    if (selectedAsset.status === "Under Maintenance") {
      alert("This asset is already under maintenance.");
      return;
    }

    const confirmSend = window.confirm("Are you sure you want to send this asset for maintenance?");
    if (confirmSend) {
      try {
        const response = await fetch("http://localhost:3000/api/maintenance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ assetId: selectedAsset.value, task }),
        });

        if (response.ok) {
          alert("Maintenance request submitted successfully.");

          // ✅ Update status in dropdown instead of removing it
          setAssignedAssets((prevAssets) =>
            prevAssets.map((asset) =>
              asset.value === selectedAsset.value ? { ...asset, label: `${asset.label.split(" (")[0]} (Under Maintenance)`, status: "Under Maintenance" } : asset
            )
          );

          setSelectedAsset(null);
          setTask("");
        } else {
          alert("Failed to submit maintenance request.");
        }
      } catch (error) {
        console.error("Error submitting maintenance request:", error);
      }
    }
  };

  return (
    <motion.div
      className="p-6 mt-16 bg-white rounded-lg shadow-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-center text-gray-800">Maintenance Request</h1>
      <p className="text-center text-gray-600 mt-2">
        Submit a request to send an asset for maintenance.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* React-Select Dropdown */}
        <div>
          <label className="block font-medium">
            Select Asset <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedAsset}
            onChange={setSelectedAsset}
            options={assignedAssets}
            placeholder="Choose an Asset..."
            className="w-full"
          />
        </div>

        {/* Task Input */}
        <div>
          <label className="block font-medium">
            Task <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-3 border rounded-lg border-gray-300"
            placeholder="Describe the maintenance task"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#673AB7] hover:bg-[#5E35B1] text-white font-bold py-3 rounded-lg transition"
        >
          Send for Maintenance
        </button>
      </form>
    </motion.div>
  );
};

export default MaintenanceRequest;
