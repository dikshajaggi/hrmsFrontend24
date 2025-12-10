// src/components/attendance/MonthNavigator.tsx
import React from 'react';
import "./attendance.css"

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AttendanceMonthNavigator = ({
  month,
  year,
  minYear,
  maxYear,
  onChange,
}) => {
  const canGoPrev = !(year === minYear && month === 0);
  const canGoNext = !(year === maxYear && month === 11);

  const handlePrev = () => {
    if (!canGoPrev) return;
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    onChange(newMonth, newYear);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    onChange(newMonth, newYear);
  };

  return (
    <div className="attendance-month-nav">
      <button onClick={handlePrev} disabled={!canGoPrev}>
         Prev
      </button>
      <div className="attendance-month-label">
        {MONTH_NAMES[month]} {year}
      </div>
      <button onClick={handleNext} disabled={!canGoNext}>
        Next 
      </button>
    </div>
  );
};
