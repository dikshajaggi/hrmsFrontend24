import React, { useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {
  Plus,
  Trash2,
  CalendarDays,
  Upload,
  Save,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import ImportDataModal from '@/components/common/ImportDataModal';
import { useQueryClient } from 'react-query';

const HolidaysAndLeaves = ({holidays, setHolidays}) => {
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [leavePolicy, setLeavePolicy] = useState({
    casual: 1,
    sick: 1,
    carryForward: true,
    });

    const handleAddHoliday = () => {
        setHolidays([...holidays, { id: Date.now(), description: "", holiday_date: new Date() }]);
    };
    const handleDeleteHoliday = (id) => {
        setHolidays(holidays.filter((h) => h.id !== id));
    };

  return (
    <div>
    {/*------------------------------------------- Bank Holidays -------------------------------------------*/}
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
          <ImportDataModal setShowModal={setShowModal}  importType="master/holidays-data"
          onSuccess={() => queryClient.invalidateQueries(["holidays"])} />
        )}


        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="text-left py-2 px-3">Date</th>
                <th className="text-left py-2 px-3">Holiday</th>
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
                      selected={holiday.holiday_date}
                      onChange={(date) =>
                        setHolidays((prev) =>
                          prev.map((h) =>
                            h.id === holiday.id ? { ...h, holiday_date: date} : h
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
                      value={holiday.description}
                      onChange={(e) =>
                        setHolidays((prev) =>
                          prev.map((h) =>
                            h.id === holiday.id
                              ? { ...h, description: e.target.value }
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

    {/* ------------------------------------------- Leave Policy -------------------------------------------*/}
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
  )
}

export default HolidaysAndLeaves
