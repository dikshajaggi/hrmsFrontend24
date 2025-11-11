import { Home, Users, Calendar, Building2, Settings, FolderClosed, IndianRupee, SquareChartGantt, UserStar} from 'lucide-react';


export const dashboardSidebar = [
    {main: "Dashboard", path: "/dashboard", icon: Home},
    {main: "Employee Management", path: "/dashboard/emp-management", icon: Users},
    {main: "Attendance & Leave", path: "/dashboard/attendance-management", icon: SquareChartGantt},
    {main: "Payroll & Reimbursements", path: "/dashboard/payroll", icon: IndianRupee},
    {main: "Holiday & Events", path: "/dashboard/holiday-management", icon: Calendar},
    {main: "Organisation Management", path: "/dashboard/org-management", icon: Building2},
    {main: "Documents & Policies", path: "/dashboard/policies", icon: FolderClosed},
    {main: "Role & Access", path: "/dashboard/role-management", icon: UserStar},
    {main: "Settings", path: "/dashboard/settings", icon: Settings}
]