import { getHolidays, getSaturdayOffCustomRule, getSaturdayRule, setSaturdayOffCustomRule, setSaturdayOffRule } from '@/apis';
import SaturdayOffCalendar from '@/components/CustomSaturdaySelector';
import SaturdayMonthlySummary from '@/components/SaturdayMonthlySummary';
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';

const saturdaySummary = [
  {
    month: "January 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Jan 2025", "25 Jan 2025"]
  },
  {
    month: "February 2025",
    rule: "Custom Rule",
    dates: ["08 Feb 2025", "29 Feb 2025"]
  },
   {
    month: "March 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Mar 2025", "25 Mar 2025"]
  },
  {
    month: "April 2025",
    rule: "Custom Rule",
    dates: ["08 Apr 2025", "29 Apr 2025"]
  },
   {
    month: "May 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 May 2025", "25 May 2025"]
  },
  {
    month: "June 2025",
    rule: "Custom Rule",
    dates: ["08 Jun 2025", "29 Jun 2025"]
  },
   {
    month: "July 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Jul 2025", "25 Jul 2025"]
  },
   {
    month: "August 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Aug 2025", "25 Aug 2025"]
  },
   {
    month: "September 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Sept 2025", "25 Sept 2025"]
  },
  {
    month: "October 2025",
    rule: "2nd & 4th Saturdays",
    dates: ["11 Oct 2025", "25 Oct 2025"]
  },
  {
    month: "November 2025",
    rule: "Custom Rule",
    dates: ["08 Nov 2025", "29 Nov 2025"]
  },
  {
    month: "December 2025",
    rule: "Custom Rule",
    dates: ["13 Dec 2025", "27 Dec 2025"]
  },
  {
    month: "January 2026",
    rule: "2nd & 4th Saturdays",
    dates: ["10 Jan 2026", "24 Jan 2026"]
  }
];


const SaturdayOffs = () => {
  
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const month = new Date()
  const year = month.getFullYear();
  const [holidays, setHolidays] = useState([
    { id: 1, description: "Republic Day", holiday_date: new Date(2025, 0, 26) },
    { id: 2, description: "Holi", holiday_date: new Date(2025, 2, 14) },
  ]);


  const { data: holidays1 = [] } = useQuery(
    [
      "holidays",
      {
        branch_id: selectedBranch ,
        site_id: selectedSite ,
        year: year
      },
    ],
    getHolidays,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    setHolidays(holidays1)
  }, [holidays1])


    const queryClient = useQueryClient();
    const [customSelectedDates, setCustomSelectedDates] = useState([]); 

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

  const [offRule, setOffRule] = useState(null);

  
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



    const handleSave = () => {
    setCustomSelectedDates([])
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

  return (
    <>
    {/*  Saturday Off Rule */}
      <div className="p-6">
        <div className='w-full flex items-center justify-between'>        
          <h3 className="text-lg font-semibold text-gray-800">
            Saturday Off Rule
          </h3>
          <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">Save Changes</button>
        </div>
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
        <SaturdayMonthlySummary summary={saturdaySummary} />

      </div>
    </>
  )
}

export default SaturdayOffs
