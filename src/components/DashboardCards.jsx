import React, { useEffect, useState } from "react";
import { attendanceData } from "../assets/sampleData";
import BranchSelect from "@/components/BranchSelect";
import TodoCard from "@/components/TodoCard";


const DashboardCards = () => {
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [displayData, setDisplayData] = useState([])

    const getAllBranchesData = (data) => {
      const totals = {};

      data.branches.forEach(branch => {
          branch.attendanceStats.forEach(stat => {
          totals[stat.id] = (totals[stat.id] || 0) + stat.count;
          });
      });

      return Object.keys(totals).map((key) => {
          const sample = data.branches[0].attendanceStats.find(stat => stat.id === key);
          return {
          id: key,
          label: sample.label,
          count: totals[key],
          color: sample.color,
          };
      });
    };

    useEffect(() => {
      const displayedData = selectedBranch === "all"
        ? getAllBranchesData(attendanceData)
        : attendanceData.branches.find(b => b.branchName.toLowerCase() === selectedBranch.toLowerCase())?.attendanceStats || [];
        console.log(displayedData, "displayedData", attendanceData, selectedBranch)
      setDisplayData(displayedData)
    }, [selectedBranch])
    
    console.log(selectedBranch, "selectedBranch")
    return (
      <section className="w-full">
        {/* Branch Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
            {selectedBranch === "all" ? `Today’s Attendance – ${selectedBranch} Branches` : `Today’s Attendance – ${selectedBranch} Branch`}
          </h2>
          <BranchSelect selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}/>
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {displayData.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-md p-4 flex flex-col justify-center items-center ${item.color} hover:scale-[1.03] transition-transform`}
            >
              <h3 className="text-sm text-gray-600 dark:text-gray-400">{item.label}</h3>
              <p className={`text-2xl font-semibold ${item.color}`}>{item.count}</p>
            </div>
          ))}
        </div>
      </section>
  );
};

export default DashboardCards;
