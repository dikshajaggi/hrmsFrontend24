import React, { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";
import EmployeeView from "./EmployeeView";
import EmployeeEdit from "./EmployeeEdit";
import { deleteEmployees } from "@/apis";
// import { useNavigate } from "react-router-dom";


const Grid = ReactWindow.FixedSizeGrid;
// constants
const CARD_WIDTH = 320;
const CARD_HEIGHT = 240;
const GRID_GAP = 20;


const EmployeeCard = ({ emp, style, setActiveEmployee, setDrawerMode, setOpen, setOpenDrawer }) => {
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
      {/* <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
        <MoreHorizontal size={16} />
      </button> */}

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
          <Link to= {`/dashboard/employees/${emp?.job_details.employee_id}`}>
              {emp.name}
            </Link>
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
        <button 
        onClick={() => {
          setActiveEmployee(emp);
          setOpenDrawer(true)
          setDrawerMode("edit");
        }}
        className="flex items-center font-medium text-blue-600 px-3 py-2 rounded-lg text-sm transition cursor-pointer">
          Edit
        </button>
         <button
          onClick={() => {
            setActiveEmployee(emp);
            setOpenDrawer(true)
            setDrawerMode("view");
          }}
          className="text-sm text-blue-600 hover:text-blue-700 px-3 font-medium flex items-center cursor-pointer"
        >
          View Details
          {/* <ArrowRight size={14} /> */}
        </button>
         <button  onClick={() => {
          setActiveEmployee(emp);
          setOpen(true)
         }} className="flex items-center font-medium text-red-600 px-3 py-2 rounded-lg text-sm transition cursor-pointer">
          Delete
        </button>
       
      </div>
    </div>
  );
};


const EmployeeCardView = ({ employees, filters, setFilters }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(null);
  const [drawerMode, setDrawerMode] = useState("view"); 
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDelete = async () => {
    try {
      const res = await deleteEmployees(activeEmployee.employee_id)
      setActiveEmployee(null)
      console.log(res, "response")
    } catch (error) {
      console.log(error)
    }
  }

  // const navigate = useNavigate()
  const getColumnCount = () => {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [columnCount, setColumnCount] = useState(getColumnCount());

  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        setActiveEmployee={setActiveEmployee}
        setOpenDrawer = {setOpenDrawer}
        setDrawerMode = {setDrawerMode} 
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

        {activeEmployee && <WarningModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={handleDelete}
          employeeName={activeEmployee.name}
          loading={loading}
        />}
       <Drawer
          isOpen={openDrawer}
          onClose={() => {
            setOpenDrawer(false)
            setActiveEmployee(null);
            setDrawerMode("view");
          }}
          title={drawerMode === "edit" ? "Edit Employee Profile" : "Employee Overview"}
          subtitle={
            drawerMode === "edit"
              ? "Update role, organization, and personal details"
              : "Profile summary and key information"
          }
          headerActions={
            drawerMode === "view" && (
              <button
                onClick={() => setDrawerMode("edit")}
                className="text-sm text-blue-600 font-medium mr-6 cursor-pointer"
              >
                Edit
              </button>
            )
          }
        >
          {drawerMode === "view" ? (
            <EmployeeView employee={activeEmployee} />
          ) : (
            <EmployeeEdit
              employee={activeEmployee}
              onCancel={() => setDrawerMode("view")}
              onSave={() => {
                // call update API
                setDrawerMode("view");
              }}
            />
          )}
        </Drawer>

    </div>
  );
};

export default EmployeeCardView;
