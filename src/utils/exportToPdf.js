import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { EXPORT_COLUMNS, transformDataForExport } from "./exportEmployee";

export const exportToPDF = (data) => {
  const rows = transformDataForExport(data);

  const doc = new jsPDF();

  doc.text("Employee Report", 14, 10);

  autoTable(doc, {
    startY: 20,
    head: [EXPORT_COLUMNS.map((c) => c.label)],
    body: rows.map((row) =>
      EXPORT_COLUMNS.map((c) => row[c.key] || "")
    ),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [23, 105, 170] }, // optional: table header color
  });

  doc.save("employees.pdf");
};
