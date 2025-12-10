// src/components/attendance/Legend.tsx
import React from 'react';
import "./attendance.css"

export const AttendanceLegend = () => {
  return (
    <div className="attendance-legend">
      <span className="legend-item text-[14px]">
         <span className="legend-dot cell-present" /> <strong>P</strong> = Present</span>
      <span className="legend-item text-[14px]">
        <span className="legend-dot cell-holiday" />
        <strong>H</strong> = Holiday
      </span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-weekend" /><strong>S</strong> = Saturday Off</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-leave" /><strong>L</strong> = Casual Leave (full)</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-leave" /><strong>L1</strong> = 1st Half Casual</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-leave" /><strong>L2</strong> = 2nd Half Casual</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-sick" /><strong>SL</strong> = Sick Leave (full)</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-sick" /><strong>SL1</strong> = 1st Half SL</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-sick" /><strong>SL2</strong> = 2nd Half SL</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-wfh" /><strong>W</strong> = Work From Home</span>
      <span className="legend-item text-[14px]"> <span className="legend-dot cell-compoff" /><strong>C</strong> = Comp Off</span>
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