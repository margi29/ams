import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import SearchFilterBar from "../../components/SearchFilterBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Table from "../../components/Table";

// ✅ Status color mapping (same as AllAssets.jsx)
const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-blue-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 font-semibold",
};

const QRCodeList = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/assets");
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets
  .filter(
    (asset) =>
      (filter === "All" || asset.status === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.asset_id.localeCompare(b.asset_id, undefined, { numeric: true }));



  // ✅ Download full list as PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait", // A4 Portrait mode
      unit: "mm",
      format: "a4",
    });
  
    doc.setFont("helvetica", "bold");
    doc.text("QR Code List", 105, 15, { align: "center" });
  
    let y = 25; // Initial Y position
    const qrSize = 40; // QR Code size
    const colWidth = 95; // Space between 2 QR codes in a row
    const rowHeight = 60; // Adjusted row height
    let x = 20; // Start position for first column
    const maxRowsPerPage = 4; // ✅ Exactly 4 rows per page (8 QR codes)
    let rowCounter = 0; // Track rows per page
  
    filteredAssets.forEach((asset, index) => {
      const qrCanvas = document.getElementById(`qr-${asset.asset_id}`);
      if (qrCanvas) {
        const qrImage = qrCanvas.toDataURL("image/png"); // Convert QR to PNG
  
        // ✅ Page Break Logic: If we have filled 4 rows (8 QR codes), create a new page
        if (rowCounter === maxRowsPerPage) {
          doc.addPage();
          y = 25; // Reset Y position for new page
          x = 20; // Reset column
          rowCounter = 0; // Reset row counter
        }
  
        // ✅ Add QR Code
        doc.addImage(qrImage, "PNG", x, y, qrSize, qrSize);
  
        // ✅ Align text to start exactly under QR Code
        doc.setFontSize(9);
        doc.text(`ID: ${asset.asset_id}`, x, y + qrSize + 6);
        doc.text(`Name: ${asset.name}`, x, y + qrSize + 12);
  
        // 🔄 Move to next column (Left → Right)
        if (x === 20) {
          x += colWidth; // Move to right column
        } else {
          x = 20; // Reset to first column
          y += rowHeight; // Move to next row
          rowCounter++; // ✅ Track row count correctly
        }
      }
    });
  
    doc.save("QR_Code_List.pdf");
  };
  
  
  


  const downloadQRCodeImage = (asset) => {
    const qrCanvas = document.getElementById(`qr-${asset.asset_id}`);
    if (qrCanvas) {
      const qrImage = qrCanvas.toDataURL("image/png"); // Convert QR to PNG
  
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = `QR_Code_${asset.asset_id}.png`; // Set file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  
  

  
  
  
  
  

  // Columns for the Table component
  const columns = [
    { header: "Asset ID", accessor: "asset_id" },
    { header: "Asset Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Status", accessor: "status", className: (status) => statusColors[status] },
    {
      header: "QR Code",
      accessor: "asset_id",
      render: (asset) => (
        <div className="flex flex-col items-center">
          <QRCodeCanvas
            id={`qr-${asset.asset_id}`} // Matches element for selection
            value={`Asset Details:
    ID: ${asset.asset_id}
    Name: ${asset.name}
    Category: ${asset.category}
    Status: ${asset.status}
    Manufacturer: ${asset.manufacturer || "N/A"}
    Model No.: ${asset.model_no || "N/A"}
    Purchase Date: ${asset.purchase_date || "N/A"}
    Warranty Expiry: ${asset.warranty_expiry || "N/A"}
    Location: ${asset.location || "N/A"}
    Description: ${asset.description || "N/A"}`}
            size={150}
            includeMargin={true}
          />
          {/* ✅ Download Button for Individual QR Code */}
          <button
            onClick={() => downloadQRCodeImage(asset)}
            className="bg-green-500 text-white px-3 py-1 mt-2 text-sm rounded"
          >
            Download QR
          </button>
        </div>
      ),
    }
    
    
    
  ];

  return (
    <motion.div
  className="p-6 mt-16 bg-white shadow-lg rounded-xl"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
>
  <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">QR Code List</h2>

  {/* ✅ Search, Filter & Download in One Row */}
  <div className="flex items-center gap-3">
  {/* ✅ Search Bar - Takes Remaining Space */}
  <div className="flex-grow">
    <SearchFilterBar
      search={search}
      setSearch={setSearch}
      filter={filter}
      setFilter={setFilter}
      statusOptions={["Available", "Assigned", "Under Maintenance", "Retired"]}
    />
  </div>

  {/* ✅ Download Button - Fixed Size */}
  <button
    className="bg-red-500 text-white px-4 py-2 rounded flex items-center h-full"
    onClick={downloadPDF}
  >
    <FaFilePdf className="mr-2" /> Download PDF
  </button>
</div>


  {/* ✅ Table with Status and QR Codes */}
  <div className="overflow-x-auto mt-6">
    <Table columns={columns} data={filteredAssets} />
  </div>
</motion.div>

  );
};

export default QRCodeList;
