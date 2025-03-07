import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const AddAsset = () => {
  const [asset, setAsset] = useState({
    asset_id: "",
    name: "",
    category: "",
    status: "Available",
    assigned_to: "",
    purchase_date: "",
    warranty_expiry: "",
    location: "",
  });

  const [submittedAsset, setSubmittedAsset] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!asset.asset_id || !asset.name || !asset.category || !asset.purchase_date) {
      alert("Please fill all required fields.");
      return;
    }

    setSubmittedAsset(asset);
    console.log("Asset Submitted:", asset);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${asset.asset_id}_QRCode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 pt-20">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Asset</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium">Asset ID *</label>
            <input type="text" name="asset_id" value={asset.asset_id} onChange={handleChange} required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Asset Name *</label>
            <input type="text" name="name" value={asset.name} onChange={handleChange} required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Category *</label>
            <input type="text" name="category" value={asset.category} onChange={handleChange} required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select name="status" value={asset.status} onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md">
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Disposed">Disposed</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Assigned To</label>
            <input type="text" name="assigned_to" value={asset.assigned_to} onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Purchase Date *</label>
            <input type="date" name="purchase_date" value={asset.purchase_date} onChange={handleChange} required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Warranty Expiry</label>
            <input type="date" name="warranty_expiry" value={asset.warranty_expiry} onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input type="text" name="location" value={asset.location} onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
          </div>

          <div className="col-span-2 flex justify-center">
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700">
              Add Asset
            </button>
          </div>
        </form>

        {/* QR Code Display */}
        {submittedAsset && (
          <div className="mt-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Asset QR Code</h3>
            <div className="p-4 bg-white rounded-lg shadow-md flex justify-center">
              <QRCodeCanvas
                id="qrCode"
                value={`Asset ID: ${submittedAsset.asset_id}
Name: ${submittedAsset.name}
Category: ${submittedAsset.category}
Status: ${submittedAsset.status}
Assigned To: ${submittedAsset.assigned_to}
Purchase Date: ${submittedAsset.purchase_date}
Warranty Expiry: ${submittedAsset.warranty_expiry}
Location: ${submittedAsset.location}`}
                size={200}
              />
            </div>
            <button onClick={downloadQRCode} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAsset;
