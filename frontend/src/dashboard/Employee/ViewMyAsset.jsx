import React, { useState, useEffect } from "react";

const ViewMyAsset = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statusOptions = ["All", "Assigned", "Returned", "Pending", "Under Maintenance"];

  // Mock Data (Replace with API call later)
  useEffect(() => {
    const mockAssets = [
      { id: 1, name: "Dell Laptop", type: "Laptop", status: "Assigned", assignedDate: "2025-02-10" },
      { id: 2, name: "HP Printer", type: "Printer", status: "Returned", assignedDate: "2025-01-20" },
      { id: 3, name: "Cisco Router", type: "Router", status: "Under Maintenance", assignedDate: "2025-03-05" },
    ];
    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
  }, []);

  // Handle Search and Filter
  useEffect(() => {
    let result = assets;

    if (filter !== "All") {
      result = result.filter((asset) => asset.status === filter);
    }
    if (search.trim()) {
      result = result.filter((asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredAssets(result);
  }, [search, filter, assets]);

  return (
    <div className="p-6 mt-24 bg-white min-h-screen">
      <h1 className="text-4xl font-semibold text-[#302757]">My Assets</h1>
      <p className="text-md text-gray-600">View and manage your assigned assets.</p>

      <div className="mt-6">
        <p className="text-gray-600">You can add search and filter functionality later.</p>
      </div>

      <div className="mt-6">
        {filteredAssets.length > 0 ? (
          <ul>
            {filteredAssets.map((asset) => (
              <li key={asset.id} className="border p-4 mb-2 rounded-lg">
                <p><strong>{asset.name}</strong> - {asset.type}</p>
                <p>Status: <span className="font-semibold">{asset.status}</span></p>
                <p>Assigned Date: {asset.assignedDate}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assets found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMyAsset;
