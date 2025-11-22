import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useQuery } from 'react-query';
import { getHolidays } from '@/apis';
import HolidaysAndLeaves from './HolidaysAndLeaves';
import SaturdayOffs from './SaturdayOffs';

const Settings = () => {
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [selectedSite, setSelectedSite] = useState(null)
  const month = new Date()
  const year = month.getFullYear();
  const [holidays, setHolidays] = useState([
    { id: 1, description: "Republic Day", holiday_date: new Date(2025, 0, 26) },
    { id: 2, description: "Holi", holiday_date: new Date(2025, 2, 14) },
  ]);

  const accordianItems = [
    {
      component : <HolidaysAndLeaves selectedBranch = {selectedBranch} selectedSite = {selectedSite} year = {year} month = {month} setHolidays = {setHolidays} holidays = {holidays} />,
      label: "Holdidays and Leaves"
    },
    {
      component : <SaturdayOffs selectedBranch = {selectedBranch} selectedSite = {selectedSite} year = {year} month = {month} holidays = {holidays} />,
      label: "Saturday Offs"
    }
  ]


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


  return (
    <div className="px-6 xl:px-8 2xl:px-10 py-6 w-full">
    <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">Settings</h2>
    <Accordion
      type="single"
      collapsible
      className="w-full"
    >
      {accordianItems.map((item, index) => {
        return (
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="cursor-pointer text-base">{item.label}</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {item.component}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
    </div>
  )
}

export default Settings
