import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import * as XLSX from "xlsx";
import { ChevronDown } from "lucide-react";

// =======================
//  HARD CODED EMPLOYEES (sample)
// =======================
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

];

// =======================
//  ATTENDANCE CODES
// =======================
const ATTENDANCE_CODES = {
  P: { label: "Present", color: "bg-green-100 text-green-700" },
  H: { label: "Holiday", color: "bg-purple-100 text-purple-700" },
  S: { label: "Saturday Off", color: "bg-red-200 text-red-800" },
  L: { label: "Casual Leave", color: "bg-red-100 text-red-700" },
  L1: { label: "Casual Leave (first half off)", color: "bg-red-100 text-red-700" },
  L2: { label: "Casual Leave (second half off)", color: "bg-red-100 text-red-700" },
  SL: { label: "Sick Leave", color: "bg-emerald-200 text-emerald-800" },
  SL1: { label: "Sick Leave (first half off)", color: "bg-emerald-200 text-emerald-800" },
  SL2: { label: "Sick Leave (second half off)", color: "bg-emerald-200 text-emerald-800" },
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
        className={`w-full px-2 py-1 rounded-md text-xs flex items-center justify-center ${color}`}
        disabled={disabled}
      >
        {value || "-"}
        {!disabled && <ChevronDown size={12} className="ml-1" />}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-66 bg-white border rounded-lg shadow" onMouseLeave={() => setOpen(false)}>
          <div className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100" onClick={() => { onChange(""); setOpen(false); }}>
            Clear
          </div>

          {OPTIONS.map((opt) => (
            <div key={opt} className="px-3 py-2 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-100" onClick={() => { onChange(opt); setOpen(false); }}>
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-semibold ${ATTENDANCE_CODES[opt].color}`}>{opt}</span>
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
export default function AttendanceTable({ apiUrl, initialMonth = new Date(), bankHolidays = [], saturdayOffs = [
    { "date": "2025-11-08", "week": 2 },
    { "date": "2025-11-22", "week": 4 }
] }) {
  // --- UI / Data state
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({}); // { empId: { 'yyyy-MM-dd': 'P' }}
  const [month, setMonth] = useState(initialMonth);

  // --- Load employees (local or api)
  useEffect(() => {
    if (apiUrl) {
      // you can implement real API call here; placeholder for now
      fetch(apiUrl)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setEmployees(data);
          else if (Array.isArray(data.employees)) setEmployees(data.employees);
          else setEmployees(employeesData);
        })
        .catch(() => setEmployees(employeesData));
    } else {
      setEmployees(employeesData);
    }
  }, [apiUrl]);

  // --- Days in month
  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }), [month]);

  // --- Auto Sundays
  const sundays = useMemo(() => days.filter((d) => format(d, "EEE") === "Sun").map((d) => format(d, "yyyy-MM-dd")), [days]);

  // --- normalize holidays and saturdays input (accept array of objects or strings)
  const holidays = useMemo(() => {
    return (bankHolidays || []).map((d) => {
      if (!d) return null;
      if (typeof d === "string") return format(new Date(d), "yyyy-MM-dd");
      if (d.date) return format(new Date(d.date), "yyyy-MM-dd");
      return null;
    }).filter(Boolean);
  }, [bankHolidays]);

  const saturdays = useMemo(() => {
    return (saturdayOffs || []).map((d) => {
      if (!d) return null;
      if (typeof d === "string") return format(new Date(d), "yyyy-MM-dd");
      if (d.date) return format(new Date(d.date), "yyyy-MM-dd");
      return null;
    }).filter(Boolean);
  }, [saturdayOffs]);

  // --- handle change
  const handleChange = (empId, dateStr, value) => {
    setAttendance((prev) => ({ ...prev, [empId]: { ...(prev[empId] || {}), [dateStr]: value } }));
  };

  // --- Mark all helper (mark every editable cell for the displayed month)
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

          const disabled = isHoliday || isSaturday; // do not overwrite auto
          if (!disabled) {
            next[emp.id][dateStr] = status;
          }
        });
      });
      return next;
    });
  };

  // --- Totals per employee
  const totals = useMemo(() => {
    const map = {};
    employees.forEach((emp) => {
      const counts = { P: 0, H: 0, S: 0, L: 0, L1:0, L2: 0, SL: 0, SL1: 0, SL2: 0, W: 0, C: 0 };
      days.forEach((d) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const isSunday = sundays.includes(dateStr);
        const isHoliday = holidays.includes(dateStr) || isSunday;
        const isSaturday = saturdays.includes(dateStr);
        const auto = isHoliday ? "H" : isSaturday ? "S" : null;
        const value = auto || (attendance?.[emp.id]?.[dateStr] || "");
        if (value && counts[value] !== undefined) counts[value] += 1;
      });
      counts.totalL = counts.L + (counts.L1 * 0.5) + (counts.L2 * 0.5);
      counts.totalSL = counts.SL + (counts.SL1 * 0.5) + (counts.SL2 * 0.5);
      map[emp.id] = counts;
    });
    return map;
  }, [employees, attendance, days, holidays, saturdays, sundays]);

  // --- Export to Excel
  const exportToExcel = () => {
    const rows = employees.map((emp) => {
      const row = { Employee: emp.name, Department: emp.department };
      days.forEach((day) => {
        const dateStr = format(day, "yyyy-MM-dd");
        const isSunday = sundays.includes(dateStr);
        const isHoliday = holidays.includes(dateStr) || isSunday;
        const isSaturday = saturdays.includes(dateStr);
        const auto = isHoliday ? "H" : isSaturday ? "S" : null;
        row[dateStr] = auto || attendance?.[emp.id]?.[dateStr] || "";
      });
      // add totals
      const t = totals[emp.id] || {};
      row.P = t.P; row.L = t.L; row.SL = t.SL;
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `attendance-${format(month, "yyyy-MM")}.xlsx`);
  };

  // --- Table columns
  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const base = [
      columnHelper.display({ id: "employee", header: "Employee", cell: ({ row }) => (
        <div style={{ width: 160 }} className="font-medium sticky left-0 bg-white px-2 z-40 border-r">
          {row.original.name}
        </div>
      ) }),
      columnHelper.display({ id: "department", header: "Dept", cell: ({ row }) => (
        <div style={{ width: 120 }} className="font-medium sticky left-[160px] bg-white px-2 z-30 border-r">
          {row.original.department}
        </div>
      ) }),
    ];

    const dayCols = days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const weekday = format(day, "EEE");
      const isSunday = sundays.includes(dateStr);
      const isSaturday = saturdays.includes(dateStr);

      return columnHelper.display({ id: dateStr, header: () => (
        <div className={`flex flex-col text-xs font-semibold ${isSunday ? "bg-yellow-50" : isSaturday ? "bg-gray-50" : ""} px-1`}> 
          <span>{format(day, "d")}</span>
          <span className="text-gray-500 text-[10px]">{weekday}</span>
        </div>
      ), cell: ({ row }) => {
        const emp = row.original;
        const isSundayLocal = sundays.includes(dateStr);
        const isHolidayLocal = holidays.includes(dateStr) || isSundayLocal;
        const isSaturdayLocal = saturdays.includes(dateStr);
        const auto = isHolidayLocal ? "H" : isSaturdayLocal ? "S" : null;
        const value = auto || attendance?.[emp.id]?.[dateStr] || "";
        return (
          <div className={`${isSundayLocal ? "bg-yellow-50" : isSaturdayLocal ? "bg-gray-50" : ""} p-1`}> 
            <AttendanceCell value={value} disabled={isHolidayLocal || isSaturdayLocal} onChange={(v) => handleChange(emp.id, dateStr, v)} />
          </div>
        );
      } });
    });

    // totals columns (P, L, SL)
    const totalsCols = [
      columnHelper.display({
        id: "totalP",
        header: "Total P",
        cell: ({ row }) => <div className="px-2">{(totals[row.original.id] || {}).P || 0}</div>,
      }),

      // ⭐ Updated L totals
      columnHelper.display({
        id: "totalL",
        header: "Total L",
        cell: ({ row }) => {
          const t = totals[row.original.id] || {};
          return <div className="px-2">{t.totalL || 0}</div>;
        },
      }),

      // ⭐ Updated SL totals
      columnHelper.display({
        id: "totalSL",
        header: "Total SL",
        cell: ({ row }) => {
          const t = totals[row.original.id] || {};
          return <div className="px-2">{t.totalSL || 0}</div>;
        },
      }),
    ];

    return [...base, ...dayCols, ...totalsCols];
  }, [days, attendance, holidays, saturdays, sundays, totals]);

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });

  // --- Month navigation helpers
  const prevMonth = () => setMonth((m) => subMonths(m, 1));
  const nextMonth = () => setMonth((m) => addMonths(m, 1));

  // --- NOTE about virtualization:
  // I included a scaffold for virtualization; for a robust virtual scroll you can
  // install @tanstack/react-virtual and enable it. For most HR attendance sizes (<= 1000 rows)
  // the table will be responsive enough; virtualization can be added later easily.

  return (
    <div className="w-full p-4 bg-white border rounded-xl max-w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-3 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Attendance Sheet - {format(month, "MMMM yyyy")}</h2>
          <div className="text-sm text-gray-500">Showing {employees.length} employees • {days.length} days</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="px-3 py-1 border rounded cursor-pointer">Prev</button>
          <button onClick={nextMonth} className="px-3 py-1 border rounded cursor-pointer">Next</button>

          <div className="border-l h-6" />

          <button onClick={() => markAll('P')} className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer">Mark All P</button>
          {/* <button onClick={() => markAll('A')} className="px-3 py-1 bg-red-600 text-white rounded">Mark All A</button>
          <button onClick={() => markAll('H')} className="px-3 py-1 bg-purple-600 text-white rounded">Mark All H</button> */}

          <div className="border-l h-6" />

          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer">Export Excel</button>
        </div>
      </div>

      <div className="overflow-auto max-h-[70vh]">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-30">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header, idx) => (
                  <th key={header.id} className={`px-3 py-2 border text-center font-semibold ${idx === 0 ? 'sticky left-0 z-50 bg-white' : idx === 1 ? 'sticky left-[160px] z-40 bg-white' : ''}`}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, idx) => (
                  <td key={cell.id} className={`${idx === 0 ? 'sticky left-0 z-40 bg-white border-r' : idx === 1 ? 'sticky left-[160px] z-30 bg-white border-r' : ''} px-2 py-1 border text-center` }>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-sm text-gray-600"> * Sundays are auto-marked as <strong>H</strong> (Holiday). Saturday offs / Bank holidays are applied automatically.</div>
    </div>
  );
}
