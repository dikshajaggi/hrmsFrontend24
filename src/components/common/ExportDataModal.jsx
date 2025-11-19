import { useExport } from "@/hooks/useExport";
import { X } from "lucide-react";
import React, {useMemo } from "react";
import ModernSelect from "./ModernSelect";
import ExportModuleDropdowns from "./ExportModuleDropdowns";

const ExportDataModal = ({ isOpen, onClose, modal, data, filters, setFilters, attendanceData}) => {
  const dataToBeExported = modal === "attendance" ? attendanceData : data
  const { exportData } = useExport(dataToBeExported);

  const branches = useMemo(() => {
    const items = data
      .map(emp => emp.branch?.branch_name)
      .filter(Boolean); 
    
    return ["All", ...new Set(items)];
  }, [data]);

  const departments = useMemo(() => {
    const items = data
      .map(emp => emp.department?.department_name)
      .filter(Boolean); 
    
    return ["All", ...new Set(items)];
  }, [data]);

  const sites = useMemo(() => {
    const items = data
      .map(emp => emp.projectSite?.site_name)
      .filter(Boolean);

    return ["All", ...new Set(items)];
  }, [data]);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // dynamic date ranges
  const today = new Date();

  const thisMonth = useMemo(() => {
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return `${formatDate(start)} – ${formatDate(end)}`;
  }, []);

  const lastMonth = useMemo(() => {
    const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 0);
    return `${formatDate(start)} – ${formatDate(end)}`;
  }, [today]);

  const handleExport = () => {
    console.log("Exporting with filters:", filters);
    exportData(filters.format)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 border border-gray-200 shadow-xl rounded-2xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh] transition-all">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
           Export Data <span onClick={() =>  setFilters({
              branch: "",
              department: "",
              projectSite: "",
              gender: "",
            })}>Reset</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Choose filters and export format to generate your report.
          </p>
        </div>

        {/* filters */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* branch */}
            <ExportModuleDropdowns label="Branch" onChange={(val) =>
                  setFilters({ ...filters, branch: val })
                } value={filters.branch} options={branches} />

            {/* dept */}
              <ExportModuleDropdowns label="Department" onChange={(val) =>
                  setFilters({ ...filters, department: val })
                } value={filters.department} options={departments} />

            {/* site */}
             <ExportModuleDropdowns label="Project Site" onChange={(val) =>
                  setFilters({ ...filters, projectSite: val })
                } value={filters.projectSite} options={sites} />
          </div>
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        {/* format */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Export Format
          </h3>
          <div className="flex gap-3">
            {["CSV", "PDF"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFilters({ ...filters, format: fmt })}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                  filters.format === fmt
                    ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 my-4"></div>

        {/* time period */}
        {modal !== "employee" && <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Time Period
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "today", label: "Today", sub: formatDate(today) },
              { id: "thisMonth", label: "This Month", sub: thisMonth },
              { id: "lastmonth", label: "Last Month", sub: lastMonth },
              { id: "custom", label: "Custom Range", sub: "Choose any date/range" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() =>
                  setFilters({ ...filters, dateRangeType: opt.id })
                }
                className={`border rounded-lg text-sm px-3 py-2 text-left transition flex flex-col items-start cursor-pointer ${
                  filters.dateRangeType === opt.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.sub && (
                  <span className="text-xs text-gray-500 mt-0.5">
                    {opt.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filters.dateRangeType === "custom" && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>}

        {/* footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 border border-gray-400 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDataModal;
