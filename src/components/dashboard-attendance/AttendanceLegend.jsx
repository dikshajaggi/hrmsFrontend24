// src/components/attendance/Legend.tsx
import React from 'react';
import "./attendance.css"

export const AttendanceLegend = () => {
  const items = [
    { label: "P", text: "Present", color: "bg-emerald-500" },
    { label: "H", text: "Holiday", color: "bg-sky-500" },
    { label: "S", text: "Saturday Off", color: "bg-indigo-500" },

    { label: "L", text: "Casual Leave (Full)", color: "bg-amber-500" },
    { label: "L1", text: "1st Half CL", color: "bg-amber-400" },
    { label: "L2", text: "2nd Half CL", color: "bg-amber-300" },

    { label: "SL", text: "Sick Leave (Full)", color: "bg-rose-500" },
    { label: "SL1", text: "1st Half SL", color: "bg-rose-400" },
    { label: "SL2", text: "2nd Half SL", color: "bg-rose-300" },

    { label: "W", text: "Work From Home", color: "bg-violet-500" },
    { label: "C", text: "Comp Off", color: "bg-teal-500" }
  ];

  return (
    <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm border">
      {items.map(({ label, text, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
        >
          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <span className="font-semibold">{label}</span>
          <span className="text-gray-500">— {text}</span>
        </div>
      ))}
    </div>
  );
};



// const ATTENDANCE_CODES = {
//   P: { label: "Present", color: "bg-green-100 text-green-700" },
//   H: { label: "Holiday", color: "bg-purple-100 text-purple-700" },
//   S: { label: "Saturday Off", color: "bg-red-200 text-red-800" },
//   L: { label: "Casual Leave", color: "bg-red-100 text-red-700" },
//   L1: {
//     label: "Casual Leave (first half off)",
//     color: "bg-red-100 text-red-700",
//   },
//   L2: {
//     label: "Casual Leave (second half off)",
//     color: "bg-red-100 text-red-700",
//   },
//   SL: { label: "Sick Leave", color: "bg-emerald-200 text-emerald-800" },
//   SL1: {
//     label: "Sick Leave (first half off)",
//     color: "bg-emerald-200 text-emerald-800",
//   },
//   SL2: {
//     label: "Sick Leave (second half off)",
//     color: "bg-emerald-200 text-emerald-800",
//   },
//   W: { label: "Work From Home", color: "bg-blue-100 text-blue-700" },
//   C: { label: "Comp Off", color: "bg-yellow-100 text-yellow-700" },
// };