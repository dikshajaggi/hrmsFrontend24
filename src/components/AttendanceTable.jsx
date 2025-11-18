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
import * as XLSX from "xlsx";
import { ChevronDown, Import } from "lucide-react";
import ExportDataModal from "./common/ExportDataModal";


const employeesData = [
  { id: 1, name: "Aditi Sharma", gender: "Female", branch: "Delhi", department: "HR", designation: "HR Executive", projectSite: "Dwarka" },
  { id: 2, name: "Rohan Verma", gender: "Male", branch: "Mumbai", department: "Accounts", designation: "Senior Accountant", projectSite: "Andheri" },
  { id: 3, name: "Kavita Das", gender: "Female", branch: "Bangalore", department: "IT", designation: "Software Developer", projectSite: "Electronic City" },
  { id: 4, name: "Vikas Mehta", gender: "Male", branch: "Delhi", department: "Sales", designation: "Sales Manager", projectSite: "Noida" },
  { id: 5, name: "Pooja Nair", gender: "Female", branch: "Mumbai", department: "HR", designation: "Recruiter", projectSite: "Andheri" },
  { id: 6, name: "Arjun Patel", gender: "Male", branch: "Bangalore", department: "Engineering", designation: "Frontend Developer", projectSite: "Whitefield" },
  { id: 7, name: "Sneha Iyer", gender: "Female", branch: "Delhi", department: "Marketing", designation: "Content Strategist", projectSite: "Dwarka" },
  { id: 8, name: "Ritesh Gupta", gender: "Male", branch: "Mumbai", department: "Engineering", designation: "Backend Developer", projectSite: "Andheri" },
  { id: 9, name: "Priya Menon", gender: "Female", branch: "Bangalore", department: "Accounts", designation: "Finance Associate", projectSite: "Electronic City" },
  { id: 10, name: "Karan Singh", gender: "Male", branch: "Delhi", department: "IT", designation: "System Administrator", projectSite: "Noida" },
  { id: 11, name: "Neha Kapoor", gender: "Female", branch: "Mumbai", department: "Sales", designation: "Business Development Executive", projectSite: "Andheri" },
  { id: 12, name: "Ravi Deshmukh", gender: "Male", branch: "Bangalore", department: "Engineering", designation: "DevOps Engineer", projectSite: "Whitefield" },
]
// =======================
//  Attendance Codes
// =======================
const ATTENDANCE_CODES = {
  P: { label: "Present", color: "bg-green-100 text-green-700" },
  H: { label: "Holiday", color: "bg-purple-100 text-purple-700" },
  S: { label: "Saturday Off", color: "bg-red-200 text-red-800" },
  L: { label: "Casual Leave", color: "bg-red-100 text-red-700" },
  L1: {
    label: "Casual Leave (first half off)",
    color: "bg-red-100 text-red-700",
  },
  L2: {
    label: "Casual Leave (second half off)",
    color: "bg-red-100 text-red-700",
  },
  SL: { label: "Sick Leave", color: "bg-emerald-200 text-emerald-800" },
  SL1: {
    label: "Sick Leave (first half off)",
    color: "bg-emerald-200 text-emerald-800",
  },
  SL2: {
    label: "Sick Leave (second half off)",
    color: "bg-emerald-200 text-emerald-800",
  },
  W: { label: "Work From Home", color: "bg-blue-100 text-blue-700" },
  C: { label: "Comp Off", color: "bg-yellow-100 text-yellow-700" },
};

const OPTIONS = Object.keys(ATTENDANCE_CODES);


// =======================
//  DROPDOWN CELL
// =======================
function AttendanceCell({ value, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const color = ATTENDANCE_CODES[value]?.color || "bg-gray-50 text-gray-400";

  return (
    <div className="relative min-w-[40px]">
      <button
        onClick={() => !disabled && setOpen((s) => !s)}
        className={`w-full px-1.5 md:px-2 py-1 rounded-md text-[10px] md:text-xs flex items-center justify-center ${color}`}
        disabled={disabled}
      >
        {value || "-"}
        {!disabled && <ChevronDown size={12} className="ml-1" />}
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-64 bg-white border rounded-lg shadow"
          onMouseLeave={() => setOpen(false)}
        >
          <div
            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            Clear
          </div>

          {OPTIONS.map((opt) => (
            <div
              key={opt}
              className="px-3 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <span
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${ATTENDANCE_CODES[opt].color}`}
              >
                {opt}
              </span>
              {ATTENDANCE_CODES[opt].label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =======================
//  MAIN TABLE
// =======================
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
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(initialMonth);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    setEmployees(employeesData);
  }, []);

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

  const markAll = (status) => {
    setAttendance((prev) => {
      const next = { ...prev };
      employees.forEach((emp) => {
        next[emp.id] = { ...(next[emp.id] || {}) };
        days.forEach((d) => {
          const dateStr = format(d, "yyyy-MM-dd");
          const isSunday = sundays.includes(dateStr);
          const isHoliday = holidays.includes(dateStr) || isSunday;
          const isSaturday = saturdays.includes(dateStr);
          const disabled = isHoliday || isSaturday;
          if (!disabled) next[emp.id][dateStr] = status;
        });
      });
      return next;
    });
  };

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
        const value = auto || attendance?.[emp.id]?.[dateStr] || "";
        if (value && counts[value] !== undefined) counts[value] += 1;
      });
      counts.totalL = counts.L + counts.L1 * 0.5 + counts.L2 * 0.5;
      counts.totalSL = counts.SL + counts.SL1 * 0.5 + counts.SL2 * 0.5;
      map[emp.id] = counts;
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
            {row.original.department}
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
          const value = auto || attendance?.[emp.id]?.[dateStr] || "";

          return (
            <div
              className={`p-1 ${
                isSundayLocal ? "bg-yellow-50" : isSaturdayLocal ? "bg-gray-50" : ""
              } whitespace-nowrap`}
            >
              <AttendanceCell
                value={value}
                disabled={isHolidayLocal || isSaturdayLocal}
                onChange={(v) => handleChange(emp.id, dateStr, v)}
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
            {(totals[row.original.id] || {}).P || 0}
          </div>
        ),
      }),
      columnHelper.display({
        id: "totalL",
        header: "Total L",
        cell: ({ row }) => {
          const t = totals[row.original.id] || {};
          return <div className="px-2 whitespace-nowrap">{t.totalL || 0}</div>;
        },
      }),
      columnHelper.display({
        id: "totalSL",
        header: "Total SL",
        cell: ({ row }) => {
          const t = totals[row.original.id] || {};
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
//  MOBILE CARD VIEW (ONLY < 640px)
// =======================
// =======================
//  ENHANCED MOBILE CARD VIEW (ONLY < 640px)
// =======================
const MobileCards = () => {
  const [expanded, setExpanded] = useState({}); // track which employee is expanded
  const [showFull, setShowFull] = useState({}); // track expanded days list

  const toggleExpand = (empId) =>
    setExpanded((prev) => ({ ...prev, [empId]: !prev[empId] }));

  const toggleShowFull = (empId) =>
    setShowFull((prev) => ({ ...prev, [empId]: !prev[empId] }));

  return (
    <div className="block sm:hidden space-y-4">
      {employees.map((emp) => {
        const empTotals = totals[emp.id] || {};

        const displayedDays = showFull[emp.id] ? days : days.slice(0, 10); // first 10 days preview

        return (
          <div
            key={emp.id}
            className="border rounded-xl bg-white shadow p-4 relative"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{emp.name}</div>
                <div className="text-gray-500 text-sm">{emp.department}</div>
              </div>

              <button
                className="text-blue-600 text-sm"
                onClick={() => toggleExpand(emp.id)}
              >
                {expanded[emp.id] ? "Hide" : "View"}
              </button>
            </div>

            {/* Totals */}
            {expanded[emp.id] && (
              <div className="flex justify-between mt-3 border-b pb-2">
                <div className="text-sm">
                  <span className="font-semibold">P:</span>{" "}
                  {empTotals.P || 0}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">L:</span>{" "}
                  {empTotals.totalL || 0}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">SL:</span>{" "}
                  {empTotals.totalSL || 0}
                </div>
              </div>
            )}

            {/* Days */}
            {expanded[emp.id] && (
              <>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {displayedDays.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const weekday = format(day, "EEE");

                    const isSundayLocal = sundays.includes(dateStr);
                    const isHolidayLocal =
                      holidays.includes(dateStr) || isSundayLocal;
                    const isSaturdayLocal = saturdays.includes(dateStr);

                    const auto = isHolidayLocal
                      ? "H"
                      : isSaturdayLocal
                      ? "S"
                      : null;

                    const value =
                      auto || attendance?.[emp.id]?.[dateStr] || "";

                    return (
                      <div
                        key={dateStr}
                        className={`p-3 rounded-lg border ${
                          isSundayLocal
                            ? "bg-yellow-50"
                            : isSaturdayLocal
                            ? "bg-gray-100"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-gray-700 mb-1">
                          {format(day, "d")} • {weekday}
                        </div>

                        <AttendanceCell
                          value={value}
                          disabled={isHolidayLocal || isSaturdayLocal}
                          onChange={(v) => handleChange(emp.id, dateStr, v)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Show more/less button */}
                {days.length > 10 && (
                  <button
                    className="mt-3 w-full text-blue-600 text-center text-sm"
                    onClick={() => toggleShowFull(emp.id)}
                  >
                    {showFull[emp.id] ? "Show Less Days" : "Show All Days"}
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};


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
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <button
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>

          <div className="border-l h-6" />

          <button
            onClick={() => markAll("P")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Mark All P
          </button>

          <div className="border-l h-6" />

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Import size={16} /> Export Data
          </button>
        </div>
      </div>

    <MobileCards />

    {/* DESKTOP TABLE VIEW */}
      {/* Responsive Scroll Wrapper */}
      <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[70vh] w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="w-full text-[10px] md:text-xs border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-30">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={` px-3 py-2 text-center border font-semibold whitespace-nowrap ${
                      idx === 0
                        ? "sticky left-0 z-999 bg-white"
                        : idx === 1
                        ? "sticky left-[120px] md:left-[160px] border z-40 bg-white"
                        : ""
                    }`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, idx) => (
                  <td
                    key={cell.id}
                    className={`px-2 py-1 border text-center whitespace-nowrap ${
                      idx === 0
                        ? "sticky left-0 bg-white border"
                        : idx === 1
                        ? "sticky left-[120px] md:left-[160px] bg-white border"
                        : ""
                    }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showExport && (
        <ExportDataModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          modal="attendance"
          data={employees}
          filters={filters}
          setFilters={setFilters}
        />
      )}

      <div className="mt-3 text-sm text-gray-600">
        * Sundays auto-marked as <strong>H</strong>. Saturday offs & bank
        holidays applied automatically.
      </div>
    </div>
  );
}
