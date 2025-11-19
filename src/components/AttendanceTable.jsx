import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";
import { Import } from "lucide-react";
import ExportDataModal from "./common/ExportDataModal";
import { AttendanceCell, DesktopTable, MobileCards } from "./AttendanceTableUtils";
import { useQuery } from "react-query";
import { getEmployees } from "@/apis";


export default function AttendanceTable({
  filters,
  setFilters,
  initialMonth = new Date(),
  bankHolidays = [],
  saturdayOffs = [
    { date: "2025-11-08", week: 2 },
    { date: "2025-11-22", week: 4 },
  ],
}) {
  
  const { data: employees = [] } = useQuery(
    ["employees"],
    getEmployees,
    { refetchOnWindowFocus: false }
  );
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(initialMonth);
  const [showExport, setShowExport] = useState(false);
  const [openCell, setOpenCell] = useState(null); 


  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      }),
    [month]
  );

  const sundays = useMemo(
    () =>
      days
        .filter((d) => format(d, "EEE") === "Sun")
        .map((d) => format(d, "yyyy-MM-dd")),
    [days]
  );

  const holidays = useMemo(() => {
    return (bankHolidays || [])
      .map((d) => {
        if (!d) return null;
        if (typeof d === "string") return format(new Date(d), "yyyy-MM-dd");
        if (d.date) return format(new Date(d.date), "yyyy-MM-dd");
        return null;
      })
      .filter(Boolean);
  }, [bankHolidays]);

  const saturdays = useMemo(() => {
    return (saturdayOffs || [])
      .map((d) => {
        if (!d) return null;
        if (typeof d === "string") return format(new Date(d), "yyyy-MM-dd");
        if (d.date) return format(new Date(d.date), "yyyy-MM-dd");
        return null;
      })
      .filter(Boolean);
  }, [saturdayOffs]);

  const handleChange = (empId, dateStr, value) => {
    setAttendance((prev) => ({
      ...prev,
      [empId]: { ...(prev[empId] || {}), [dateStr]: value },
    }));
  };

  // const markAll = (status) => {
  //   setAttendance((prev) => {
  //     const next = { ...prev };
  //     employees.forEach((emp) => {
  //       next[emp.employee_id] = { ...(next[emp.employee_id] || {}) };
  //       days.forEach((d) => {
  //         const dateStr = format(d, "yyyy-MM-dd");
  //         const isSunday = sundays.includes(dateStr);
  //         const isHoliday = holidays.includes(dateStr) || isSunday;
  //         const isSaturday = saturdays.includes(dateStr);
  //         const disabled = isHoliday || isSaturday;
  //         if (!disabled) next[emp.employee_id][dateStr] = status;
  //       });
  //     });
  //     return next;
  //   });
  // };

  // Totals
  const totals = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      const counts = {
        P: 0,
        H: 0,
        S: 0,
        L: 0,
        L1: 0,
        L2: 0,
        SL: 0,
        SL1: 0,
        SL2: 0,
        W: 0,
        C: 0,
      };
      days.forEach((d) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const isSunday = sundays.includes(dateStr);
        const isHoliday = holidays.includes(dateStr) || isSunday;
        const isSaturday = saturdays.includes(dateStr);
        const auto = isHoliday ? "H" : isSaturday ? "S" : null;
        const value = auto || attendance?.[emp.employee_id]?.[dateStr] || "";
        if (value && counts[value] !== undefined) counts[value] += 1;
      });
      counts.totalL = counts.L + counts.L1 * 0.5 + counts.L2 * 0.5;
      counts.totalSL = counts.SL + counts.SL1 * 0.5 + counts.SL2 * 0.5;
      map[emp.employee_id] = counts;
    });
    return map;
  }, [employees, attendance, days, holidays, saturdays, sundays]);

  // Columns
  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const base = [
      columnHelper.display({
        id: "employee",
        header: "Employee",
        cell: ({ row }) => (
          <div className="w-[120px] md:w-[160px] font-medium sticky left-0 bg-white px-2 z-40 whitespace-nowrap">
            {row.original.name}
          </div>
        ),
      }),

      columnHelper.display({
        id: "department",
        header: "Dept",
        cell: ({ row }) => (
          <div className="w-[90px] md:w-[120px] font-medium sticky left-[120px] md:left-[160px] bg-white px-2 z-30 whitespace-nowrap">
            {row.original.department.department_name}
          </div>
        ),
      }),
    ];

    const dayCols = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const weekday = format(day, "EEE");
      const isSunday = sundays.includes(dateStr);
      const isSaturday = saturdays.includes(dateStr);

      return columnHelper.display({
        id: dateStr,
        header: () => (
          <div
            className={`flex flex-col text-[10px] md:text-xs font-semibold px-0.5 md:px-1 ${
              isSunday ? "bg-yellow-50" : isSaturday ? "bg-gray-50" : ""
            } whitespace-nowrap`}
          >
            <span>{format(day, "d")}</span>
            <span className="text-gray-500 text-[9px]">{weekday}</span>
          </div>
        ),
        cell: ({ row }) => {
          const emp = row.original;
          const isSundayLocal = sundays.includes(dateStr);
          const isHolidayLocal = holidays.includes(dateStr) || isSundayLocal;
          const isSaturdayLocal = saturdays.includes(dateStr);
          const auto = isHolidayLocal ? "H" : isSaturdayLocal ? "S" : null;
          const value = auto || attendance?.[emp.employee_id]?.[dateStr] || "";

          return (
            <div
              className={`p-1 ${
                isSundayLocal ? "bg-yellow-50" : isSaturdayLocal ? "bg-gray-50" : ""
              } whitespace-nowrap`}
            >
              <AttendanceCell
                value={value}
                disabled={isHolidayLocal || isSaturdayLocal}
                onChange={(v) => handleChange(emp.employee_id, dateStr, v)}
                isOpen={openCell?.empId === emp.employee_id && openCell?.dateStr === dateStr}
                onOpen={() => setOpenCell({ empId: emp.employee_id, dateStr })}
                onClose={() => setOpenCell(null)}
              />
            </div>
          );
        },
      });
    });

    const totalsCols = [
      columnHelper.display({
        id: "totalP",
        header: "Total P",
        cell: ({ row }) => (
          <div className="px-2 whitespace-nowrap">
            {(totals[row.original.employee_id] || {}).P || 0}
          </div>
        ),
      }),
      columnHelper.display({
        id: "totalL",
        header: "Total L",
        cell: ({ row }) => {
          const t = totals[row.original.employee_id] || {};
          return <div className="px-2 whitespace-nowrap">{t.totalL || 0}</div>;
        },
      }),
      columnHelper.display({
        id: "totalSL",
        header: "Total SL",
        cell: ({ row }) => {
          const t = totals[row.original.employee_id] || {};
          return <div className="px-2 whitespace-nowrap">{t.totalSL || 0}</div>;
        },
      }),
    ];

    return [...base, ...dayCols, ...totalsCols];
  }, [days, attendance, holidays, saturdays, sundays, totals]);

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

// =======================
//  EXPORT DATA OBJECT GENERATOR
// =======================
  const getExportAttendanceData = () => {
    // -------------------------------------------
    // 1. READ DATE RANGE TYPE FROM FILTERS
    // -------------------------------------------
    const type = filters.dateRangeType;
    let start, end;

    const today = new Date();

    switch (type) {
      case "today":
        start = new Date();
        end = new Date();
        break;

      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "lastmonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;

      case "custom":
        start = new Date(filters.startDate);
        end = new Date(filters.endDate);
        break;

      default:
        // fallback: current month
        start = startOfMonth(month);
        end = endOfMonth(month);
        break;
    }

    // -------------------------------------------
    // 2. GENERATE DAY LIST FOR EXPORT RANGE
    // -------------------------------------------
    const exportDays = eachDayOfInterval({ start, end });

    const exportObj = {
      dateRangeType: type,
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
      days: exportDays.map((d) => format(d, "yyyy-MM-dd")),
      employees: [],
    };

    // -------------------------------------------
    // 3. BUILD DATA FOR EACH EMPLOYEE
    // -------------------------------------------
    employees.forEach((emp) => {
      const empAttendance = {};

      // Recalculate totals for export range only
      const counts = {
        P: 0,
        H: 0,
        S: 0,
        L: 0,
        L1: 0,
        L2: 0,
        SL: 0,
        SL1: 0,
        SL2: 0,
        W: 0,
        C: 0,
      };

      exportDays.forEach((day) => {
        const dateStr = format(day, "yyyy-MM-dd");

        const isSunday = sundays.includes(dateStr);
        const isHoliday = holidays.includes(dateStr) || isSunday;
        const isSaturday = saturdays.includes(dateStr);

        const auto = isHoliday ? "H" : isSaturday ? "S" : null;

        const value = auto || attendance?.[emp.employee_id]?.[dateStr] || "";

        // Save value
        empAttendance[dateStr] = value;

        // Count totals
        if (value && counts[value] !== undefined) counts[value] += 1;
      });

      // compute L and SL totals
      counts.totalL = counts.L + counts.L1 * 0.5 + counts.L2 * 0.5;
      counts.totalSL = counts.SL + counts.SL1 * 0.5 + counts.SL2 * 0.5;

      // final employee object
      exportObj.employees.push({
        id: emp.employee_id,
        name: emp.name,
        department: emp.department?.department_name || "",
        branch: emp.branch?.branch_name || "",
        projectSite: emp.projectSite?.site_name || "",
        attendance: empAttendance,
        totals: counts,
      });
    });

    return exportObj;
  };

  const saveChanges = () => {

  }

  useEffect(() => {
  const close = () => setOpenCell(null);
  document.addEventListener("click", close);
  return () => document.removeEventListener("click", close);
}, []);


  return (
    <div className="w-full p-2 md:p-4 bg-white border rounded-xl max-w-full overflow-x-auto">
      <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-semibold">
            Attendance Sheet - {format(month, "MMMM yyyy")}
          </h2>
          <div className="text-sm text-gray-500">
            Showing {employees.length} employees • {days.length} days
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end text-sm">
          <button
            onClick={() => setMonth((m) => subMonths(m, 1))}
            className="px-3 py-1 border rounded cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="px-3 py-1 border rounded cursor-pointer"
          >
            Next
          </button>

          <div className="border-l h-6" />

          <button
            onClick={saveChanges}
            className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
          >
            Save Chamges
          </button>

          <div className="border-l h-6" />

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
          >
            <Import size={16} /> Export Data
          </button>
        </div>
      </div>

    {/* MBOILE CARDS VIEW */}
    <MobileCards employees={employees} totals={totals} saturdays={saturdays} sundays={sundays} days={days} holidays={holidays} attendance={attendance} handleChange={handleChange} />

    {/* DESKTOP TABLE VIEW */}
    <DesktopTable table={table} flexRender={flexRender} />

      {showExport && (
        <ExportDataModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          modal="attendance"
          data={employees}
          filters={filters}
          setFilters={setFilters}
          attendanceData = {getExportAttendanceData()}
        />
      )}

      <div className="mt-3 text-sm text-gray-600">
        * Sundays auto-marked as <strong>H</strong>. Saturday offs & bank
        holidays applied automatically.
      </div>
    </div>
  );
}
