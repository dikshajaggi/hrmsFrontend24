import { Building2, Briefcase, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/utils/profile";

export const ProfileHeader = ({ employee, userRole }) => {
  const {
    name,
    employee_code,
    status,
    designation,
    department,
    branch,
    projectSite,
  } = employee;

  const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-200 text-gray-600",
    retired: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
            <Avatar className="h-16 w-16">
                <AvatarImage src="/user.jpg" />
                <AvatarFallback className="text-2xl font-semibold">{getInitials(name)}</AvatarFallback>
            </Avatar>

          {/* Identity */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {name}
            </h1>

            <div className="text-sm text-gray-500 flex flex-wrap gap-x-2 gap-y-1">
              <span>{employee_code}</span>
              {designation && (
                <>
                  <span>•</span>
                  <span>{designation.designation_name}</span>
                </>
              )}
            </div>

            {/* Org info */}
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
              {department && (
                <span className="flex items-center gap-1">
                  <Briefcase size={12} />
                  {department.department_name}
                </span>
              )}
              {branch && (
                <span className="flex items-center gap-1">
                  <Building2 size={12} />
                  {branch.branch_name}
                </span>
              )}
              {projectSite && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {projectSite.site_name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Status */}
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${statusStyles[status]}`}
          >
            {status}
          </span>

          {/* HR-only actions */}
          {userRole === "HR" && (
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Change Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const TABS = [
  { id: "personal", label: "Personal Details" },
  { id: "job", label: "Job Details" },
  { id: "bank", label: "Bank & Payroll" },
  { id: "documents", label: "Documents" },
];

export const ProfileTabs = ({ activeTab, onChange }) => {
  return (
    <div className="border-b bg-white sticky top-0 z-10 py-4 mt-6 mb-6">
      <div className="flex gap-6 px-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative py-4 text-sm font-medium whitespace-nowrap
                transition-colors cursor-pointer
                ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};


export const StickySaveBar = ({
  visible,
  saving,
  onSave,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Left info */}
        <div className="flex items-center gap-2 text-sm text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          Unsaved changes
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
