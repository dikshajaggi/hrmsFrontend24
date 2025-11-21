import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { BranchSelect, ProjectSiteSelect } from "./BranchProjectSiteSelect";
import { useQuery } from "react-query";
import { getHolidays } from "@/apis";

const DashboardCalendar = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [month, setMonth] = useState(new Date());

  // Extract year only once
  const year = month.getFullYear();

  // Selected IDs
  const branch_id = selectedBranch?.id ?? null;
  const site_id = selectedSite?.id ?? null;

  // CALL ONLY YEAR API
  const { data: allHolidays = [], isLoading } = useQuery(
    [
      "holidays",
      {
        branch_id,
        site_id,
        year,
      },
    ],
    getHolidays, // Now this API should IGNORE month and only accept year
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 60 * 12, // 12 hrs cache
    }
  );

  // FILTER HOLIDAYS FOR MONTH LOCALLY
  const holidays = useMemo(() => {
    return allHolidays.filter((h) => {
      const d = parseISO(h.holiday_date);
      return (
        d.getFullYear() === year && d.getMonth() === month.getMonth()
      );
    });
  }, [allHolidays, month, year]);

  // Dates for DayPicker highlight
  const holidayDates = useMemo(
    () => holidays.map((h) => parseISO(h.holiday_date)),
    [holidays]
  );

  const modifiers = useMemo(
    () => ({
      holidays: holidayDates,
      weekends: { daysOfWeek: [6] }, // Saturday
    }),
    [holidayDates]
  );

  const modifiersStyles = {
    holidays: {
      backgroundColor: "#16a34a",
      color: "white",
      borderRadius: "50%",
      margin: "2px",
    },
    weekends: {
      backgroundColor: "#f59e0b",
      color: "white",
      borderRadius: "50%",
      margin: "2px",
    },
    sundays: { color: "red" },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full h-full flex flex-col md:flex-row md:items-start md:justify-between">

      {/* Calendar */}
      <div className="flex justify-center md:justify-start w-full md:w-2/3">
        <DayPicker
          showOutsideDays
          month={month}
          onMonthChange={setMonth}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="text-center mx-auto"
        />
      </div>

      {/* Right Side Panel */}
      <div className="flex flex-wrap flex-col justify-start w-full md:w-1/3 gap-3 mt-2 text-sm">

        {/* Dropdowns */}
        <div className="flex flex-col flex-wrap gap-4">
          <BranchSelect
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
          />
          <ProjectSiteSelect
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
          />
        </div>

        <Legend color="bg-green-600" label="Holiday" />
        <Legend color="bg-amber-500" label="Saturday Off" />

        {/* Holidays List */}
        <div className="mt-3">
          <h4 className="font-semibold text-sm">Holidays this Month</h4>

          <ul className="text-xs space-y-1 max-h-24 mt-2 overflow-y-auto pr-1">
            {isLoading ? (
              <li className="text-gray-500 italic font-semibold">Loading...</li>
            ) : holidays.length === 0 ? (
              <li className="text-gray-500 italic font-semibold">No Holidays</li>
            ) : (
              holidays.map((e, i) => (
                <li key={i}>
                  <span className="font-semibold">
                    {format(parseISO(e.holiday_date), "d MMMM")}
                  </span>{" "}
                  – {e.description}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-[14px] h-[14px] rounded-full ${color}`}></span>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export default DashboardCalendar;