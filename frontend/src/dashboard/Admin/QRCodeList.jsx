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
            id={`qr-${asset.asset_id}`} // Ensure it matches the element we select
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
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="p-6 mt-16 bg-white shadow-lg rounded-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">QR Code List</h2>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        statusOptions={["Available", "Assigned", "Under Maintenance", "Retired"]}
      />

      {/* ✅ Download Full List as PDF */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
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
