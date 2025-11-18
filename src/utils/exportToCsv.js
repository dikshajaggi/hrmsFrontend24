import { EXPORT_COLUMNS, transformDataForExport } from "./exportEmployee";

export const exportToCSV = (data) => {
  const rows = transformDataForExport(data);

  const headers = EXPORT_COLUMNS.map((c) => c.label).join(",");

  const csvRows = rows
    .map((row) =>
      EXPORT_COLUMNS.map((c) => `"${row[c.key] || ""}"`).join(",")
    )
    .join("\n");

  const csv = `${headers}\n${csvRows}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "employees.csv";
  link.click();
};
