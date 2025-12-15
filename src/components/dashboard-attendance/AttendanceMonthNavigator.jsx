// src/components/attendance/MonthNavigator.tsx
import React from 'react';
import "./attendance.css"
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="flex items-center gap-1">
      <ChevronLeft  className={`cursor-pointer transition-opacity duration-200
    ${canGoPrev ? 'text-neutral-900 opacity-100' : 'text-neutral-400 opacity-40 pointer-events-none'}`} onClick={handlePrev} disabled={!canGoPrev} />
      <div className="w-36 text-center font-semibold text-lg">
        {MONTH_NAMES[month]} {year}
      </div>
      <ChevronRight  className={`cursor-pointer transition-opacity duration-200
    ${canGoNext ? 'text-neutral-900 opacity-100' : 'text-neutral-400 opacity-40 pointer-events-none'}`} onClick={handleNext} disabled={!canGoNext} /> 
    </div>
  );
};
