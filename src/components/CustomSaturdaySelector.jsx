import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

const SaturdayOffCalendar = ({
  bankHolidays = [],
  getSatOffRule = [],
  setCustomSelectedDates
}) => {

  // Store selected saturdays as STRING dates in yyyy-mm-dd format
  const [selectedOffs, setSelectedOffs] = useState([]);

  // Helper: Convert JS Date → 'yyyy-mm-dd'
 const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  // Helper: Convert yyyy-mm-dd → Date (for render only)
const toDateObj = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d); // local date, no shift
};

  // INITIAL PRELOAD (from backend)
  useEffect(() => {
    if (!getSatOffRule || getSatOffRule.length === 0) return;

    const presetDates = getSatOffRule.overrides.map((o) =>
        toDateString(new Date(o.override_date))   // remove .toISOString way
    );

    setSelectedOffs(presetDates);
  }, [getSatOffRule]);

  // Send selected dates back to parent
  useEffect(() => {
    setCustomSelectedDates(selectedOffs); // safe string dates
  }, [selectedOffs]);

  // Bank holiday comparison
  const isBankHoliday = (date) =>
    bankHolidays.some((h) => {
      const holidayDate = typeof h === "string" ? new Date(h) : new Date(h);
      return toDateString(holidayDate) === toDateString(date);
    });

  const isSunday = (date) => date.getDay() === 0;
  const isSaturday = (date) => date.getDay() === 6;

  // Toggle Saturday (store only strings)
  const toggleCustomOff = (date) => {
    if (!isSaturday(date)) return;

    const dateStr = toDateString(date);

    if (selectedOffs.includes(dateStr)) {
      setSelectedOffs(selectedOffs.filter((d) => d !== dateStr));
    } else {
      setSelectedOffs([...selectedOffs, dateStr]);
    }
  };

  // Style calendar cells
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return "";

    const dateStr = toDateString(date);

    const isHoliday = isBankHoliday(date);
    const isSelected = selectedOffs.includes(dateStr);

    if (isHoliday) return "bank-holiday-tile";
    if (isSunday(date) || isSelected) return "offday-tile";
    if (isSaturday(date)) return "clickable-saturday";

    return "";
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <h4 className="text-md font-semibold text-gray-800 mb-3">
        Mark Custom Saturday Offs
      </h4>

      <div
        className={`w-full flex justify-evenly ${
          selectedOffs.length === 0 ? "items-center" : "items-start"
        }`}
      >
        {/* Calendar */}
        <Calendar
          onClickDay={toggleCustomOff}
          tileClassName={tileClassName}
          prev2Label={null}
          next2Label={null}
          className="rounded-xl border border-gray-200 p-3 shadow-sm"
          tileDisabled={({ date }) => !isSaturday(date)}
        />

        {/* No selected offs */}
        {selectedOffs.length === 0 && (
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            No Saturday Offs selected
          </h4>
        )}

        {/* List of selected offs */}
        {selectedOffs.length > 0 && (
          <div className="mt-6 w-full max-w-md">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Selected Saturday Offs:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 border-t border-gray-100 pt-2">
              {selectedOffs.map((dateStr) => {
                const dateObj = toDateObj(dateStr);
                return (
                  <li key={dateStr} className="flex justify-between">
                    <span>{format(dateObj, "dd MMM yyyy")}</span>
                    <span className="text-xs text-gray-500">
                      Saturday #{Math.ceil(dateObj.getDate() / 7)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <style>{`
        .react-calendar__tile {
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .react-calendar__tile:disabled {
          background-color: #f9fafb !important;
          color: #9ca3af !important;
          cursor: not-allowed;
        }
        .bank-holiday-tile {
          background-color: #fde68a !important;
          color: #78350f !important;
          border-radius: 6px;
          font-weight: 500;
        }
        .offday-tile {
          background-color: #fecaca !important;
          color: #7f1d1d !important;
          border-radius: 6px;
          font-weight: 500;
        }
        .clickable-saturday:hover {
          background-color: #e0f2fe !important;
          color: #0369a1 !important;
          cursor: pointer;
        }
        .react-calendar__tile--now {
          border: 1px solid #3b82f6 !important;
          background: #eff6ff !important;
          color: #1e3a8a !important;
        }
        .react-calendar {
          width: 100%;
          max-width: 420px;
        }
      `}</style>
    </div>
  );
};

export default SaturdayOffCalendar;
