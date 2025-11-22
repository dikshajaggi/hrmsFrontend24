import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getHolidays, getSaturdayOffCustomRule, getSaturdayRule, setSaturdayOffCustomRule, setSaturdayOffRule } from "@/apis";


const AttendanceSettings = () => {
const [selectedBranch, setSelectedBranch] = useState(null)
const [selectedSite, setSelectedSite] = useState(null)
const month = new Date()
const year = month.getFullYear();
const [customSelectedDates, setCustomSelectedDates] = useState([]); 


const { data: holidays1 = [] } = useQuery(
  [
    "holidays",
    {
      branch_id: null ,
      site_id: null ,
      year: year
    },
  ],
  getHolidays,
  { refetchOnWindowFocus: false }
);

const {data: satOffRule = [] } = useQuery(
  [
    "satOffRule",
    {
      branch_id: null ,
      site_id: null ,
    }
  ], 
  getSaturdayRule,
 { refetchOnWindowFocus: false }
)



console.log(satOffRule.rule, "satOffRule")

const { mutate: setSelectedRule } = useMutation(setSaturdayOffRule, {
  onSuccess: (data) => {
    console.log("Saved:", data);
    // toast.success("Saturday rule saved!");
  },
  onError: () => {
    // toast.error("Failed to save rule");
    console.error("Failed to save rule");
  }
});

const { mutate: saveCustomOverrides } = useMutation(
  setSaturdayOffCustomRule,
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["satOffRule"]);
      // toast.success("Custom Saturday OFF saved");
    }
  }
);

  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const [holidays, setHolidays] = useState([
    { id: 1, description: "Republic Day", holiday_date: new Date(2025, 0, 26) },
    { id: 2, description: "Holi", holiday_date: new Date(2025, 2, 14) },
  ]);

  const [offRule, setOffRule] = useState(null);

  const [leavePolicy, setLeavePolicy] = useState({
    casual: 1,
    sick: 1,
    carryForward: true,
  });

  const { data: getSatOffRule = [] } = useQuery(
    [
      "getSatOffRule",
      {
        branch_id: null,
        site_id: null,
        year: year,
        month: month.getMonth()
      }
    ],
    getSaturdayOffCustomRule, 
    { enabled: offRule === "Custom Rule" }
  );

console.log(getSatOffRule, "getSatOffRule")

  const handleAddHoliday = () => {
    setHolidays([...holidays, { id: Date.now(), description: "", holiday_date: new Date() }]);
  };
  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

 const handleSave = () => {
  // Permanent rules
  if (offRule === "2nd & 4th Saturdays") {
    setSelectedRule({
      branch_id: selectedBranch,
      site_id: selectedSite,
      off_saturdays: [2, 4],
    });
    return;
  }

  if (offRule === "All Saturdays") {
    setSelectedRule({
      branch_id: selectedBranch,
      site_id: selectedSite,
      off_saturdays: [1, 2, 3, 4, 5],
    });
    return;
  }

  // Custom: Month-specific
  if (offRule === "Custom Rule") {
    const datesToSend = customSelectedDates.map(d =>
      new Date(d).toISOString().slice(0,10)
    );

    saveCustomOverrides({
      branch_id: selectedBranch,
      site_id: selectedSite,
      year,
      month: month.getMonth(),
      dates: datesToSend
    });
  }
};


useEffect(() => {
  if (!satOffRule?.rule?.off_saturdays) return;

  const arr = satOffRule.rule.off_saturdays;

  // all sat = [1,2,3,4,5]
  if (arr.length === 5 && arr.includes(1) && arr.includes(5)) {
    setOffRule("All Saturdays");
    return;
  }

  // 2nd & 4th -----> [2,4]
  if (arr.length === 2 && arr.includes(2) && arr.includes(4)) {
    setOffRule("2nd & 4th Saturdays");
    return;
  }

  // otherwise-----> custom
  setOffRule("Custom Rule");

}, [satOffRule]);


  useEffect(() => {
    setHolidays(holidays1)
  }, [holidays1])

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
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

      {/* 2️⃣ Saturday Off Rule */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Saturday Off Rule
        </h3>
        <button onClick={handleSave} >Save Changes</button>
        <p className="text-xs mb-4 text-gray-500">*This will be applied to all the months except the <b>custom rule</b></p>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            "All Saturdays",
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
        {offRule === "Custom Rule" && <SaturdayOffCalendar bankHolidays={holidays.map((h) => h.holiday_date)}  setCustomSelectedDates={(dates) => setCustomSelectedDates(dates)} getSatOffRule={getSatOffRule} />}

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
