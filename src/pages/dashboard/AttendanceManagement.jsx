import AttendanceTable from '@/components/AttendanceTable'
import BranchSelect from '@/components/BranchSelect'
import CommonCalendar from '@/components/CommonCalendar'
import DashboardCards from '@/components/DashboardCards'
import React, { useState } from 'react'

const AttendanceManagement = () => {
  const [selectedBranch, setSelectedBranch] = useState("all");
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
      <DashboardCards />
        <div className="flex flex-col md:flex-row items-center justify-between mt-10">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
            {selectedBranch === "all" ? `This month’s attendance – All Branches ` : `This month’s attendance – ${selectedBranch}`}
          </h2>
          <BranchSelect selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}/>
        </div>
      <div className="grid grid-cols-1 overflow-auto mt-2">
        <AttendanceTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  )
}

export default AttendanceManagement
