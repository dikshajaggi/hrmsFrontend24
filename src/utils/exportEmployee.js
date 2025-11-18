export const transformDataForExport = (data) => {
  return data.map((item) => ({
    employee_code: item.employee_code || "",
    name: item.name || "",
    designation: item.designation?.designation_name || "",
    department: item.department?.department_name || "",
    branch: item.branch?.branch_name || "",
    project_site: item.projectSite?.site_name || "",
    employment_type: item.job_details?.employment_type || "",
  }));
};


export const EXPORT_COLUMNS = [
  { key: "employee_code", label: "Employee Code" },
  { key: "name", label: "Name" },
  { key: "designation", label: "Designation" },
  { key: "department", label: "Department" },
  { key: "branch", label: "Branch" },
  { key: "project_site", label: "Project Site" },
  { key: "employment_type", label: "Employment Type" },
];
