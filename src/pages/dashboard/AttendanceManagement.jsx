import AttendanceTable from '@/components/AttendanceTable'
import {BranchSelect, ProjectSiteSelect} from '@/components/BranchProjectSiteSelect'
import DashboardCards from '@/components/DashboardCards'
import React, { useState } from 'react'

const AttendanceManagement = () => {
  const [selectedBranch, setSelectedBranch] = useState("Head Office");
  const [selectedSite, setSelectedSite] = useState("Head Site 1")

  const [filters, setFilters] = useState({
      branch: "",
      department: "",
      projectSite: "",
      gender: "",
      format: "CSV",
      dateRangeType: "today",
      startDate: "",
      endDate: "",
  });
  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
      <h1 className="text-2xl font-semibold mb-10">Attendance & Leave Management</h1>
      <DashboardCards />
        <div className="flex flex-col md:flex-row items-center justify-between mt-20">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
            {selectedBranch === "all" ? `This month’s attendance – All Branches ` : `This month’s attendance – ${selectedBranch}`}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div><BranchSelect selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} /></div>
            <div><ProjectSiteSelect selectedSite={selectedSite} setSelectedSite={setSelectedSite} /></div>
          </div>
        </div>
      <div className="grid grid-cols-1 overflow-auto mt-2">
        <AttendanceTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  )
}

export default AttendanceManagement
