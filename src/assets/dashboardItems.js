import { Home, Users, Calendar, Building2, Settings, FolderClosed, IndianRupee, SquareChartGantt, UserStar} from 'lucide-react';


export const dashboardSidebar = [
    {main: "Dashboard", path: "/dashboard", icon: Home},
    {main: "Employee Management", path: "/dashboard/emp-management", icon: Users},
    {main: "Attendance & Leave", path: "/dashboard/attendance-management", icon: SquareChartGantt},
    {main: "Payroll & Reimbursements", path: "/dashboard/payroll", icon: IndianRupee},
    // {main: "Holiday & Events", path: "/dashboard/holiday-management", icon: Calendar},
    {main: "Organisation Setup", path: "/dashboard/org-management", icon: Building2},
    {main: "Documents & Policies", path: "/dashboard/policies", icon: FolderClosed},
      {
        main: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
        children: [
        { main: "General", path: "/dashboard/settings" },
        { main: "Holidays & Leaves", path: "/dashboard/settings/holiday-leave-policies" },
        { main: "Saturday Off Rules", path: "/dashboard/settings/saturday-off" },
        // { main: "Attendance Rules", path: "/dashboard/settings/attendance" },
        { main: "Role & Access", path: "/dashboard/settings/roles" }
        ]
    }
]