import React, { useState } from "react";
import {
  Plus,
  Upload,
  Search,
  Building2,
  Layers,
  MapPin,
  Badge,
} from "lucide-react";

const OrgSetup = () => {
    
    const [activeTab, setActiveTab] = useState("branches");

    const tabs = [
        { id: "branches", label: "Branches", icon: <Building2 size={16} /> },
        { id: "departments", label: "Departments", icon: <Layers size={16} /> },
        { id: "project-sites", label: "Project Sites", icon: <MapPin size={16} /> },
        { id: "designations", label: "Designations", icon: <Badge size={16} /> },
    ];

  return (
    <div className='px-6 xl:px-8 2xl:px-10 py-6 w-full'>
        {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Organization Setup</h2>
      </div>

      {/* Tabs */}
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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace("-", " ")}...`}
            className="w-full border border-gray-200 bg-gray-50 hover:bg-white rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 transition-all shadow-sm focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition cursor-pointer">
            <Plus size={16} />
            Add {activeTab === "project-sites" ? "Site" : activeTab === "branches" ? "Branch" : activeTab.slice(0, -1)}
          </button>

          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer">
            <Upload size={16} />
            Upload Data
          </button>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sm:p-6 text-center text-gray-500 text-sm">
        <p>
          Showing <span className="font-medium capitalize">{activeTab}</span> data
          will appear here.
        </p>
        <p className="mt-1 text-gray-400 text-xs">
          You can add, import, or edit entries from the top bar.
        </p>
      </div>
    </div>
  )
}

export default OrgSetup
