// =======================
//  Attendance Codes

import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
export const AttendanceCell = ({ value, disabled, onChange }) => {
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

export const MobileCards = ({employees, totals, saturdays, sundays, days, holidays, attendance, handleChange}) => {
  const [expanded, setExpanded] = useState({}); // track which employee is expanded
  const [showFull, setShowFull] = useState({}); // track expanded days list

  const toggleExpand = (empId) =>
    setExpanded((prev) => ({ ...prev, [empId]: !prev[empId] }));

  const toggleShowFull = (empId) =>
    setShowFull((prev) => ({ ...prev, [empId]: !prev[empId] }));

  return (
    <div className="block sm:hidden space-y-4">
      {employees.map((emp) => {
        const empTotals = totals[emp.employee_id] || {};

        const displayedDays = showFull[emp.employee_id] ? days : days.slice(0, 10); // first 10 days preview

        return (
          <div
            key={emp.employee_id}
            className="border rounded-xl bg-white shadow p-4 relative"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{emp.name}</div>
                <div className="text-gray-500 text-sm">{emp.department.department_name}</div>
              </div>

              <button
                className="text-blue-600 text-sm"
                onClick={() => toggleExpand(emp.employee_id)}
              >
                {expanded[emp.employee_id] ? "Hide" : "View"}
              </button>
            </div>

            {/* Totals */}
            {expanded[emp.employee_id] && (
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
            {expanded[emp.employee_id] && (
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
                      auto || attendance?.[emp.employee_id]?.[dateStr] || "";

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
                          onChange={(v) => handleChange(emp.employee_id, dateStr, v)}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Show more/less button */}
                {days.length > 10 && (
                  <button
                    className="mt-3 w-full text-blue-600 text-center text-sm"
                    onClick={() => toggleShowFull(emp.employee_id)}
                  >
                    {showFull[emp.employee_id] ? "Show Less Days" : "Show All Days"}
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

export const DesktopTable = ({table, flexRender}) => {
   return (<div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[70vh] w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="w-full text-[10px] md:text-xs border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-999">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={`sticky px-3 py-2 text-center border font-semibold whitespace-nowrap ${
                      idx === 0
                        ? "sticky left-0 z-999 bg-white"
                        : idx === 1
                        ? "sticky left-[120px] md:left-[160px] border z-999 bg-white"
                        : "z-30"
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
                        ? "sticky left-0 bg-white border z-40 border-r"
                        : idx === 1
                        ? "sticky left-[120px] md:left-[160px] bg-white border  border-l z-40"
                        : "z-30"
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
      )

}