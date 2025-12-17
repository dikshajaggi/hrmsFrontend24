import { User } from "lucide-react";
import { Badge, Card, Info } from "../AddEmployeeReusable";

export default function EmployeeView({ employee }) {
  if (!employee) return null;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="text-gray-500" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {employee.name}
          </h2>
          <div className="flex gap-2 mt-1">
            <Badge>{employee.employee_code}</Badge>
            <Badge
              tone={employee.status === "active" ? "green" : "gray"}
            >
              {employee.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <Card title="Organization">
        <Info label="Branch" value={employee.branch?.branch_name} />
        <Info label="Department" value={employee.department?.department_name} />
        <Info
          label="Designation"
          value={employee.designation?.designation_name}
        />
        <Info label="Project Site" value={employee.projectSite?.site_name} />
      </Card>

      <Card title="Job Details">
        <Info
          label="Employment Type"
          value={employee.job_details?.employment_type}
        />
        <Info
          label="Reporting Manager"
          value={employee.job_details?.manager?.name}
        />
        <Info
          label="Notice Period"
          value={`${employee.job_details?.notice_period_days || 0} days`}
        />
      </Card>

      <Card title="Personal">
        <Info label="Email" value={employee.personal_details?.email} />
        <Info label="Phone" value={employee.personal_details?.contact} />
        <Info label="Gender" value={employee.gender} />
      </Card>
    </div>
  );
}
