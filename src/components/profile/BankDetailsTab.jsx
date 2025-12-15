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
      ${
        disabled
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      }`}
    />
);

export const BankPayrollTab = ({
  data,
  role,
  onChange,
  onVerify,
}) => {
  const isEmployee = role === "EMPLOYEE";
  const isHR = role === "HR" || role === "ADMIN";
  const isVerified = data.status === "verified";

  return (
    <div className="space-y-6">

      {/* BANK DETAILS */}
      <section className="bg-white border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Bank Account Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Account Holder Name">
            <Input
              value={data.account_holder_name || ""}
              disabled={!isEmployee || isVerified}
              onChange={(e) =>
                onChange("account_holder_name", e.target.value)
              }
            />
          </Field>

          <Field label="Bank Name">
            <Input
              value={data.bank_name || ""}
              disabled={!isEmployee || isVerified}
              onChange={(e) => onChange("bank_name", e.target.value)}
            />
          </Field>

          <Field label="Account Number">
            <Input
              value={data.account_number || ""}
              disabled={!isEmployee || isVerified}
              onChange={(e) =>
                onChange("account_number", e.target.value)
              }
            />
          </Field>

          <Field label="IFSC Code">
            <Input
              value={data.ifsc_code || ""}
              disabled={!isEmployee || isVerified}
              onChange={(e) => onChange("ifsc_code", e.target.value)}
            />
          </Field>

          <Field label="PAN Number">
            <Input value={data.pan_no} disabled />
          </Field>
        </div>
      </section>

      {/* VERIFICATION */}
      <section className="bg-white border rounded-xl p-5 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">
            Verification Status
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            {isVerified
              ? "Bank details have been verified by HR."
              : "Bank details are pending verification."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full
              ${
                isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
          >
            {isVerified ? "Verified" : "Pending"}
          </span>

          {isHR && !isVerified && (
            <button
              onClick={onVerify}
              className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Verify
            </button>
          )}
        </div>
      </section>

    </div>
  );
};
