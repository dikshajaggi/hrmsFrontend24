import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ChevronDown } from "lucide-react";

const ATTENDANCE_CODES = {
  P: { label: "Present", color: "bg-green-100 text-green-700" },
  A: { label: "Absent", color: "bg-red-100 text-red-700" },
  H: { label: "Holiday", color: "bg-purple-100 text-purple-700" },
  S: { label: "Saturday Off", color: "bg-red-200 text-red-800" },
  L: { label: "Casual Leave", color: "bg-green-200 text-green-800" },
  SL: { label: "Sick Leave", color: "bg-emerald-200 text-emerald-800" },
  W: { label: "Work From Home", color: "bg-blue-100 text-blue-700" },
  C: { label: "Comp Off", color: "bg-yellow-100 text-yellow-700" },
};

const OPTIONS = Object.keys(ATTENDANCE_CODES);

// ✅ Memoized Dropdown Cell Component
const AttendanceCell = React.memo(({ empId, day, initialValue, onChangeRef, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const colorClass = ATTENDANCE_CODES[value]?.color || "bg-gray-50 text-gray-400";

  const handleSelect = useCallback(
    (option) => {
      setValue(option);
      onChangeRef.current(empId, day, option);
      setIsOpen(false);
    },
    [empId, day, onChangeRef]
  );

  return (
    <div className="relative min-w-[40px]">
      <button
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center px-2 py-1 rounded-md text-sm font-medium ${colorClass} ${
          !isDisabled ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"
        }`}
      >
        {value || "-"}
        {!isDisabled && (
          <ChevronDown
            size={12}
            className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            <div
              onClick={() => handleSelect("")}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-600"
            >
              Clear
            </div>
            {OPTIONS.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center gap-2 ${
                  value === opt ? "bg-gray-100" : ""
                }`}
              >
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${ATTENDANCE_CODES[opt].color}`}
                >
                  {opt}
                </span>
                <span>{ATTENDANCE_CODES[opt].label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

const AttendanceTable = ({
  employees = [
    { id: 1, name: "Aditi Sharma", department: "HR" },
    { id: 2, name: "Rohan Verma", department: "Accounts" },
    { id: 3, name: "Kavita Das", department: "IT" },
  ],
  month = new Date(),
  bankHolidays = [],
  saturdayOffs = [],
}) => {
  const [attendance, setAttendance] = useState({});
  const attendanceRef = useRef(attendance);

  // Keep ref in sync with state
  attendanceRef.current = attendance;

  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      }),
    [month]
  );

  // ✅ Make dates stable by using ISO string (not Date object)
  const holidayDates = useMemo(
    () => bankHolidays.map((h) => new Date(h).toISOString().split("T")[0]),
    [bankHolidays]
  );

  const saturdayDates = useMemo(
    () => saturdayOffs.map((d) => new Date(d).toISOString().split("T")[0]),
    [saturdayOffs]
  );

  // ✅ Use ref to avoid dependency issues
  const handleChangeRef = useRef((empId, date, value) => {
    const dateStr = date.toISOString().split("T")[0];
    setAttendance((prev) => {
      const prevVal = prev[empId]?.[dateStr];
      if (prevVal === value) return prev; // 🔒 prevent unnecessary renders
      return {
        ...prev,
        [empId]: { ...prev[empId], [dateStr]: value },
      };
    });
  });

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("name", {
        header: "Employee",
        cell: (info) => (
          <div className="font-medium text-gray-800 whitespace-nowrap px-2">
            {info.getValue()}
          </div>
        ),
      }),
    ];

    const dayColumns = daysInMonth.map((day) =>
      columnHelper.display({
        id: format(day, "d"),
        header: () => (
          <div className="text-xs font-medium text-gray-600">{format(day, "d")}</div>
        ),
        cell: ({ row }) => {
          const emp = row.original;
          const dateStr = day.toISOString().split("T")[0];
          const isHoliday = holidayDates.includes(dateStr);
          const isSaturday = saturdayDates.includes(dateStr);

          let initialValue = "";
          if (isHoliday) initialValue = "H";
          else if (isSaturday) initialValue = "S";
          else initialValue = attendanceRef.current[emp.id]?.[dateStr] || "";

          const isDisabled = isHoliday || isSaturday;

          return (
            <AttendanceCell
              empId={emp.id}
              day={day}
              initialValue={initialValue}
              onChangeRef={handleChangeRef}
              isDisabled={isDisabled}
            />
          );
        },
      })
    );

    return [...baseColumns, ...dayColumns];
  }, [daysInMonth, holidayDates, saturdayDates]);

  const table = useReactTable({
    data: employees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full min-w-fit rounded-xl border border-gray-100 bg-white shadow-sm p-6">
      {console.log("infinite")}
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.values(ATTENDANCE_CODES).map((opt) => (
          <div key={opt.label} className="flex items-center gap-1 text-sm">
            <span className={`w-4 h-4 rounded ${opt.color}`}></span>
            <span>{opt.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="border-collapse text-xs w-full relative">
          <thead className="bg-gray-50 sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`border border-gray-100 py-2 px-3 text-center text-xs font-semibold text-gray-600 ${
                      index === 0 ? "sticky left-0 z-30 bg-gray-50" : ""
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`border border-gray-100 px-1 py-1 text-center text-sm ${
                      index === 0 ? "sticky left-0 z-10 bg-white" : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 text-xs text-gray-500 border-t">
        Click a cell to edit attendance. Holidays and Saturday offs are auto-marked.
      </div>
    </div>
  );
};

export default AttendanceTable;
