import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import CreatableSelect from "react-select/creatable";

const AddAsset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editing = Boolean(location.state?.asset);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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
    qr_code: "",
  });

  const [submittedAsset, setSubmittedAsset] = useState(null);

  // ✅ Function to generate QR code content
  const generateQRCode = (assetData) => {
    return `Asset ID: ${assetData.asset_id}
Name: ${assetData.name}
Manufacturer: ${assetData.manufacturer}
Model No.: ${assetData.model_no}
Category: ${assetData.category}
Status: ${assetData.status}
Purchase Date: ${assetData.purchase_date}
Warranty Expiry: ${assetData.warranty_expiry || "N/A"}
Location: ${assetData.location}
Description: ${assetData.description || "N/A"}`;
  };

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        const categoryOptions = data.map((item) => ({
          value: item.category,
          label: item.category,
        }));

        setCategories(categoryOptions);

        if (editing) {
          const assetCategory = categoryOptions.find(
            (option) => option.value === location.state.asset.category
          );
          setSelectedCategory(assetCategory || null);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [editing, location.state]);

  // ✅ If editing, prefill the form & regenerate QR code
  useEffect(() => {
    if (editing) {
      const updatedAsset = {
        ...location.state.asset,
        purchase_date: formatDate(location.state.asset.purchase_date),
        warranty_expiry: formatDate(location.state.asset.warranty_expiry),
      };

      updatedAsset.qr_code = generateQRCode(updatedAsset);
      setAsset(updatedAsset);
    } else {
      fetchNextAssetId();
    }
  }, [editing, location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // ✅ Fetch next available Asset ID
  const fetchNextAssetId = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/assets/all-ids");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      let nextId = findFirstAvailableAssetId(data.assetIds || []);
      setAsset((prev) => ({ ...prev, asset_id: nextId }));
    } catch (error) {
      console.error("Error fetching Asset IDs:", error);
    }
  };

  const findFirstAvailableAssetId = (existingIds) => {
    if (!existingIds.length) return "A01";

    let numericIds = existingIds
      .map((id) => parseInt(id.replace(/\D/g, ""), 10))
      .filter((num) => !isNaN(num))
      .sort((a, b) => a - b);

    for (let i = 1; i <= numericIds.length; i++) {
      if (!numericIds.includes(i)) return `A${String(i).padStart(2, "0")}`;
    }

    return `A${String(numericIds[numericIds.length - 1] + 1).padStart(2, "0")}`;
  };

  // ✅ Handle input change & regenerate QR Code
  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "purchase_date" || name === "warranty_expiry") {
      const parts = value.split("-");
      if (parts.length === 3) formattedValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    setAsset((prev) => {
      const updatedAsset = { ...prev, [name]: formattedValue };
      updatedAsset.qr_code = generateQRCode(updatedAsset);
      return updatedAsset;
    });
  };

  // ✅ Handle category change
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setAsset((prev) => {
      const updatedAsset = { ...prev, category: selectedOption ? selectedOption.value : "" };
      updatedAsset.qr_code = generateQRCode(updatedAsset);
      return updatedAsset;
    });
  };

  const handleNewCategory = (inputValue) => {
    if (!inputValue) return;

    const newCategory = { value: inputValue, label: inputValue };
    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategory(newCategory);

    setAsset((prev) => {
      const updatedAsset = { ...prev, category: inputValue };
      updatedAsset.qr_code = generateQRCode(updatedAsset);
      return updatedAsset;
    });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        editing ? `http://localhost:3000/api/assets/${asset._id}` : "http://localhost:3000/api/assets",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(asset),
        }
      );

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "Error saving asset");

      alert(editing ? "Asset updated successfully!" : "Asset added successfully!");
      setSubmittedAsset(responseData);
      navigate("/admin/assets");
    } catch (error) {
      console.error("Error saving asset:", error);
      alert("Failed to save asset. Check console for details.");
    }
  };

  // ✅ Download QR Code
  const downloadQRCode = () => {
    const qrCanvas = document.querySelector("canvas");
    if (!qrCanvas) return;

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
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {editing ? "Edit Asset" : "Add New Asset"}
      </h2>
      <form onSubmit={handleSubmit}  className="grid grid-cols-2 gap-6">
        {/* Form fields... */}
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
  <CreatableSelect
    options={categories}
    value={selectedCategory}
    onChange={handleCategoryChange}
    onCreateOption={handleNewCategory} // Handle new category creation
    isClearable
    isSearchable
    placeholder="Select or type a category..."
    className="mt-1"
  />
</div>

      <div>
  <label className="block text-gray-700 font-medium">Status</label>
  <input
    type="text"
    name="status"
    value={asset.status}
    readOnly
    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
  />
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
            {editing ? "Update Asset" : "Add Asset"}
          </button>
        </div>
      </form>

      {asset.qr_code && (
        <div className="mt-6 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Asset QR Code</h3>
          <QRCodeCanvas value={asset.qr_code} size={200} />
          <button onClick={downloadQRCode} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default AddAsset;
