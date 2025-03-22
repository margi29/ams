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
    description: "",
    quantity: 1, // Default quantity
    image: "",
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
  



  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAsset((prev) => ({ ...prev, image: file })); // Store file object
    }
  };
  
  




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
  
      // Ensure the response is JSON before parsing
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
  
      return data.isUnique;
    } catch (error) {
      console.error("❌ Error fetching Asset IDs:", error);
      alert("Error fetching asset ID. Please refresh and try again.");
      return false; // Assume it's not unique if the check fails
    }
  };
  
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(asset).forEach((key) => {
        if (key === "image" && asset.image) {
            formData.append("image", asset.image);
        } else {
            formData.append(key, asset[key]);
        }
    });

    try {
        const response = await fetch("http://localhost:3000/api/assets", {
            method: "POST",
            body: formData,
        });

        const responseData = await response.json();
        console.log("✅ Server Response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.message || "Error adding assets");
        }

        alert("Assets added successfully!");
        setSubmittedAsset(responseData.assets); // Store array of submitted assets

    } catch (error) {
        console.error("❌ Error adding assets:", error);
        alert("Failed to add assets. Check console for details.");
    }
};
  
  




const downloadQRCode = (assetId) => {
  const qrCanvas = document.querySelector("canvas");
  if (!qrCanvas) {
      console.error("QR Code canvas not found!");
      return;
  }

  const pngUrl = qrCanvas.toDataURL("image/png");
  const downloadLink = document.createElement("a");
  downloadLink.href = pngUrl;
  downloadLink.download = `${assetId}_QRCode.png`;
  document.body.appendChild(downloadLink);
  downloadLink.style.display = 'none'; // Prevent display on the page
  downloadLink.click();
  document.body.removeChild(downloadLink);
};
  

return (
  <div className="p-6 mt-16 bg-white shadow-lg rounded-xl">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
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
  <label className="block text-gray-700 font-medium">Quantity *</label>
  <input
    type="number"
    name="quantity"
    value={asset.quantity}
    onChange={handleChange}
    min="1"
    required
    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
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

      <div>
  <label className="block text-gray-700 font-medium">Upload Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImageUpload(e)}
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


     {submittedAsset && Array.isArray(submittedAsset) && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Asset QR Codes</h3>
                    <div className="flex flex-wrap justify-center"> {/* Horizontal layout */}
                        {submittedAsset.map((item, index) => (
                            <div key={index} className="m-2 text-center"> {/* Added margin */}
                                <h4 className="font-semibold">Asset {index + 1}</h4>
                                <QRCodeCanvas
                                    value={`Asset ID: ${item.asset_id}
Name: ${item.name}
Manufacturer: ${item.manufacturer}
Model No.: ${item.model_no}
Category: ${item.category}
Status: ${item.status}
Purchase Date: ${item.purchase_date}
Warranty Expiry: ${item.warranty_expiry || "N/A"}
Description: ${item.description || "N/A"}`}
                                    size={200}
                                />

                                <button onClick={() => downloadQRCode(item.asset_id)} className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    Download
                                </button>
                                {/* Display Image */}
                                {/* {item.image && (
                                    <div className="mt-2">
                                        <img src={`http://localhost:3000/${item.image}`} alt="Asset" className="w-20 h-20 object-cover rounded-md shadow-md" />
                                    </div>
                                )} */}
                            </div>
                        ))}
                    </div>
                </div>
            )}



  </div>
 );
};

export default AddAsset;


