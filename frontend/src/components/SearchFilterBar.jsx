import { FaDownload, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const SearchFilterBar = ({
  search,
  setSearch,
  filter,
  setFilter,
  exportFormat,
  setExportFormat,
  data,
  columns, // prop for visible columns
  filename,
  statusOptions,
}) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    if (!filename || filename.trim() === "") {
      alert("Filename is required for export.");
      return;
    }

    switch (exportFormat) {
      case "csv":
        exportCSV();
        break;
      case "pdf":
        exportPDF();
        break;
      case "excel":
        exportExcel();
        break;
      default:
        alert("Invalid export format selected.");
    }
  };

  const exportCSV = () => {
    if (!columns || columns.length === 0) return;
  
    const headers = columns
      .filter(col => col.accessor)
      .map(col => col.header)
      .join(",");
  
    const rows = data.map(row =>
      columns
        .filter(col => col.accessor)
        .map(col => row[col.accessor] || "")
        .join(",")
    );
  
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    downloadFile(blob, `${filename}.csv`);
  };
  
  const getImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      return null;
    }
  };
  
  const exportPDF = async () => {
    if (!columns || columns.length === 0) return;
  
    const doc = new jsPDF();
    doc.text(`${filename}`, 14, 10);
  
    const headers = columns
      .filter(col => col.header !== "Actions") // Exclude Actions column
      .map(col => col.header);
  
    // Convert data rows
    const body = await Promise.all(
      data.map(async (row) => {
        return await Promise.all(
          columns.map(async (col) => {
            if (col.header === "Actions") return null;
  
            if (col.header === "Image" && row.image) {
              try {
                const imgData = await getImageAsBase64(row.image);
                return { image: imgData, width: 20, height: 20 };
              } catch (error) {
                console.error("Error loading image:", error);
                return "Image Error";
              }
            }
            return row[col.accessor] || "";
          })
        );
      })
    );
  
    // Split data into chunks of 10 rows per page
    const rowsPerPage = 10;
    const pageChunks = [];
    for (let i = 0; i < body.length; i += rowsPerPage) {
      pageChunks.push(body.slice(i, i + rowsPerPage));
    }
  
    let startY = 20;
  
    pageChunks.forEach((pageData, index) => {
      if (index > 0) doc.addPage(); // Add new page except for the first page
  
      autoTable(doc, {
        head: [headers],
        body: pageData.map(row => row.filter(cell => cell !== null)),
        startY,
        margin: { top: 20 },
        didParseCell: (data) => {
          if (data.cell.raw?.image) {
            data.row.height = Math.max(data.row.height, 25);
          }
        },
        didDrawCell: (data) => {
          if (data.column.index === 0 && data.cell.raw?.image) {
            doc.addImage(
              data.cell.raw.image,
              "JPEG",
              data.cell.x + 2,
              data.cell.y + 2,
              25, // Image width
              20  // Image height
            );
          }
        },
      });
    });
  
    doc.save(`${filename}.pdf`);
  };
  
  
  const exportExcel = () => {
    if (!columns || columns.length === 0) return;
  
    const filteredData = data.map(row =>
      Object.fromEntries(
        columns
          .filter(col => col.accessor)
          .map(col => [col.header, row[col.accessor] || ""])
      )
    );
  
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };
  

  const downloadFile = (blob, fileName) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 pl-10 w-full border rounded-lg focus:outline-none"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Filter Dropdown with Safe Fallback */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-3 border rounded-lg"
      >
        <option value="All">All Status</option>
        {statusOptions?.length > 0 ? (
          statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))
        ) : (
          <option disabled>No Status Options Available</option>
        )}
      </select>

      {/* Export Dropdown & Button */}
      {exportFormat && (
        <>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>

          <button
            className="bg-green-500 text-white px-4 flex items-center gap-2 rounded-lg"
            onClick={handleExport}
          >
            <FaDownload /> Export
          </button>
        </>
      )}
    </div>
  );
};

export default SearchFilterBar;
