import { exportToCSV } from "@/utils/exportToCsv";
import { exportToPDF } from "@/utils/exportToPdf";

export const useExport = (data) => {
  console.log(data, "data export check")
  const exportData = (format) => {
    if (!data?.length) return;

    if (format === "CSV") exportToCSV(data);
    if (format === "PDF") exportToPDF(data);
  };

  return { exportData };
};
