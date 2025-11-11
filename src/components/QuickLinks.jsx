import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, FileSliders, Tent, FolderKanban, Banknote } from 'lucide-react'
import { Link } from 'react-router-dom'

const QuickLinks = () => {
    const links = [
        {
            title: "View Monthly Attendance Report",
            link: "#",
            icon: FileSliders
        }, 
        {
            title: "Update Company Holidays",
            link: "#",
            icon: Tent
        }, 
        {
            title: "Manage Branches / Departments",
            link: "#",
            icon: FolderKanban
        }, 
        {
            title: "View All Payslips",
            link: "#",
            icon: Banknote
        }
    ]
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md">
      <CardHeader className="flex items-center gap-2">
        <Link2 className="text-amber-600" size={20} />
        <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
      </CardHeader>
        <CardContent className="flex flex-col"> {
        links.map((item, index) => { 
            const Icon = item.icon 
            return ( 
                <Link key={index} to={item.link} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200" > 
                    <Icon size={20} className="text-blue-500" /> <span className="text-black">{item.title}</span> 
                </Link> 
            ) 
        })} 
        </CardContent>
    </Card>
  )
}

export default QuickLinks
