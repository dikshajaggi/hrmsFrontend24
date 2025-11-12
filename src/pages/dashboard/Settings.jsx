import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  Upload,
  Settings,
  Save,
  RefreshCcw,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SaturdayOffCalendar from "@/components/CustomSaturdaySelector";
import ImportDataModal from "@/components/common/ImportDataModal";
import { Checkbox } from "@/components/ui/checkbox"


const AttendanceSettings = () => {
  const [showModal, setShowModal] = useState(false);

  const [holidays, setHolidays] = useState([
    { id: 1, name: "Republic Day", date: new Date(2025, 0, 26) },
    { id: 2, name: "Holi", date: new Date(2025, 2, 14) },
  ]);

  const [offRule, setOffRule] = useState("2nd & 4th Saturdays");

  const [leavePolicy, setLeavePolicy] = useState({
    casual: 1,
    sick: 1,
    carryForward: true,
  });

  const handleAddHoliday = () => {
    setHolidays([...holidays, { id: Date.now(), name: "", date: new Date() }]);
  };
  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };


  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="text-blue-600" size={22} />
          Attendance Settings
        </h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <RefreshCcw size={16} /> Sync Changes
        </button>
      </div>

      {/* 1️⃣ Bank Holidays */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="text-blue-500" size={18} />
            Bank Holidays
          </h3>

          <div className="flex items-center gap-3">
           <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition cursor-pointer">
            <Upload size={16} />
            Upload Data
          </button>

            <button
              onClick={handleAddHoliday}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
            >
              <Plus size={16} /> Add Holiday
            </button>
          </div>
        </div>

        {showModal && (
          <ImportDataModal setShowModal={setShowModal}  />
        )}


        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3 w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <tr
                  key={holiday.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-3">
                    <DatePicker
                      selected={holiday.date}
                      onChange={(date) =>
                        setHolidays((prev) =>
                          prev.map((h) =>
                            h.id === holiday.id ? { ...h, date } : h
                          )
                        )
                      }
                      dateFormat="dd MMM yyyy"
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-[150px]"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={holiday.name}
                      onChange={(e) =>
                        setHolidays((prev) =>
                          prev.map((h) =>
                            h.id === holiday.id
                              ? { ...h, name: e.target.value }
                              : h
                          )
                        )
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-full"
                      placeholder="Holiday name"
                    />
                  </td>
                  <td className="py-2 px-3 text-gray-500">
                    <button onClick={() => handleDeleteHoliday(holiday.id)}>
                      <Trash2 size={16} className="hover:text-red-600 transition cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2️⃣ Saturday Off Rule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Saturday Off Rule
        </h3>
        <p className="text-xs mb-4 text-gray-500">*This will be applied to all the months except the <b>custom rule</b></p>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            "All Saturdays",
            "Alternate Saturdays",
            "2nd & 4th Saturdays",
            "Custom Rule",
          ].map((rule) => (
            <label
              key={rule}
              className={`border rounded-lg px-4 py-2 cursor-pointer transition ${
                offRule === rule
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                value={rule}
                checked={offRule === rule}
                onChange={() => setOffRule(rule)}
                className="hidden"
              />
              {rule}
            </label>
          ))}
        </div>

        {/* Custom Saturdays Calendar */}
        {offRule === "Custom Rule" && <SaturdayOffCalendar bankHolidays={holidays.map((h) => h.date)}/>}

      </div>

      {/* 3️⃣ Leave Policy */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Leave Policy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Casual Leaves / Month
            </label>
            <input
              type="number"
              min="0"
              value={leavePolicy.casual}
              onChange={(e) =>
                setLeavePolicy({ ...leavePolicy, casual: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Sick Leaves / Month
            </label>
            <input
              type="number"
              min="0"
              value={leavePolicy.sick}
              onChange={(e) =>
                setLeavePolicy({ ...leavePolicy, sick: e.target.value })
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center mt-6 gap-2">
             <Checkbox
              checked={leavePolicy.carryForward}
              onCheckedChange={(checked) =>
                setLeavePolicy({ ...leavePolicy, carryForward: checked })
              }
              className="cursor-pointer data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            />
            <label className="text-sm text-gray-700">
              Carry forward unused leaves between months
            </label>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          *Leave balances reset automatically every <b>January 1st</b>.
        </p>

        <div className="mt-6">
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
            <Save size={16} /> Save Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSettings;
