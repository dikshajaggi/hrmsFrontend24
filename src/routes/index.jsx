import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import RootLayout from '@/layouts/RootLayout';
import AttendanceManagement from '@/pages/dashboard/AttendanceManagement';
import Dashboard from '@/pages/dashboard/Dashboard';
import EmployeeManagement from '@/pages/dashboard/EmployeeManagement';
import HolidayManagement from '@/pages/dashboard/HolidayManagement';
import OrgSetup from '@/pages/dashboard/OrgSetup';
import PayrollManagement from '@/pages/dashboard/PayrollManagement';
import PoliciesManagement from '@/pages/dashboard/PoliciesManagement';
import RoleManagement from '@/pages/dashboard/RoleManagement';
import Settings from '@/pages/dashboard/Settings';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

import { 
  createBrowserRouter, 
} from 'react-router-dom';

// Define routes as objects
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> }
        ]
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "emp-management", element: <EmployeeManagement /> },
          { path: "attendance-management", element: <AttendanceManagement /> },
          { path: "role-management", element: <RoleManagement /> },
          { path: "policies", element: <PoliciesManagement /> },
          { path: "holiday-management", element: <HolidayManagement /> },
          { path: "payroll", element: <PayrollManagement /> },
          { path: "org-management", element: <OrgSetup />},
          { path: "settings", element: <Settings /> },
        ]
      },
      { path: "*", element: <NotFound /> } 
    ]
  }
]);

export default router