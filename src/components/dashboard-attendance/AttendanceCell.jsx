// src/components/attendance/AttendanceCell.tsx
import React from 'react';
import "./attendance.css"

const STATUS_LABELS = {
  present: 'P',
  holiday: 'H',
  saturday_off: 'S',
  casual_leave: 'L',
  half_day_casual_1: 'L1',
  half_day_casual_2: 'L2',
  sick_leave: 'SL',
  sick_leave_1: 'SL1',
  sick_leave_2: 'SL2',
  wfh: 'W',
  comp_off: 'C',
};

const LABEL_TO_STATUS = {
  '': null,
  P: 'present',
  H: 'holiday',
  S: 'saturday_off',
  L: 'casual_leave',
  L1: 'half_day_casual_1',
  L2: 'half_day_casual_2',
  SL: 'sick_leave',
  SL1: 'sick_leave_1',
  SL2: 'sick_leave_2',
  W: 'wfh',
  C: 'comp_off',
};

const DROPDOWN_OPTIONS = [
  { label: '', text: 'Clear', category: 'none' },
  { label: 'P', text: 'Present', category: 'cell-present' },

  { label: 'L', text: 'Casual Leave (Full)', category: 'cell-leave' },
  { label: 'L1', text: 'Casual Leave 1st Half', category: 'cell-leave' },
  { label: 'L2', text: 'Casual Leave 2nd Half', category: 'cell-leave' },

  { label: 'SL', text: 'Sick Leave (Full)', category: 'cell-sick' },
  { label: 'SL1', text: 'Sick Leave 1st Half', category: 'cell-sick' },
  { label: 'SL2', text: 'Sick Leave 2nd Half', category: 'cell-sick' },

  { label: 'W', text: 'Work From Home', category: 'cell-wfh' },
  { label: 'C', text: 'Comp Off', category: 'cell-compoff' },
];

export const AttendanceCell = ({
  employeeId,
  day,
  cell,
  isOpen,
  onToggleOpen,
  onChange,
}) => {
  const isHoliday = day.isHoliday;
  const isSaturdayOff = day.isSaturdayOff;

  const status = cell?.status ?? null;
  let cellClass = 'attendance-cell';

  
// 🔴 Weekend / Saturday off
if (isSaturdayOff && !isHoliday) {
  cellClass += ' cell-weekend';
}

// 🟣 Holiday
if (isHoliday) {
  cellClass += ' cell-holiday';
}

// 🟢 Casual Leave
if (
  status === 'casual_leave' ||
  status === 'half_day_casual_1' ||
  status === 'half_day_casual_2'
) {
  cellClass += ' cell-leave';
}

// 🔵 Sick Leave
if (
  status === 'sick_leave' ||
  status === 'sick_leave_1' ||
  status === 'sick_leave_2'
) {
  cellClass += ' cell-sick';
}

// 🟡 WFH
if (status === 'wfh') {
  cellClass += ' cell-wfh';
}

  let displayedLabel = status ? STATUS_LABELS[status] : '';

  if (isHoliday) displayedLabel = 'H';
  if (isSaturdayOff && !isHoliday) displayedLabel = 'S';

  const isLocked = day.locked || isHoliday || isSaturdayOff;

  const handleCellClick = () => {
    if (isLocked) return;
    onToggleOpen();
  };

  const handleOptionSelect = (label) => {
    const newStatus = LABEL_TO_STATUS[label];
    onChange(employeeId, day.date, newStatus);
    onToggleOpen();
  };

  return (
    <td
    className={cellClass}
    //   className={[
    //     cellClass,
    //     'attendance-cell',
    //     isHoliday ? 'cell-holiday' : '',
    //     isSaturdayOff ? 'cell-saturday' : '',
    //     isLocked ? 'cell-locked' : '',
    //     isOpen ? 'cell-open' : '',
    //   ].join(' ')}
      onClick={handleCellClick}
    >
      <div className="attendance-cell-display">
        {displayedLabel}
      </div>
      {isOpen && !isLocked && (
        <div className="attendance-dropdown" onClick={e => e.stopPropagation()}>
          {DROPDOWN_OPTIONS.map(opt => (
            <div
              key={opt.label}
              className="attendance-dropdown-item"
              onClick={() => handleOptionSelect(opt.label)}
            >
              <span className={`legend-dot ${opt.category}`} />
              <span className="code">{opt.label || '-'}</span>
              <span className="label">{opt.text}</span>
            </div>
          ))}
        </div>
      )}
    </td>
  );
};
