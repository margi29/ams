import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDownload, FaFilePdf, FaFileCsv } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import SearchFilterBar from "../../components/SearchFilterBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const downloadQRCode = (id) => {
    setTimeout(() => {
      const qrCanvas = document.getElementById(`qr-${id}`);
  
      if (!qrCanvas) {
        console.error("QR code not found!");
        return;
      }
  
      // Convert canvas to PNG
      const pngUrl = qrCanvas.toDataURL("image/png");
  
      // Trigger download
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, 500); // Delay to allow QR rendering
  };
  
  
  
  const filteredAssets = assets.filter(
    (asset) =>
      (filter === "All" || asset.status === filter) &&
      asset.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Download full list as CSV
  const downloadCSV = () => {
    const csvContent =
      "Asset ID,Asset Name,Category,Status,Location\n" +
      filteredAssets
        .map(
          (asset) =>
            `"${asset.asset_id}","${asset.name}","${asset.category}","${asset.status}","${asset.location || "N/A"}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "QR_Code_List.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ Download full list as PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait", // A4 Portrait mode
      unit: "mm",
      format: "a4",
    });
  
    doc.text("QR Code List", 14, 20);
  
    let y = 30; // Initial Y position
    const qrSize = 40; // QR Code size
    const xLeft = 14; // Left column X position
    const xRight = 110; // Right column X position
    const rowHeight = 55; // Space between rows
    let isLeft = true; // Track left/right column
  
    filteredAssets.forEach((asset, index) => {
      const qrCanvas = document.getElementById(`qr-${asset.asset_id}`);
      if (qrCanvas) {
        const qrImage = qrCanvas.toDataURL("image/png"); // Convert QR to PNG
        const xPos = isLeft ? xLeft : xRight; // Determine column
  
        // QR Code
        doc.addImage(qrImage, "PNG", xPos, y, qrSize, qrSize);
  
        // Asset ID and Name below QR
        doc.text(`ID: ${asset.asset_id}  Name: ${asset.name}`, xPos, y + qrSize + 5);
  
        // Toggle column (Left → Right → New Row)
        if (isLeft) {
          isLeft = false;
        } else {
          isLeft = true;
          y += rowHeight; // Move to next row
        }
  
        // If reaching end of page, create a new page
        if (y > 270) {
          doc.addPage();
          y = 30;
        }
      }
    });
  
    doc.save("QR_Code_List.pdf");
  };
   
  
  

  return (
    <motion.div
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        QR Code List
      </h2>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        statusOptions={["Available", "Assigned", "Under Maintenance", "Retired"]}
      />

      {/* ✅ Download Full List */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          onClick={downloadCSV}
        >
          <FaFileCsv className="mr-2" /> Download CSV
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
          onClick={downloadPDF}
        >
          <FaFilePdf className="mr-2" /> Download PDF
        </button>
      </div>

      {/* ✅ Table with Status and QR Codes */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-3 text-left">Asset ID</th>
              <th className="border border-gray-300 p-3 text-left">Asset Name</th>
              <th className="border border-gray-300 p-3 text-left">Category</th>
              <th className="border border-gray-300 p-3 text-left">Status</th>
              <th className="border border-gray-300 p-3 text-left">QR Code</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <tr key={asset.asset_id} className="border-t">
                  <td className="border border-gray-300 p-3">{asset.asset_id}</td>
                  <td className="border border-gray-300 p-3">{asset.name}</td>
                  <td className="border border-gray-300 p-3">{asset.category}</td>
                  <td
                    className={`border border-gray-300 p-3 ${
                      statusColors[asset.status] || ""
                    }`}
                  >
                    {asset.status}
                  </td>
                  <td className="border border-gray-300 p-3">
                    <div className="flex flex-col items-center">
                    <QRCodeCanvas
  id={`qr-${asset.asset_id}`}  // ✅ Ensure it matches the element we select
  value={`Asset ID: ${asset.asset_id}
Name: ${asset.name}
Manufacturer: ${asset.manufacturer}
Model No.: ${asset.model_no}
Category: ${asset.category}
Status: ${asset.status}
Purchase Date: ${asset.purchase_date}
Warranty Expiry: ${asset.warranty_expiry || "N/A"}
Location: ${asset.location}
Description: ${asset.description || "N/A"}`}
  size={120}
  includeMargin={true}
/>


                      <button
                        className="mt-2 flex items-center bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => downloadQRCode(asset.asset_id)}
                      >
                        <FaDownload className="mr-2" /> Download QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No assets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default QRCodeList;
