const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const ReadOnly = ({ value }) => (
  <div className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
    {value || "—"}
  </div>
);

const Input = ({ disabled, ...props }) => (
  <input
    {...props}
    disabled={disabled}
    className={`w-full rounded-lg border px-3 py-2 text-sm
      ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      }`}
  />
);

export const JobDetailsTab = ({
  master,
  job,
  role,
  onChange,
}) => {
  const isEditable = role === "HR" || role === "ADMIN";

  return (
    <div className="space-y-6">

      {/* EMPLOYMENT OVERVIEW */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Employment Overview
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Employee Code">
            <ReadOnly value={master.employee_code} />
          </Field>

          <Field label="Employment Type">
            {isEditable ? (
              <select
                value={job.employment_type}
                onChange={(e) => onChange("employment_type", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="consultant">Consultant</option>
                <option value="intern">Intern</option>
              </select>
            ) : (
              <ReadOnly value={job.employment_type} />
            )}
          </Field>

          <Field label="Status">
            <ReadOnly value={master.status} />
          </Field>
        </div>
      </section>

      {/* ORGANIZATION ASSIGNMENT */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Organization Assignment
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Department">
            <ReadOnly value={master.department?.department_name} />
          </Field>

          <Field label="Designation">
            <ReadOnly value={master.designation?.designation_name} />
          </Field>

          <Field label="Branch">
            <ReadOnly value={master.branch?.branch_name} />
          </Field>

          <Field label="Project Site">
            <ReadOnly value={master.projectSite?.site_name} />
          </Field>
        </div>
      </section>

      {/* REPORTING & CONTRACT */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Reporting & Contract
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Reporting Manager">
            <ReadOnly value={job.manager?.name} />
          </Field>

          <Field label="Probation Period">
            {isEditable ? (
              <Input
                value={job.probation_period || ""}
                onChange={(e) =>
                  onChange("probation_period", e.target.value)
                }
              />
            ) : (
              <ReadOnly value={job.probation_period} />
            )}
          </Field>

          <Field label="Notice Period (days)">
            {isEditable ? (
              <Input
                type="number"
                value={job.notice_period_days || ""}
                onChange={(e) =>
                  onChange("notice_period_days", e.target.value)
                }
              />
            ) : (
              <ReadOnly value={job.notice_period_days} />
            )}
          </Field>
        </div>
      </section>

    </div>
  );
};
