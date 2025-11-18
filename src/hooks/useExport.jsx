import { exportToCSV } from "@/utils/exportToCsv";
import { exportToPDF } from "@/utils/exportToPdf";

export const useExport = (data) => {
  const exportData = (format) => {
    if (!data?.length) return;

    if (format === "CSV") exportToCSV(data);
    if (format === "PDF") exportToPDF(data);
  };

  return { exportData };
};
