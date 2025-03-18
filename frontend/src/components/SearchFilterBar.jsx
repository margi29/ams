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
  filename, // Now filename is mandatory
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
    const csvContent = [
      Object.keys(data[0]).join(","), // Headers
      ...data.map((row) => Object.values(row).join(",")), // Data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`${filename}`, 14, 10); // Set filename as title

    autoTable(doc, {
      head: [Object.keys(data[0])], // Table headers
      body: data.map((row) => Object.values(row)), // Table data
    });

    doc.save(`${filename}.pdf`);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
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
