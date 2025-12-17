import { useState } from "react";
import { Badge, Input, Select } from "../AddEmployeeReusable";
import { User } from "lucide-react";

export default function EmployeeEdit({
  employee,
  branches,
  departments,
  designations,
  projectSites,
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState({
    name: employee.name || "",
    branch_id: employee.branch_id || "",
    department_id: employee.department_id || "",
    designation_id: employee.designation_id || "",
    project_site_id: employee.project_site_id || "",
    job_details: {
      notice_period_days:
        employee.job_details?.notice_period_days ?? 0,
    },
    personal_details: {
      email: employee.personal_details?.email || "",
      contact: employee.personal_details?.contact || "",
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
    //   await updateEmployee(employee.employee_id, form);
      onSave(form);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

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

      {/* BASIC */}
      <Section title="Basic Details">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Section>

      {/* ORGANIZATION */}
      <Section title="Organization">
        <Select
          label="Branch"
          options={branches}
          value={form.branch_id}
          onChange={(e) =>
            handleChange("branch_id", Number(e.target.value))
          }
          optionLabel="branch_name"
          optionValue="branch_id"
        />

        <Select
          label="Department"
          options={departments}
          value={form.department_id}
          onChange={(e) =>
            handleChange("department_id", Number(e.target.value))
          }
          optionLabel="department_name"
          optionValue="department_id"
          disabled={!form.branch_id}
        />

        <Select
          label="Designation"
          options={designations}
          value={form.designation_id}
          onChange={(e) =>
            handleChange("designation_id", Number(e.target.value))
          }
          optionLabel="designation_name"
          optionValue="designation_id"
        />

        <Select
          label="Project Site"
          options={projectSites}
          value={form.project_site_id}
          onChange={(e) =>
            handleChange("project_site_id", Number(e.target.value))
          }
          optionLabel="site_name"
          optionValue="site_id"
        />
      </Section>

      {/* JOB */}
      <Section title="Job Details">
        <Input
          label="Notice Period (days)"
          type="number"
          min={0}
          value={form.job_details.notice_period_days}
          onChange={(e) =>
            handleNestedChange(
              "job_details",
              "notice_period_days",
              Math.max(0, Number(e.target.value))
            )
          }
        />
      </Section>

      {/* PERSONAL */}
      <Section title="Personal Details">
        <Input
          label="Email"
          type="email"
          value={form.personal_details.email}
          onChange={(e) =>
            handleNestedChange(
              "personal_details",
              "email",
              e.target.value
            )
          }
        />

        <Input
          label="Phone"
          value={form.personal_details.contact}
          onChange={(e) =>
            handleNestedChange(
              "personal_details",
              "contact",
              e.target.value
            )
          }
        />
      </Section>

      {/* ACTIONS */}
      <div className="sticky bottom-0 bg-white border-t pt-4 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* helpers */
const Section = ({ title, children }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
      {title}
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);
