const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ disabled, ...props }) => (
  <input
    {...props}
    disabled={disabled}
    className={`w-full rounded-lg border px-3 py-2 text-sm
      ${disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      }`}
  />
);

export const PersonalDetailsTab = ({
  data,
  masterData,
  role,
  onChange,
}) => {
  const isEmployee = role === "EMPLOYEE";

  return (
    <div className="space-y-6">

      {/* BASIC INFO */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of Birth">
            <Input
              type="date"
              value={masterData.dob || ""}
              disabled={!isEmployee}
              onChange={(e) => onChange("dob", e.target.value)}
            />
          </Field>

          <Field label="Gender">
            <select
              disabled={!isEmployee}
              value={masterData.gender || ""}
              onChange={(e) => onChange("gender", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Blood Group">
            <Input
              value={data.blood_group || ""}
              onChange={(e) => onChange("blood_group", e.target.value)}
            />
          </Field>

          <Field label="Marital Status">
            <Input
              value={data.marital_status || ""}
              onChange={(e) => onChange("marital_status", e.target.value)}
            />
          </Field>

          <Field label="Anniversary Date">
            <Input
              type="date"
              value={data.anniversary_date || ""}
              onChange={(e) => onChange("anniversary_date", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone Number">
            <Input
              value={data.contact || ""}
              onChange={(e) => onChange("contact", e.target.value)}
            />
          </Field>

          <Field label="Email Address">
            <Input
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* ADDRESS */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Address Details
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Current Address">
            <textarea
              rows={3}
              value={data.current_address || ""}
              onChange={(e) => onChange("current_address", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Permanent Address">
            <textarea
              rows={3}
              value={data.permanent_address || ""}
              onChange={(e) => onChange("permanent_address", e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>
        </div>
      </section>

      {/* EMERGENCY CONTACT */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Emergency Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Name">
            <Input
              value={data.next_to_kin_name || ""}
              onChange={(e) => onChange("next_to_kin_name", e.target.value)}
            />
          </Field>

          <Field label="Relation">
            <Input
              value={data.next_to_kin_relation || ""}
              onChange={(e) => onChange("next_to_kin_relation", e.target.value)}
            />
          </Field>

          <Field label="Contact">
            <Input
              value={data.next_to_kin_contact || ""}
              onChange={(e) => onChange("next_to_kin_contact", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Identity Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Aadhaar Number">
            <Input
              value={data.aadhaar_no ? `•••• ${data.aadhaar_no.slice(-4)}` : ""}
              disabled
            />
          </Field>

          <Field label="PAN Number">
            <Input
              value={data.pan_no || ""}
              onChange={(e) => onChange("pan_no", e.target.value)}
            />
          </Field>
        </div>
      </section>

    </div>
  );
};
