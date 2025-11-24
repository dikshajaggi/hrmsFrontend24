import React, { useState, useMemo } from "react";
import {
  Plus,
  Upload,
  Search,
  Building2,
  Layers,
  MapPin,
  Badge,
} from "lucide-react";

import ImportDataModal from "@/components/common/ImportDataModal";

import {
  getBranches,
  getDepartments,
  getDesignations,
  getProjectSites,
} from "@/apis";
import { useQuery } from "react-query";
import { actionsColumn } from "@/components/OrgActionsColumn";
import OrgTable from "@/components/OrgTable";

const OrgSetup = () => {
  const [activeTab, setActiveTab] = useState("branches");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // API CALLS
  const { data: branches = [] } = useQuery(["branches"], getBranches, {
    refetchOnWindowFocus: false,
  });

  const { data: departments = [] } = useQuery(["departments"], getDepartments, {
    refetchOnWindowFocus: false,
  });

  const { data: sites = [] } = useQuery(["projectSites"], getProjectSites, {
    refetchOnWindowFocus: false,
  });

  const { data: designations = [] } = useQuery(
    ["designation"],
    getDesignations,
    { refetchOnWindowFocus: false }
  );

  console.log(branches, "----", departments, "----", sites, "-----", designations, "data check org" )

  // TABS
  const tabs = [
    { id: "branches", label: "Branches", icon: <Building2 size={16} /> },
    { id: "departments", label: "Departments", icon: <Layers size={16} /> },
    { id: "project-sites", label: "Project Sites", icon: <MapPin size={16} /> },
    { id: "designations", label: "Designations", icon: <Badge size={16} /> },
  ];

  // COLUMNS — memoized to avoid rerender
  const branchColumns = useMemo(
    () => [
      { id: "sno", header: "S.No", cell: ({ row }) => row.index + 1 },
      { accessorKey: "branch_name", header: "Branch Name" },
      actionsColumn(
        (item) => console.log("Edit Branch", item),
        (item) => console.log("Delete Branch", item)
      ),
    ],
    []
  );

  const departmentColumns = useMemo(
    () => [
      { id: "sno", header: "S.No", cell: ({ row }) => row.index + 1 },
      { accessorKey: "department_name", header: "Department Name" },
      actionsColumn(
        (item) => console.log("Edit Dept", item),
        (item) => console.log("Delete Dept", item)
      ),
    ],
    []
  );

  const projectSiteColumns = useMemo(
    () => [
      { id: "sno", header: "S.No", cell: ({ row }) => row.index + 1 },
      { accessorKey: "site_name", header: "Site Name" },
      actionsColumn(
        (item) => console.log("Edit Site", item),
        (item) => console.log("Delete Site", item)
      ),
    ],
    []
  );

  const designationColumns = useMemo(
    () => [
      { id: "sno", header: "S.No", cell: ({ row }) => row.index + 1 },
      { accessorKey: "designation_name", header: "Designation" },
      actionsColumn(
        (item) => console.log("Edit Designation", item),
        (item) => console.log("Delete Designation", item)
      ),
    ],
    []
  );

  // DETERMINE CURRENT TAB DATA + COLUMNS
  const getCurrentData = () => {
    switch (activeTab) {
      case "branches":
        return { data: branches, columns: branchColumns };
      case "departments":
        return { data: departments, columns: departmentColumns };
      case "project-sites":
        return { data: sites, columns: projectSiteColumns };
      case "designations":
        return { data: designations, columns: designationColumns };
      default:
        return { data: [], columns: [] };
    }
  };

  const { data, columns } = getCurrentData();

  // FILTER DATA BASED ON SEARCH
  const filteredData = data.filter((item) => {
    const nameKey =
      item.branch_name ||
      item.department_name ||
      item.site_name ||
      item.designation_name ||
      "";

    return nameKey.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Organization Setup
        </h2>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-gray-200 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* SEARCH */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace("-", " ")}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 bg-gray-50 hover:bg-white rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition-all shadow-sm focus:outline-none"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition cursor-not-allowed">
            <Plus size={16} />
            Add{" "}
            {activeTab === "project-sites"
              ? "Site"
              : activeTab === "branches"
              ? "Branch"
              : activeTab.slice(0, -1)}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <Upload size={16} />
            Upload Data
          </button>
        </div>
      </div>

      {/* CSV UPLOAD MODAL */}
      {showModal && <ImportDataModal setShowModal={setShowModal} />}

      {/* TABLE */}
      <OrgTable data={filteredData} columns={columns} />
    </div>
  );
};

export default OrgSetup;
