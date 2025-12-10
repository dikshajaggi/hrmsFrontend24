// src/components/attendance/AttendanceGrid.tsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { AttendanceCell } from './AttendanceCell';
import { useClickOutside } from '../hooks/useClickOutside';
import "./attendance.css"

function getLeaveValue(status)  {
  switch (status) {
    // Casual Leave
    case 'casual_leave':
      return { casual: 1, sick: 0 };
    case 'half_day_casual_1':
    case 'half_day_casual_2':
      return { casual: 0.5, sick: 0 };

    // Sick Leave
    case 'sick_leave':
      return { casual: 0, sick: 1 };
    case 'sick_leave_1':
    case 'sick_leave_2':
      return { casual: 0, sick: 0.5 };

    default:
      return { casual: 0, sick: 0 };
  }
}


const makeKey = (employeeId, date) => `${employeeId}_${date}`;

export const AttendanceGrid = ({
  employees,
  days,
  gridData,
  onCellChange,
  loading,
}) => {
  const [openCell, setOpenCell] = useState(null);
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => setOpenCell(null));

  const handleToggleCell = (key) => {
    setOpenCell(prev => (prev === key ? null : key));
  };

  // Month summary: CL (L, L1, L2) & SL (SL, SL1, SL2)
 const summaries = useMemo(() => {
  const result = {};

  employees.forEach(emp => {
    const empData = gridData[emp.employee_id] || {};
    let cl = 0;
    let sl = 0;

    days.forEach(d => {
      const cell = empData[d.date];
      if (!cell || !cell.status) return;

      const { casual, sick } = getLeaveValue(cell.status);
      cl += casual;
      sl += sick;
    });

    result[emp.employee_id] = { cl, sl };
  });

  return result;
}, [employees, gridData, days]);


  const renderHeaderRows = () => {
    return (
      <thead>
        {/* Row 1: Date numbers */}
        <tr>
          <th className="sticky-col sticky-top header-name-col">
            Employee
          </th>
          <th className="sticky-col sticky-top header-desig-col">
            Designation
          </th>
          {days.map(d => {
            const dateObj = new Date(d.date);
            const dayNum = dateObj.getDate();
            return (
              <th
                key={d.date}
                className="sticky-top date-header-cell"
              >
                {dayNum}
              </th>
            );
          })}
          <th className="sticky-top summary-header">CL</th>
          <th className="sticky-top summary-header">SL</th>
        </tr>

        {/* Row 2: Weekday names */}
        <tr>
          <th className="sticky-col sticky-top-2 header-name-col">
            {/* empty */}
          </th>
          <th className="sticky-col sticky-top-2 header-desig-col">
            {/* empty */}
          </th>
          {days.map(d => {
            const dateObj = new Date(d.date);
            const weekday = dateObj
              .toLocaleDateString('en-IN', { weekday: 'short' })
              .toUpperCase();
            return (
              <th
                key={d.date + '-day'}
                className="sticky-top-2 day-header-cell"
              >
                {weekday}
              </th>
            );
          })}
          <th className="sticky-top-2 summary-header">Total CL</th>
          <th className="sticky-top-2 summary-header">Total SL</th>
        </tr>
      </thead>
    );
  };

  const getCell = useCallback(
    (employeeId, date) => {
      return gridData[employeeId]?.[date];
    },
    [gridData]
  );

  return (
    <div className="attendance-table-wrapper" ref={wrapperRef}>
      {loading && <div className="attendance-loading">Loading…</div>}
      <table className="attendance-table">
        {renderHeaderRows()}
        <tbody>
          {employees.map(emp => {
            const summary = summaries[emp.employee_id] || { cl: 0, sl: 0 };
            return (
              <tr key={emp.employee_id}>
                <td className="sticky-col header-name-col employee-cell">
                  {emp.name}
                </td>
                <td className="sticky-col header-desig-col employee-cell">
                  {emp.designation_name}
                </td>
                {days.map(day => {
                  const key = makeKey(emp.employee_id, day.date);
                  const cell = getCell(emp.employee_id, day.date);
                  return (
                    <AttendanceCell
                      key={key}
                      employeeId={emp.employee_id}
                      day={day}
                      cell={cell}
                      isOpen={openCell === key}
                      onToggleOpen={() => handleToggleCell(key)}
                      onChange={onCellChange}
                    />
                  );
                })}
                <td className="summary-cell">{summary.cl}</td>
                <td className="summary-cell">{summary.sl}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
