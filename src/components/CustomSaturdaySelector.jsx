import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

const SaturdayOffCalendar = ({ bankHolidays = [] }) => {
    const [selectedOffs, setSelectedOffs] = useState([]);
    console.log(bankHolidays, "bankHolidays")
    // 🟨 Check if date is a bank holiday
    const isBankHoliday = (date) =>
    bankHolidays.some((h) => {
        const holidayDate =
        typeof h === "string"
            ? new Date(h)
            : h.date
            ? new Date(h.date)
            : new Date(h);
        return holidayDate.toDateString() === date.toDateString();
    });

    // 🟥 Check if Sunday / Saturday
    const isSunday = (date) => date.getDay() === 0;
    const isSaturday = (date) => date.getDay() === 6;

    // 🧠 Allow toggling only for Saturdays
    const toggleCustomOff = (date) => {
        if (!isSaturday(date)) return; // disable other days
        const exists = selectedOffs.some(
        (d) => d.toDateString() === date.toDateString()
        );
        if (exists) {
        setSelectedOffs(selectedOffs.filter((d) => d.toDateString() !== date.toDateString()));
        } else {
        setSelectedOffs([...selectedOffs, date]);
        }
    };

    // 🎨 Custom tile styling based on rules
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
        const isHoliday = isBankHoliday(date);
        const isSelectedOff = selectedOffs.some(
            (d) => d.toDateString() === date.toDateString()
        );

        if (isHoliday) return "bank-holiday-tile"; // yellow
        if (isSunday(date) || isSelectedOff) return "offday-tile"; // red
        if (isSaturday(date)) return "clickable-saturday"; // for cursor hint
        }
        return "";
    };

    return (
        <div className="mt-6 flex flex-col items-center">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
            Mark Custom Saturday Offs
        </h4>

       <div className={`w-full flex justify-evenly ${selectedOffs.length === 0 ? "items-center" : "items-start"}`}>
            {/* Calendar */}
            <Calendar
                onClickDay={toggleCustomOff}
                tileClassName={tileClassName}
                prev2Label={null}
                next2Label={null}
                className="rounded-xl border border-gray-200 p-3 shadow-sm"
                tileDisabled={({ date }) => !isSaturday(date)} // disable all except Saturdays
            />

            {selectedOffs.length === 0 && <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    No Saturday Offs selected
                </h4>}

            {/* Selected Custom Off List */}
            {selectedOffs.length > 0 && (
                <div className="mt-6 w-full max-w-md">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Selected Saturday Offs:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 border-t border-gray-100 pt-2">
                    {selectedOffs.map((date) => (
                    <li key={date.toString()} className="flex justify-between">
                        <span>{format(date, "dd MMM yyyy")}</span>
                        <span className="text-xs text-gray-500">
                        Saturday #{Math.ceil(date.getDate() / 7)}
                        </span>
                    </li>
                    ))}
                </ul>
                </div>
            )}
       </div>

        <style>{`
            .react-calendar__tile {
            border-radius: 6px;
            transition: all 0.2s ease;
            }

            /* Disable hover for non-Saturdays */
            .react-calendar__tile:disabled {
            background-color: #f9fafb !important;
            color: #9ca3af !important;
            cursor: not-allowed;
            }

            /* Bank Holidays - Yellow */
            .bank-holiday-tile {
            background-color: #fde68a !important; /* yellow-300 */
            color: #78350f !important; /* yellow-900 */
            border-radius: 6px;
            font-weight: 500;
            }

            /* Sunday + Saturday Off - Red */
            .offday-tile {
            background-color: #fecaca !important; /* red-200 */
            color: #7f1d1d !important; /* red-900 */
            border-radius: 6px;
            font-weight: 500;
            }

            /* Clickable Saturday hover */
            .clickable-saturday:hover {
            background-color: #e0f2fe !important; /* light blue hover */
            color: #0369a1 !important; /* blue-700 */
            cursor: pointer;
            }

            /* Today highlight */
            .react-calendar__tile--now {
            border: 1px solid #3b82f6 !important;
            background: #eff6ff !important;
            color: #1e3a8a !important;
            }

            /* Responsive calendar */
            .react-calendar {
            width: 100%;
            max-width: 420px;
            }
        `}</style>
        </div>
  );
};

export default SaturdayOffCalendar;
