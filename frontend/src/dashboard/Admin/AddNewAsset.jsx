import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

const AddNewAsset = () => {
  const location = useLocation();
  const editing = Boolean(location.state?.asset);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Initial blank asset state
  const initialAssetState = {
    asset_id: "",
    name: "",
    manufacturer: "",
    model_no: "",
    category: "",
    status: "Available",
    purchase_date: "",
    warranty_expiry: "",
    description: "",
    quantity: 1,
    image: ""
  };

  const [asset, setAsset] = useState(initialAssetState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/assets/categories");
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

  // If editing, prefill the form
  useEffect(() => {
    if (editing) {
      const updatedAsset = {
        ...location.state.asset,
        purchase_date: formatDate(location.state.asset.purchase_date),
        warranty_expiry: formatDate(location.state.asset.warranty_expiry),
        // Ensure quantity is 1 when editing
        quantity: 1
      };

      setAsset(updatedAsset);
      
      // Set initial image preview if asset has an image
      if (updatedAsset.image) {
        setImagePreview(updatedAsset.image);
      }
    } else {
      fetchNextAssetId();
    }
  }, [editing, location.state]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Fetch next available Asset ID
  const fetchNextAssetId = async () => {
    try {
      const response = await fetch("/api/assets/all-ids");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      console.log("🔍 Received asset IDs:", data.assetIds);
      
      let nextId = findFirstAvailableAssetId(data.assetIds || []);
      console.log("Final Assigned Asset ID:", nextId);
      
      setAsset((prev) => ({ 
        ...prev, 
        asset_id: nextId
      }));
    } catch (error) {
      console.error("Error fetching Asset IDs:", error);
    }
  };

  const findFirstAvailableAssetId = (existingIds) => {
    if (!existingIds || existingIds.length === 0) {
      return "A01"; // If no assets exist
    }
  
    // Extract numbers from asset IDs and convert them to integers
    let numericIds = existingIds
      .map((id) => parseInt(id.replace(/\D/g, ""), 10))
      .filter((num) => !isNaN(num));
  
    numericIds.sort((a, b) => a - b);
  
    for (let i = 1; i <= numericIds.length; i++) {
      if (!numericIds.includes(i)) {
        return `A${String(i).padStart(2, "0")}`;
      }
    }
  
    return `A${String(numericIds.length > 0 ? numericIds[numericIds.length - 1] + 1 : 1).padStart(2, "0")}`;
  };

  // Reset form to initial state
  const resetForm = () => {
    setAsset(initialAssetState);
    setSelectedCategory(null);
    setImageFile(null);
    setImagePreview(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
    
    // Fetch a new asset ID for the next asset
    fetchNextAssetId();
  };

  // Improved image handling with preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create image preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      console.log("Image selected:", file.name);
      console.log("Preview created:", previewUrl);
    } else {
      // Clear preview if file selection is canceled
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  // Clear image and preview
  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    
    // If we're editing, we also need to clear the existing image URL
    if (editing) {
      setAsset(prev => ({
        ...prev,
        image: "" // Clear the image URL in the asset state
      }));
    }
    
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsset((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category change
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setAsset((prev) => ({
      ...prev,
      category: selectedOption ? selectedOption.value : ""
    }));
  };

  const handleNewCategory = (inputValue) => {
    if (!inputValue) return;

    const newCategory = { value: inputValue, label: inputValue };
    setCategories((prev) => [...prev, newCategory]);
    setSelectedCategory(newCategory);

    setAsset((prev) => ({
      ...prev,
      category: inputValue
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading image...");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error during upload:", errorText);
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);
      
      if (data.image) {
        return data.image;
      } else if (data.url || data.secure_url || data.filePath || data.path) {
        return data.url || data.secure_url || data.filePath || data.path;
      } else {
        console.error("Unexpected response format:", data);
        throw new Error("Image upload succeeded but response format is unexpected");
      }
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      return null;
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button
    
    let imageUrl = null;
    
    try {
      if (imageFile) {
        console.log("Processing image upload...");
        imageUrl = await handleImageUpload(imageFile);
        if (!imageUrl) {
          console.error("Image upload returned null");
          if (confirm("Image upload failed. Continue without image?")) {
            // Continue without image
          } else {
            setLoading(false);
            return; // Stop submission if user cancels
          }
        }
      }
  
      let finalImageUrl = imageUrl || asset.image || "";
      console.log("Final image URL:", finalImageUrl);
  
      const assetData = { 
        ...asset,
        image: finalImageUrl
      };
  
      if (!editing && asset.quantity > 1) {
        const assets = [];
        let currentAssetId = asset.asset_id;
  
        for (let i = 0; i < asset.quantity; i++) {
          if (i > 0) {
            const numPart = parseInt(currentAssetId.replace(/\D/g, ""), 10);
            const prefix = currentAssetId.replace(/\d+/g, "");
            currentAssetId = `${prefix}${String(numPart + i).padStart(2, "0")}`;
          }
  
          assets.push({
            ...assetData,
            asset_id: i === 0 ? assetData.asset_id : currentAssetId,
            quantity: 1,
            image: finalImageUrl
          });
        }
  
        console.log("Creating multiple assets:", assets);
  
        for (const assetItem of assets) {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/assets", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assetItem),
          });
  
          if (!response.ok) {
            throw new Error(`Failed to create asset: ${assetItem.asset_id}`);
          }
        }
  
        alert(`${assets.length} assets added successfully!`);
        
        // Reset form for new asset entry
        if (!editing) {
          resetForm();
        }
      } else {
        console.log("Creating/updating single asset:", assetData);
        const token = localStorage.getItem("token");
        const response = await fetch(
          editing ? `/api/assets/${asset._id}` : "/api/assets", 
          {
            method: editing ? "PUT" : "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assetData),
          });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          throw new Error(`Request failed with status: ${response.status}`);
        }
  
        alert(editing ? "Asset updated successfully!" : "Asset added successfully!");
        
        // Reset form for new asset entry
        if (!editing) {
          resetForm();
        }
      }
    } catch (error) {
      console.error("❌ Error saving asset:", error);
      alert(`Failed to save asset: ${error.message}`);
    } finally {
      setLoading(false); // Re-enable button after request completes
    }
  };

  return (
    <div className="p-6 mt-16 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {editing ? "Edit Asset" : "Add New Asset"}
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

        {/* Quantity field - shown in both create and edit modes but readonly in edit mode */}
        <div>
          <label className="block text-gray-700 font-medium">Quantity *</label>
          <input
            type="number"
            name="quantity"
            value={asset.quantity}
            onChange={editing ? undefined : handleChange}
            min="1"
            required
            readOnly={editing}
            className={`w-full mt-1 p-2 border border-gray-300 rounded-md ${editing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
            onCreateOption={handleNewCategory}
            isClearable
            isSearchable
            placeholder="Select or type a category..."
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Status</label>
          <div className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed">
            {editing ? asset.status : "Available"}
          </div>
        </div>

        {/* Image upload with preview */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Image {editing && !asset.image ? '*' : ''}</label>
          <div className="flex">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required={editing && !asset.image}
            />
            {imagePreview && (
              <button 
                type="button"
                onClick={handleClearImage}
                className="ml-2 mt-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Clear
              </button>
            )}
          </div>
          
          {/* Image preview */}
          {imagePreview && (
            <div className="mt-3 relative">
              <img 
                src={imagePreview} 
                alt="Image Preview" 
                className="w-40 h-40 object-cover rounded-md shadow-md"
              />
              <p className="text-sm text-green-600 mt-1">Image Preview</p>
            </div>
          )}
          
          {!imagePreview && asset.image && (
            <div className="mt-2">
              <span className="text-sm text-green-600">Current image available</span>
            </div>
          )}
        </div>

        {/* Purchase Date and Warranty Expiry side by side */}
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
            className={`w-full font-bold py-3 rounded-lg transition text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#673AB7] hover:bg-[#5E35B1]"
            }`}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Processing..." : editing ? "Update Asset" : "Add Asset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAsset;