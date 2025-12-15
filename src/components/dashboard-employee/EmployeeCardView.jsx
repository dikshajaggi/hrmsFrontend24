import React, { useState, useMemo } from "react";
import {
  MapPin,
  MoreHorizontal,
  ArrowRight,
  X,
  Building2,
  User,
} from "lucide-react";
import * as ReactWindow from "react-window";
import SearchExportData from "../SearchExportData";
import ExportDataModal from "../common/ExportDataModal";
import { Drawer } from "../common/Drawer";
import { WarningModal } from "../common/WarningModal";
// import { useNavigate } from "react-router-dom";


const Grid = ReactWindow.FixedSizeGrid;
// constants
const CARD_WIDTH = 320;
const CARD_HEIGHT = 240;
const GRID_GAP = 20;


const EmployeeCard = ({ emp, onSelect, style, setShowEdit, setOpen }) => {
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
        {emp.image ? <img
          src={emp.image || "https://via.placeholder.com/80"}
          alt={emp.name}
          className="w-14 h-14 rounded-full object-cover border border-gray-200"
        /> : <User size={30} />}
      </div>

      {/* Name + Designation */}
      <div className="text-center mt-3">
        <h4 className="text-[15px] font-semibold text-gray-800 flex items-center justify-center gap-1 flex-wrap">
          {emp.name}
          {emp.designation && (
            <span className="text-sm font-normal text-gray-500">
              • {emp.designation.designation_name}
            </span>
          )}
        </h4>
      </div>

      {/* Branch + Site */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <div className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-full text-gray-600">
          <Building2 size={12} />
          {emp.branch.branch_name}
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-full text-gray-600">
          <MapPin size={12} />
          {emp.projectSite.site_name}
        </div>
      </div>

      {/* View Details */}
      <div className="mt-5 flex justify-center items-center w-full">
        <button  onClick={() => setShowEdit(true)} className="flex items-center font-medium text-blue-600 px-3 py-2 rounded-lg text-sm transition cursor-pointer">
          Edit
        </button>
         <button
          onClick={() => onSelect(emp)}
          className="text-sm text-blue-600 hover:text-blue-700 px-3 font-medium flex items-center cursor-pointer"
        >
          View Details
          {/* <ArrowRight size={14} /> */}
        </button>
         <button  onClick={() => setOpen(true)} className="flex items-center font-medium text-red-600 px-3 py-2 rounded-lg text-sm transition cursor-pointer">
          Delete
        </button>
       
      </div>
    </div>
  );
};


const EmployeeCardView = ({ employees, filters, setFilters }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = () => {

  }

  // const navigate = useNavigate()

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
        setShowEdit = {setShowEdit} 
        setOpen = {setOpen}
      />
    );
  };

  return (
    <div className="relative w-full">
      <SearchExportData globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} setShowExport={setShowExport} />
      
      {showExport && (
        <ExportDataModal 
            isOpen={showExport}
            onClose={() => setShowExport(false)}
            modal="employee"
            data={employees}                
            filters={filters}    
            setFilters={setFilters}          
        />
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

       <WarningModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDelete}
          employeeName="Rahul Sharma"
          loading={loading}
        />
        <Drawer
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          title="Edit Employee"
          subtitle="Quick updates"
        ></Drawer>

      {/* Slide-in Details Panel */}

      <Drawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee?.name}
        subtitle={selectedEmployee?.designation?.designation_name}
        headerActions={
          <button className="text-sm text-blue-600 font-medium">
            Full Profile →
          </button>
        }
      >
        {/* Employee summary / tabs */}
      </Drawer>
    </div>
  );
};

export default EmployeeCardView;
