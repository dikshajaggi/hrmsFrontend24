import React, { useState } from "react";
import EmployeeTableView from "./EmployeeTableView";
import EmployeeCardView from "./EmployeeCardView";
import { LayoutGrid, LayoutList } from "lucide-react";
import ModernSelect from "./ModernSelect";

const EmployeeList = () => {
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({
    branch: "",
    department: "",
    projectSite: "",
    gender: "",
  });

  const branches = ["All", "Delhi", "Mumbai", "Bangalore"];
  const departments = ["All", "Accounts", "HR", "Engineering", "Sales"];
  const sites = ["All", "Dwarka", "Noida", "Andheri", "Electronic City"];

  const employees = [
    {
      id: 1,
      name: "Aditi Sharma",
      gender: "Female",
      branch: "Delhi",
      department: "HR",
      designation: "HR Executive",
      projectSite: "Dwarka",
    },
    {
      id: 2,
      name: "Rohan Verma",
      gender: "Male",
      branch: "Mumbai",
      department: "Accounts",
      designation: "Senior Accountant",
      projectSite: "Andheri",
    },
    {
      id: 3,
      name: "Kavita Das",
      gender: "Female",
      branch: "Bangalore",
      department: "IT",
      designation: "Software Developer",
      projectSite: "Electronic City",
    },
    {
      id: 4,
      name: "Vikas Mehta",
      gender: "Male",
      branch: "Delhi",
      department: "Sales",
      designation: "Sales Manager",
      projectSite: "Noida",
    },
    {
      id: 5,
      name: "Pooja Nair",
      gender: "Female",
      branch: "Mumbai",
      department: "HR",
      designation: "Recruiter",
      projectSite: "Andheri",
    },
    {
      id: 6,
      name: "Arjun Patel",
      gender: "Male",
      branch: "Bangalore",
      department: "Engineering",
      designation: "Frontend Developer",
      projectSite: "Whitefield",
    },
    {
      id: 7,
      name: "Sneha Iyer",
      gender: "Female",
      branch: "Delhi",
      department: "Marketing",
      designation: "Content Strategist",
      projectSite: "Dwarka",
    },
    {
      id: 8,
      name: "Ritesh Gupta",
      gender: "Male",
      branch: "Mumbai",
      department: "Engineering",
      designation: "Backend Developer",
      projectSite: "Andheri",
    },
    {
      id: 9,
      name: "Priya Menon",
      gender: "Female",
      branch: "Bangalore",
      department: "Accounts",
      designation: "Finance Associate",
      projectSite: "Electronic City",
    },
    {
      id: 10,
      name: "Karan Singh",
      gender: "Male",
      branch: "Delhi",
      department: "IT",
      designation: "System Administrator",
      projectSite: "Noida",
    },
    {
      id: 11,
      name: "Neha Kapoor",
      gender: "Female",
      branch: "Mumbai",
      department: "Sales",
      designation: "Business Development Executive",
      projectSite: "Andheri",
    },
    {
      id: 12,
      name: "Ravi Deshmukh",
      gender: "Male",
      branch: "Bangalore",
      department: "Engineering",
      designation: "DevOps Engineer",
      projectSite: "Whitefield",
    },
  ];


  const filteredEmployees = employees.filter((emp) => {
    return (
      (filters.branch === "" || filters.branch === "All" || emp.branch === filters.branch) &&
      (filters.department === "" || filters.department === "All" || emp.department === filters.department) &&
      (filters.projectSite === "" || filters.projectSite === "All" || emp.projectSite === filters.projectSite) &&
      (filters.gender === "" || filters.gender === "All" || emp.gender === filters.gender)
    );
  });

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mt-8 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Employee Directory</h3>

       <div className="flex items-center gap-2.5">
          <span className="text-sm md:text-base text-gray-500 font-medium pl-2">View as:</span>
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                view === "table"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <LayoutList size={16} />
              Table
            </button>
            <button
              onClick={() => setView("card")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                view === "card"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              <LayoutGrid size={16} />
              Cards
            </button>
          </div>
       </div>
      </div>

      {/* Filters */}
      <div className="border border-gray-100 bg-white rounded-xl p-3 mb-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Branch */}
          <div className="relative group">
            <ModernSelect
              label="Branch"
              options={branches}
              value={filters.branch}
              onChange={(val) => setFilters({ ...filters, branch: val })}
            />
          </div>

          {/* Department */}
          <div className="relative group">
             <ModernSelect
              label="Department"
              options={departments}
              value={filters.department}
              onChange={(val) => setFilters({ ...filters, department: val })}
            />
          </div>

          {/* Project Site */}
          <div className="relative group">
             <ModernSelect
              label="Project Site"
              options={sites}
              value={filters.projectSite}
              onChange={(val) => setFilters({ ...filters, projectSite: val })}
            />
          </div>

          {/* Gender */}
          <div className="relative group">
             <ModernSelect
              label="Gender"
              options={["All", "Male", "Female"]}
              value={filters.gender}
              onChange={(val) => setFilters({ ...filters, gender: val })}
            />
          </div>
        </div>
      </div>

      {/* Employee List Section */}
      {filteredEmployees.length > 0 ? (
        view === "table" ? (
          <EmployeeTableView employees={filteredEmployees} />
        ) : (
          <EmployeeCardView employees={filteredEmployees} />
        )
      ) : (
        <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
          No employees found with selected filters.
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
