import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

const AddAsset = () => {
  const [asset, setAsset] = useState({
    asset_id: "",
    name: "",
    manufacturer: "",
    model_no: "",
    category: "",
    status: "Available",
    purchase_date: "",
    warranty_expiry: "",
    location: "",
    description: "",
  });

  const [submittedAsset, setSubmittedAsset] = useState(null);


  const fetchNextAssetId = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/assets/all-ids");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
  
      console.log("🔍 Received asset IDs:", data.assetIds); // Debugging
  
      if (!data.assetIds || data.assetIds.length === 0) {
        setAsset((prev) => ({ ...prev, asset_id: "A01" })); // If no assets exist
        return;
      }
  
      // Find the first available ID
      let nextId = findFirstAvailableAssetId(data.assetIds);
      console.log("✅ Final Assigned Asset ID:", nextId);
  
      setAsset((prev) => ({ ...prev, asset_id: nextId }));
    } catch (error) {
      console.error("❌ Error fetching Asset IDs:", error);
    }
  };
  

  
  
  const findFirstAvailableAssetId = (existingIds) => {
    if (!existingIds || existingIds.length === 0) {
      return "A01"; // If no assets exist
    }
  
    // Extract numbers from asset IDs and convert them to integers
    let numericIds = existingIds
      .map((id) => parseInt(id.replace(/\D/g, ""), 10))
      .filter((num) => !isNaN(num)); // Filter out any invalid values
  
    // Sort numeric IDs in ascending order
    numericIds.sort((a, b) => a - b);
  
    // Find the first missing ID
    for (let i = 1; i <= numericIds.length; i++) {
      if (!numericIds.includes(i)) {
        return `A${String(i).padStart(2, "0")}`; // Ensure it's always a 2-digit format
      }
    }
  
    // If no missing ID is found, return the next consecutive ID
    return `A${String(numericIds[numericIds.length - 1] + 1).padStart(2, "0")}`;
  };
  
  
  
  // Run on page load
  useEffect(() => {
    fetchNextAssetId();
  }, []);
  






  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset((prev) => ({ ...prev, [name]: value }));
  };

  const checkUniqueAssetId = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/assets/check-id/${assetId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();  // 💥 Error happens here if response is not JSON
      return data.isUnique;
    } catch (error) {
      console.error("Error checking asset ID:", error);
      return false;
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const isUnique = await checkUniqueAssetId(asset.asset_id);
      if (!isUnique) {
        alert("Asset ID already exists! Please enter a unique ID.");
        return;
      }
  
      // ✅ Manually create QR code value
      const qrValue = `Asset ID: ${asset.asset_id}
  Name: ${asset.name}
  Manufacturer: ${asset.manufacturer}
  Model No.: ${asset.model_no}
  Category: ${asset.category}
  Status: ${asset.status}
  Purchase Date: ${asset.purchase_date}
  Warranty Expiry: ${asset.warranty_expiry || "N/A"}
  Location: ${asset.location}
  Description: ${asset.description || "N/A"}`;
  
      // 🔹 Add QR Code value directly to asset object
      const assetWithQR = { ...asset, qr_code: qrValue };
  
      console.log("🚀 Sending request to backend with QR Code...");
      const response = await fetch("http://localhost:3000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetWithQR),
      });
  
      const responseData = await response.json();
      console.log("✅ Server Response:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || "Error adding asset");
      }
  
      alert("Asset added successfully!");
  
      // ✅ Set `submittedAsset` so the QR code renders
      setSubmittedAsset(responseData);
  
    } catch (error) {
      console.error("❌ Error adding asset:", error);
      alert("Failed to add asset. Check console for details.");
    }
  };
  




  const downloadQRCode = () => {
    const qrCanvas = document.querySelector("canvas"); // Directly get the canvas element
    if (!qrCanvas) {
      console.error("❌ QR Code canvas not found!");
      return;
    }
  
    const pngUrl = qrCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${asset.asset_id}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  

return (
  <div className="p-6 mt-16 bg-white shadow-lg rounded-xl">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Add New Asset
    </h2>

    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 font-medium">Asset ID *</label>
        <input
            type="text"
            name="asset_id"
            value={asset.asset_id}
            readOnly
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
          />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Asset Name *</label>
        <input
          type="text"
          name="name"
          value={asset.name}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Manufacturer *</label>
        <input
          type="text"
          name="manufacturer"
          value={asset.manufacturer}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Model No. *</label>
        <input
          type="text"
          name="model_no"
          value={asset.model_no}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Category *</label>
        <input
          type="text"
          name="category"
          value={asset.category}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Status</label>
        <select
          name="status"
          value={asset.status}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        >
          <option value="Available">Available</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Purchase Date *</label>
        <input
          type="date"
          name="purchase_date"
          value={asset.purchase_date}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Warranty Expiry</label>
        <input
          type="date"
          name="warranty_expiry"
          value={asset.warranty_expiry}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-gray-700 font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={asset.location}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-gray-700 font-medium">Description (Optional)</label>
        <textarea
          name="description"
          value={asset.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="col-span-2 flex justify-center">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700"
        >
          Add Asset
        </button>
      </div>
    </form>


    {submittedAsset ? (
  <div className="mt-6 flex flex-col items-center">
    {console.log("🖨️ Rendering QR Code for:", submittedAsset)}
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Asset QR Code</h3>
    <QRCodeCanvas
      id="qrCode"
      value={`Asset ID: ${submittedAsset.asset_id}
Name: ${submittedAsset.name}
Manufacturer: ${submittedAsset.manufacturer}
Model No.: ${submittedAsset.model_no}
Category: ${submittedAsset.category}
Status: ${submittedAsset.status}
Purchase Date: ${submittedAsset.purchase_date}
Warranty Expiry: ${submittedAsset.warranty_expiry || "N/A"}
Location: ${submittedAsset.location}
Description: ${submittedAsset.description || "N/A"}`}
      size={200}
    />
    <button onClick={downloadQRCode} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
      Download QR Code
    </button>
  </div>
) : null}




  </div>
 );
};

export default AddAsset;


