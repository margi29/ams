import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportData = (data, format, filename) => {
  if (!data || data.length === 0) return;

  if (format === "csv") {
    const csvData = [
      Object.keys(data[0]),
      ...data.map((item) => Object.values(item)),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    downloadFile(blob, `${filename}.csv`);
  } else if (format === "pdf") {
    const doc = new jsPDF();
    doc.text(filename, 14, 10);
    autoTable(doc, {
      head: [Object.keys(data[0])],
      body: data.map((item) => Object.values(item)),
    });
    doc.save(`${filename}.pdf`);
  } else if (format === "excel") {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }
};

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
