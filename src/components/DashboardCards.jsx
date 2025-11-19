import React, { useEffect, useState } from "react";
import {BranchSelect, ProjectSiteSelect } from "@/components/BranchProjectSiteSelect";


const DashboardCards = () => {
  const DEFAULT_CARDS = [
  { id: "T", label: "Total", color: "text-blue-500" , count: 0 },
  { id: "P", label: "Present", color: "text-green-500", count: 0 },
  { id: "L", label: "Casual Leave", color: "text-yellow-500" , count: 0 },
  { id: "SL", label: "Sick Leave", color: "text-red-500", count: 0 },
  { id: "W", label: "Work From Home", count: 2, color: "text-purple-500" },
];

    const [selectedBranch, setSelectedBranch] = useState("Head Office");
    const [selectedSite, setSelectedSite] = useState("Head Site 1")
    const [displayData, setDisplayData] = useState([])

    const cardsToShow = DEFAULT_CARDS.map((card) => {
      const found = displayData.find((d) => d.id === card.id);
      return found ? { ...card, count: found.count } : card;
    });
    
    useEffect(() => {
      // setDisplayData(displayedData)
      console.log(selectedBranch, "selected branch")
    }, [selectedBranch])
    
    return (
      <section className="w-full">
        {/* Branch Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-gray-200 capitalize">
            {selectedBranch.toLowerCase() === "all" ? `Today’s Attendance – All Branches` : `Today’s Attendance – ${selectedBranch}`}
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <div><BranchSelect selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} /></div>
            <div><ProjectSiteSelect selectedSite={selectedSite} setSelectedSite={setSelectedSite} /></div>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cardsToShow.map((item) => (
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
