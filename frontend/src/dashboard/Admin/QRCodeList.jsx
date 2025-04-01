import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFilePdf } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import SearchFilterBar from "../../components/SearchFilterBar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Table from "../../components/Table";

// Status color mapping (same as AllAssets.jsx)
const statusColors = {
  Available: "text-green-600 font-semibold",
  Assigned: "text-blue-600 font-semibold",
  "Under Maintenance": "text-red-600 font-semibold",
  Retired: "text-gray-600 font-semibold",
};

// Action sentences generation function
const actionSentences = (action, userName, userRole, assetName, assignedTo) => {
  if (!userName || !userRole || !assetName) return "Invalid data for action.";

  switch (action) {
    case "Assigned":
      return userRole === "Admin"
        ? `${userName} assigned ${assetName} to ${assignedTo}.`
        : `${userName} was assigned ${assetName}.`;
    case "Created":
      return `${userName} created the asset ${assetName}.`;
    case "Updated":
      return `${userName} updated the asset ${assetName}.`;
    case "Deleted":
      return `${userName} deleted the asset ${assetName}.`;
    case "Scheduled for Maintenance":
      return `${userName} scheduled maintenance for ${assetName}.`;
    case "Maintenance Completed":
      return `${userName} marked maintenance as completed for ${assetName}.`;
    case "Asset Requested":
      return `${userName} requested the asset ${assetName}.`;
    case "Returned":
      return `${userName} returned the asset ${assetName}.`;
    case "Maintenance Requested":
      return `${userName} reported an issue with ${assetName}.`;
    default:
      return `${userName} performed an action: ${action} on ${assetName}.`;
  }
};

const QRCodeList = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/assets", 
         { headers: {
            "Authorization": `Bearer ${token}`, // Send token in headers
            "Content-Type": "application/json",}
          });
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

  // Generate asset URL for QR code
  const generateAssetUrl = (assetId) => {
    return `${window.location.origin}/asset-details/${assetId}`;
  };

  // Download full list as PDF
  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait", 
      unit: "mm",
      format: "a4",
    });
  
    doc.setFont("helvetica", "bold");
    doc.text("QR Code List", 105, 15, { align: "center" });
  
    let y = 25; 
    const qrSize = 40; 
    const colWidth = 95; 
    const rowHeight = 60; 
    let x = 20; 
    const maxRowsPerPage = 4; 
    let rowCounter = 0; 
  
    filteredAssets.forEach((asset, index) => {
      const qrCanvas = document.getElementById(`qr-${asset._id}`);
      if (qrCanvas) {
        const qrImage = qrCanvas.toDataURL("image/png"); 
  
        if (rowCounter === maxRowsPerPage) {
          doc.addPage();
          y = 25;
          x = 20;
          rowCounter = 0;
        }
  
        doc.addImage(qrImage, "PNG", x, y, qrSize, qrSize);
  
        doc.setFontSize(9);
        doc.text(`ID: ${asset._id}`, x, y + qrSize + 6);
        doc.text(`Name: ${asset.name}`, x, y + qrSize + 12);
  
        if (x === 20) {
          x += colWidth;
        } else {
          x = 20;
          y += rowHeight;
          rowCounter++;
        }
      }
    });
  
    doc.save("QR_Code_List.pdf");
  };

  // Download individual QR code as an image
  const downloadQRCodeImage = (asset) => {
    const qrCanvas = document.getElementById(`qr-${asset._id}`);
    if (qrCanvas) {
      const qrImage = qrCanvas.toDataURL("image/png");
  
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = `QR_Code_${asset._id}.png`;
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
      accessor: "_id", 
      render: (asset) => (
        <div className="flex flex-col items-center">
          <QRCodeCanvas
            id={`qr-${asset._id}`}
            value={generateAssetUrl(asset._id)} 
            size={150}
            includeMargin={true}
          />
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

      <div className="flex items-center gap-3">
        <div className="flex-grow">
          <SearchFilterBar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            statusOptions={["Available", "Assigned", "Under Maintenance", "Retired"]}
          />
        </div>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center h-full"
          onClick={downloadPDF}
        >
          <FaFilePdf className="mr-2" /> Download PDF
        </button>
      </div>

      <div className="overflow-x-auto mt-6">
        <Table columns={columns} data={filteredAssets} />
      </div>
    </motion.div>
  );
};

export default QRCodeList;
