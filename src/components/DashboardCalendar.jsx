import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { allBranchesCalendarData } from "@/assets/sampleData";
import BranchSelect from "./BranchSelect";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


const DashboardCalendar = () => {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [modifiers, setModifiers] = useState([])
  const [month, setMonth] = useState(new Date())
  const [holidays, setHolidays] = useState([])
  const calendarData = allBranchesCalendarData.branches

  const modifiersStyles = {
    holidays: { backgroundColor: "#16a34a", color: "white", borderRadius: "50%", margin: "2px"}, // green
    weekends: { backgroundColor: "#f59e0b", color: "white", borderRadius: "50%", margin: "2px"}, // orange
    sundays: { color: "red" }
  };

  useEffect(() => {
    // Combine all branch data if "All" is selected
    const events =
      selectedBranch === "all"
        ? calendarData.flatMap(branch => branch.events)
        : calendarData.find(b => b.branch_name.toLowerCase() === selectedBranch.toLowerCase())?.events || [];
    const uniqueEvents = Array.from(
      new Map(events.map(e => [e.holiday_id || `${e.date}-${e.description}`, e])).values()
    );
    console.log(events, "events", uniqueEvents)
    const holidaysList =  uniqueEvents.filter(e => e.type === "holiday").filter(e => {
    const date = parseISO(e.date);
      return (
        date.getMonth() === month.getMonth() &&
        date.getFullYear() === month.getFullYear()
      );
    });
    setHolidays(holidaysList)
        // Group dates by event type
    const modifiers = {
      holidays: events.filter(e => e.type === "holiday").map(e => parseISO(e.date)),
      weekends: events.filter(e => e.type === "saturday_off").map(e => parseISO(e.date)),
      sundays: { dayOfWeek: [0] } // 0 = Sunday
    };
    setModifiers(modifiers)
  }, [selectedBranch, month])

  console.log(modifiers, "modifiers")

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full h-full flex flex-col md:flex-row md:items-start md:justify-between">
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

      <div className="flex flex-wrap flex-col justify-start w-full md:w-1/3 gap-3 mt-2 text-sm">
        <BranchSelect selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />
        <Legend color="bg-green-600" label="Holiday" />
        <Legend color="bg-amber-500" label="Saturday Off" />
        <div className="mt-3">
          <h4 className="font-semibold text-sm">Holidays this Month</h4>
          <ul className="text-xs space-y-1 max-h-24 mt-2 overflow-y-auto pr-1">
            {holidays.length === 0 ? (
              <li className="text-gray-500 italic font-semibold">No Holidays</li>
            ) : (
              holidays.map((e, i) => (
                <li key={i}>
                <span className="font-semibold">{format(parseISO(e.date), "d MMMM")}</span> – {e.description}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-[14px] h-[14px] rounded-full ${color}`}></span>
      <span className="font-semibold">{label}</span>
    </div>
  );
}


export default DashboardCalendar