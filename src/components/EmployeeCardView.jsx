import React, { useState, useMemo } from "react";
import {
  Mail,
  MapPin,
  MoreHorizontal,
  ArrowRight,
  X,
  Building2,
} from "lucide-react";
import * as ReactWindow from "react-window";
import SearchExportData from "./SearchExportData";
import ExportDataModal from "./common/ExportDataModal";
console.log("ReactWindow exports:", ReactWindow);


const Grid = ReactWindow.FixedSizeGrid;
// constants
const CARD_WIDTH = 320;
const CARD_HEIGHT = 240;
const GRID_GAP = 20;


const EmployeeCard = ({ emp, onSelect, style }) => {
  return (
    <div
      style={{
        ...style,
        left: style.left + GRID_GAP,
        top: style.top + GRID_GAP,
        width: style.width - GRID_GAP,
        height: style.height - GRID_GAP,
      }}
      className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 relative group cursor-pointer"
    >
      {/* Status */}
      <span
        className={`absolute top-3 left-3 px-2 py-0.5 text-[11px] rounded-full font-medium ${
          emp.status === "Inactive"
            ? "bg-gray-200 text-gray-600"
            : "bg-green-100 text-green-700"
        }`}
      >
        {emp.status || "Active"}
      </span>

      {/* Menu Icon */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
        <MoreHorizontal size={16} />
      </button>

      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={emp.image || "https://via.placeholder.com/80"}
          alt={emp.name}
          className="w-14 h-14 rounded-full object-cover border border-gray-200"
        />
      </div>

      {/* Name + Designation */}
      <div className="text-center mt-3">
        <h4 className="text-[15px] font-semibold text-gray-800 flex items-center justify-center gap-1 flex-wrap">
          {emp.name}
          {emp.designation && (
            <span className="text-sm font-normal text-gray-500">
              • {emp.designation}
            </span>
          )}
        </h4>
      </div>

      {/* Branch + Site */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <div className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-full text-gray-600">
          <Building2 size={12} />
          {emp.branch}
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-full text-gray-600">
          <MapPin size={12} />
          {emp.projectSite}
        </div>
      </div>

      {/* View Details */}
      <div className="mt-5 flex justify-center">
        <button
          onClick={() => onSelect(emp)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
        >
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};


const EmployeeCardView = ({ employees }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const columnCount = useMemo(() => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }, []);

  const rowCount = Math.ceil(employees.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const emp = employees[index];
    if (!emp) return null;

    return (
      <EmployeeCard
        emp={emp}
        style={style}
        onSelect={setSelectedEmployee}
      />
    );
  };

  return (
    <div className="relative w-full">
      <SearchExportData globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setShowExport={setShowExport} />
      
      {showExport && (
        <ExportDataModal isOpen={showExport} onClose={() => setShowExport(false)} />
      )}

      {/* Virtualized Grid */}
      <Grid
        columnCount={columnCount}
        columnWidth={CARD_WIDTH}
        height={window.innerHeight - 200}
        rowCount={rowCount}
        rowHeight={CARD_HEIGHT}
        width={Math.min(
          window.innerWidth - 60,
          CARD_WIDTH * columnCount + GRID_GAP * (columnCount - 1)
        )}
        className="m-auto"
      >
        {Cell}
      </Grid>

      {/* Slide-in Details Panel */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-white w-full sm:w-[400px] h-full shadow-xl border-l border-gray-100 p-6 relative animate-slideIn">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mt-6">
              <img
                src={
                  selectedEmployee.image || "https://via.placeholder.com/80"
                }
                alt={selectedEmployee.name}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-800">
                {selectedEmployee.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedEmployee.department}
              </p>
              <span
                className={`mt-2 px-3 py-0.5 text-xs rounded-full font-medium ${
                  selectedEmployee.status === "Inactive"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selectedEmployee.status || "Active"}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Building2 size={16} className="text-gray-400" />
                <span>{selectedEmployee.branch}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span>{selectedEmployee.projectSite}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <a
                  href={`mailto:${selectedEmployee.email}`}
                  className="text-blue-600 hover:underline truncate"
                >
                  {selectedEmployee.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[13px]">Joined:</span>
                <span className="font-medium text-gray-700">
                  {selectedEmployee.joined || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[13px]">Gender:</span>
                <span className="font-medium text-gray-700">
                  {selectedEmployee.gender}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCardView;
